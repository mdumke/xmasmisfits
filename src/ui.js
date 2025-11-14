import { assetLoader } from './asset-loader.js'
class UI {
  $app = null

  constructor () {
    this.$app = this.selectElement('#app')
  }

  renderTemplate (selector) {
    const template = this.selectElement(selector)
    const clone = template.content.cloneNode(true)
    this.$app.innerHTML = ''
    this.$app.appendChild(clone)
  }

  renderCalendarAssets () {
    const assets = assetLoader.assetMapping
    const $calendar = ui.selectElement('#calendar')
    this.renderBackground($calendar, assets)
    this.renderDoors($calendar, assets)
  }

  renderBackground ($calendar, { background }) {
    $calendar.style.backgroundImage = `url('images/${background.filename}')`
    $calendar.style.width = `${background.width}px`
    $calendar.style.height = `${background.height}px`
  }

  renderDoors ($calendar, { doors }) {
    $calendar.innerHTML = ''
    doors.forEach(door => $calendar.appendChild(this.buildDoorElement(door)))
  }

  insertActivePackages () {
    const assets = assetLoader.assetMapping
    assets.doors.forEach(door => {
      const $door = ui.selectElement(`#${door.id}`)
      const filename = assets.packages[door.packageId]?.filename
      const $content = this.buildContentElement(door, filename)
      $door.parentNode.insertBefore($content, $door)
    })
  }

  buildContentElement (door, imageFilename) {
    const $content = document.createElement('div')
    $content.classList.add('door-content')
    $content.id = `${door.id}-content`
    $content.style.width = '91px'
    $content.style.height = '131px'
    $content.style.top = `${door.position.y}px`
    $content.style.left = `${door.position.x}px`
    $content.style.backgroundImage = `url('images/${imageFilename}')`
    $content.dataset.interactive = ''
    $content.dataset.content = ''
    return $content
  }

  buildDoorElement (door) {
    const $door = document.createElement('div')
    $door.classList.add('door')
    $door.id = door.id
    $door.style.width = '91px'
    $door.style.height = '131px'
    $door.style.top = `${door.position.y}px`
    $door.style.left = `${door.position.x}px`
    $door.style.backgroundImage = `url('images/${door.filename}')`
    $door.dataset.interactive = ''
    $door.dataset.door = ''
    const $text = document.createElement('div')
    $text.classList.add('door-text')
    $text.textContent = door.label || 'N/A'
    $door.appendChild($text)
    return $door
  }

  openDoor ($door) {
    const currentLeft = parseInt($door.style.left, 10) || 0
    $door.style.left = `${currentLeft - 81}px`
    $door.removeAttribute('data-interactive')
    $door.removeAttribute('data-door')
  }

  updateProgressBar ($bar, progress, minValue = 2) {
    // showing at least minValue indicates activity
    $bar.setAttribute('value', Math.max(progress, minValue))
  }

  selectElement (selector) {
    const $el = document.querySelector(selector)
    if (!$el) {
      throw new Error(`UI element not found: ${selector}`)
    }

    return $el
  }
}

export const ui = new UI()
