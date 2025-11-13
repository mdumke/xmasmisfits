import { assetManager } from '../asset-manager.js'
import { ui } from '../ui'
import { contextManager } from './context-manager'
import { CalendarContext } from './calendar-context.js'

export class TitleContext {
  $startBtn = null
  $progressBar = null
  autoSwitch = false

  enter () {
    ui.renderTemplate('#title-screen')
    this.$startBtn = ui.selectElement('#start-button')
    this.$progressBar = ui.selectElement('#progress-bar')
    this.$startBtn.addEventListener('click', this.onStartClick)

    assetManager.registerImageProgressCallback((loaded, total) => {
      const progress = total === 0 ? 0 : Math.floor((loaded / total) * 100)
      this.$progressBar.textContent = `${progress}%`

      if (loaded === total && this.autoSwitch) {
        this.goToCalendar()
      }
    })
    assetManager.loadImageBundle()
  }

  exit () {
    this.$startBtn.removeEventListener('click', this.onStartClick)
  }

  onStartClick = () => {
    assetManager.imageBundleLoaded ? this.goToCalendar() : this.waitForPreload()
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
