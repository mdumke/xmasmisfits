import {
  assetLoader,
  STAGE_TITLE_ASSETS,
  STAGE_CALENDAR_ASSETS
} from '../asset-loader.js'
import { ui } from '../ui'
import { contextManager } from './context-manager'
import { CalendarContext } from './calendar-context.js'
import { audioPlayer } from '../audio-player.js'

export class TitleContext {
  key = 'title-context'
  loadingProgress = 0
  autoSwitch = false
  $startBtn = null
  $progressBar = null

  enter () {
    this.$startBtn = ui.selectElement('#start-button')
    this.$speakerBtn = ui.selectElement('#speaker-button')
    this.$buttons = ui.selectElement('#interaction-area')
    this.$progressBar = ui.selectElement('#progress-bar')
    assetLoader.registerProgressCallback(this.key, this.onLoadingProgress)
    assetLoader.run()
    this.registerListeners()
  }

  exit () {
    this.removeListeners()
  }

  onLoadingProgress = (stage, progress, done) => {
    switch (stage) {
      case STAGE_TITLE_ASSETS:
        this.handleTitleAssetsProgress(progress, done)
        break
      case STAGE_CALENDAR_ASSETS:
        this.handleCalendarAssetsProgress(progress, done)
        break
    }
  }

  handleTitleAssetsProgress = async done => {
    if (!done) return

    this.$speakerBtn.addEventListener('click', this.onSpeakerBtnClick)
    this.$speakerBtn.disabled = false
    if (!audioPlayer.locked) {
      // if the player is still locked, decoding will happen
      // during the first user interaction
      await audioPlayer.decodeBuffers()
    }
  }

  handleCalendarAssetsProgress = (progress, done) => {
    this.loadingProgress = progress
    if (!this.autoSwitch) return

    this.updateProgressBar()
    if (!done) return

    assetLoader.unregisterProgressCallback(this.key)

    // Small delay to let users see 100% completion
    setTimeout(this.goToCalendar, 1200)
  }

  onStartClick = () => {
    assetLoader.calendarAssetsReady
      ? this.goToCalendar()
      : this.waitForPreload()
  }

  onSpeakerBtnClick = async () => {
    if (audioPlayer.locked) await audioPlayer.init()
    if (audioPlayer.isPaused) await audioPlayer.resume()

    await audioPlayer.decodeBuffers()

    this.$speakerBtn.disabled = true
    await ui.playSound('speaker-test')
    this.$speakerBtn.disabled = false
  }

  waitForPreload = () => {
    this.$buttons.classList.add('hide')
    this.$progressBar.classList.remove('hide')
    this.autoSwitch = true

    // give the bar a chance to render with width 0 first to enable transition
    setTimeout(this.updateProgressBar, 0)
  }

  goToCalendar = () => {
    contextManager.change(new CalendarContext())
  }

  updateProgressBar = () => {
    ui.updateProgressBar(this.$progressBar, this.loadingProgress)
  }

  registerListeners () {
    this.$startBtn.addEventListener('click', this.onStartClick)
  }

  removeListeners () {
    this.$startBtn.removeEventListener('click', this.onStartClick)
    this.$speakerBtn.removeEventListener('click', this.onSpeakerBtnClick)
  }
}
