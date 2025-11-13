import { assetManager } from '../asset-manager.js'
import { ui } from '../ui'
import { contextManager } from './context-manager'
import { CalendarContext } from './calendar-context.js'

export class TitleContext {
  $startBtn = null
  $progressBar = null
  assetsLoaded = false
  autoSwitch = false

  enter () {
    ui.renderTemplate('#title-screen')
    assetManager.loadCalendarAssets(this.onLoadingProgress)
    this.$startBtn = ui.selectElement('#start-button')
    this.$progressBar = ui.selectElement('#progress-bar')
    this.$startBtn.addEventListener('click', this.onStartClick)
  }

  onLoadingProgress = (loaded, total) => {
    const progress = total === 0 ? 0 : Math.floor((loaded / total) * 100)
    this.$progressBar.textContent = `${progress}%`
    this.assetsLoaded = loaded === total

    if (this.assetsLoaded && this.autoSwitch) {
      this.goToCalendar()
    }
  }

  exit () {
    this.$startBtn.removeEventListener('click', this.onStartClick)
  }

  onStartClick = () => {
    this.assetsLoaded ? this.goToCalendar() : this.waitForPreload()
  }

  waitForPreload () {
    this.$startBtn.classList.add('hide')
    this.$progressBar.classList.remove('hide')
    this.autoSwitch = true
  }

  goToCalendar () {
    contextManager.change(new CalendarContext())
  }
}
