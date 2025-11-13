import { assetLoader, STAGE_CALENDAR_ASSETS } from '../asset-loader.js'
import { ui } from '../ui'
import { contextManager } from './context-manager'
import { CalendarContext } from './calendar-context.js'

export class TitleContext {
  key = 'title-context'
  assetsLoaded = false
  autoSwitch = false
  $startBtn = null
  $progressBar = null

  enter () {
    ui.renderTemplate('#title-screen')
    this.$startBtn = ui.selectElement('#start-button')
    this.$progressBar = ui.selectElement('#progress-bar')
    this.$startBtn.addEventListener('click', this.onStartClick)
    assetLoader.registerProgressCallback(this.key, this.onLoadingProgress)
    assetLoader.run()
  }

  onLoadingProgress = (stage, progress) => {
    if (stage !== STAGE_CALENDAR_ASSETS) return

    // Ensure the progress bar shows at least 2% to indicate activity
    this.$progressBar.setAttribute('value', Math.max(progress, 2))
    this.assetsLoaded = progress >= 100

    if (this.assetsLoaded && this.autoSwitch) {
      // Small delay to let the user see 100% completion
      setTimeout(this.goToCalendar, 1200)
    }
  }

  exit () {
    this.$startBtn.removeEventListener('click', this.onStartClick)
    assetLoader.unregisterProgressCallback(this.key)
  }

  onStartClick = () => {
    this.assetsLoaded ? this.goToCalendar() : this.waitForPreload()
  }

  waitForPreload = () => {
    this.$startBtn.classList.add('hide')
    this.$progressBar.classList.remove('hide')
    this.autoSwitch = true
  }

  goToCalendar = () => {
    contextManager.change(new CalendarContext())
  }
}
