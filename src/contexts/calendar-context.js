import { ui } from '../ui.js'

export class CalendarContext {
  enter () {
    ui.renderTemplate('#calendar-screen')
    this.$calendar = ui.selectElement('#calendar')
    this.$calendar.style.backgroundImage = "url('images/dummy-map.webp')"
    this.$door04 = ui.selectElement('#door-04')
    this.$door04.style.backgroundImage = "url('images/door-04-91-131.png')"
    this.registerListeners()
  }

  exit () {
    this.removeListeners()
  }

  onDoor04Click = () => {
    console.log('door 04 clicked')
    document.getElementById('door-04').classList.add('open')
  }

  onDoor04ContentClick = () => {
    console.log('play door 04 content')
  }

  registerListeners () {
    ui.selectElement('#door-04').addEventListener('click', this.onDoor04Click)
    ui.selectElement('#door-04-content').addEventListener(
      'click',
      this.onDoor04ContentClick
    )
  }

  removeListeners () {
    ui.selectElement('#door-04').removeEventListener(
      'click',
      this.onDoor04Click
    )
    ui.selectElement('#door-04-content').removeEventListener(
      'click',
      this.onDoor04ContentClick
    )
  }
}
