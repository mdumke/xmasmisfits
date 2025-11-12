/*
 * Web component to pan around an HTML element by clicking and dragging
 *
 */

import { template } from './template.js'

class PanContainer extends HTMLElement {
  isDown = false
  startX = 0
  startY = 0
  scrollLeft = 0
  scrollTop = 0

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$container = this.shadowRoot.querySelector('main')
  }

  connectedCallback () {
    this.scrollToCenter()
    this.registerListeners()
  }

  disconnectedCallback () {
    this.removeListeners()
  }

  scrollToCenter () {
    const { scrollWidth, clientWidth, scrollHeight, clientHeight } =
      this.$container
    const centerX = (scrollWidth - clientWidth) / 2
    const centerY = (scrollHeight - clientHeight) / 2
    this.$container.scrollTo(centerX, centerY)
  }

  registerListeners () {
    this.$container.addEventListener('pointerdown', this.startPan)
    this.$container.addEventListener('pointerleave', this.stopPan)
    this.$container.addEventListener('pointerup', this.stopPan)
    this.$container.addEventListener('pointermove', this.updatePan)
  }

  removeListeners () {
    this.$container.removeEventListener('pointerdown', this.startPan)
    this.$container.removeEventListener('pointerleave', this.stopPan)
    this.$container.removeEventListener('pointerup', this.stopPan)
    this.$container.removeEventListener('pointermove', this.updatePan)
  }

  startPan = e => {
    if (e.target.closest('[data-interactive]')) return

    this.isDown = true
    this.$container.classList.add('active')
    this.startX = e.clientX
    this.startY = e.clientY
    this.scrollLeft = this.$container.scrollLeft
    this.scrollTop = this.$container.scrollTop
    this.$container.setPointerCapture(e.pointerId)
  }

  updatePan = e => {
    if (!this.isDown) return

    e.preventDefault()
    const x = e.clientX
    const y = e.clientY
    const walkX = x - this.startX
    const walkY = y - this.startY
    this.$container.scrollLeft = this.scrollLeft - walkX
    this.$container.scrollTop = this.scrollTop - walkY
  }

  stopPan = e => {
    this.isDown = false
    this.$container.classList.remove('active')
    this.$container.releasePointerCapture(e.pointerId)
  }
}

customElements.define('pan-container', PanContainer)
