// Represents a container that can hold elements larger than its viewport
// and allows panning via mouse drag.
//
// Adds an 'active' class to the container when panning is ongoing.
export class PanContainer {
  isDown = false
  startX = 0
  startY = 0
  scrollLeft = 0
  scrollTop = 0

  // $container is the scrolling element
  // $wrapper is the interaction area that listens for mouse events
  constructor ($container, $wrapper) {
    this.$container = $container
    this.$wrapper = $wrapper
    this.init()
  }

  init () {
    this.scrollToCenter()
    this.registerListeners()
  }

  registerListeners () {
    this.$container.addEventListener('mousedown', this.onMouseDown)
    this.$wrapper.addEventListener('mouseleave', this.onMouseLeave)
    this.$wrapper.addEventListener('mouseup', this.onMouseUp)
    this.$wrapper.addEventListener('mousemove', this.onMouseMove)
  }

  scrollToCenter () {
    const { scrollWidth, clientWidth, scrollHeight, clientHeight } =
      this.$container
    const centerX = (scrollWidth - clientWidth) / 2
    const centerY = (scrollHeight - clientHeight) / 2
    this.$container.scrollTo(centerX, centerY)
  }

  onMouseDown = e => {
    this.isDown = true
    this.$wrapper.classList.add('active')
    this.$container.classList.add('active')
    this.startX = e.clientX
    this.startY = e.clientY
    this.scrollLeft = this.$container.scrollLeft
    this.scrollTop = this.$container.scrollTop
  }

  onMouseMove = e => {
    if (!this.isDown) return
    e.preventDefault()
    const x = e.clientX
    const y = e.clientY
    const walkX = x - this.startX
    const walkY = y - this.startY
    this.$container.scrollLeft = this.scrollLeft - walkX
    this.$container.scrollTop = this.scrollTop - walkY
  }

  onMouseLeave = () => {
    this.isDown = false
  }

  onMouseUp = () => {
    this.isDown = false
  }
}
