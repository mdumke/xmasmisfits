import { ui } from '../ui.js'

export class CalendarContext {
  $calendar = null

  enter () {
    this.render()
    this.$calendar = ui.selectElement('#calendar')
    this.$calendar.addEventListener('click', this.onCalendarClick)
  }

  exit () {
    this.$calendar.removeEventListener('click', this.onCalendarClick)
  }

  render () {
    ui.renderTemplate('#calendar-screen')
    ui.renderCalendarAssets()
    ui.selectElement('#pan-container').scrollToCenter()
  }

  onCalendarClick = event => {
    const $door = event.target.closest('[data-door]')
    if ($door) {
      return ui.openDoor($door)
    }

    const $content = event.target.closest('[data-content]')
    if ($content) {
      console.log(`play ${$content.id}`)
    }
  }
}
