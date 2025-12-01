/*
 * Web component to pan around an HTML element by clicking and dragging
 *
 */

import { template } from './template.js'

/**
 * @element pan-container
 * @summary A container that allows panning of larger content by click-and-drag.
 *
 * Elements within the container that have the `data-interactive`
 * attribute will be exempt from the drag-to-pan operation.
 * This allows interactive child elements (such as buttons, links, or inputs)
 * to receive pointer events without triggering panning.
 */
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
    this.registerListeners()
  }

  disconnectedCallback () {
    this.removeListeners()
  }

  scrollToInitial () {
    const { scrollWidth, clientWidth, scrollHeight, clientHeight } =
      this.$container
    const centerX = (scrollWidth - clientWidth) / 2
    const centerY = (scrollHeight - clientHeight) / 2
    this.$container.scrollTo(centerX, centerY - 60)
  }

  scrollToPosition ({ x, y }) {
    this.$container.scrollTo(x, y)
  }

  startPan = e => {
    if (e.target.closest('[data-interactive]')) return
    this.isDown = true
    this.$container.classList.add('active')
    this.startX = e.clientX
    this.startY = e.clientY
    this.scrollLeft = this.$container.scrollLeft
    this.scrollTop = this.$container.scrollTop
    // For native scrolling, pointer capture is not needed; comment it out
    // this.$container.setPointerCapture(e.pointerId)
  }

  updatePan = e => {
    // With native scrolling, do not manually set scrollLeft/Top.
    // Keep this if you still want desktop mouse-drag behavior,
    // but on touch devices Safari won't deliver pointermove reliably.
    if (!this.isDown) return
    // e.preventDefault() can block native scroll; remove it for iOS touch
    // e.preventDefault()
    const x = e.clientX
    const y = e.clientY
    const walkX = x - this.startX
    const walkY = y - this.startY
    // On touch, let native scrolling do the work.
    // On desktop mouse, you may still want manual panning:
    if (e.pointerType === 'mouse') {
      this.$container.scrollLeft = this.scrollLeft - walkX
      this.$container.scrollTop = this.scrollTop - walkY
    }
  }

  stopPan = e => {
    this.isDown = false
    this.$container.classList.remove('active')
    // this.$container.releasePointerCapture(e.pointerId)
  }

  onScroll = () => {
    this.dispatchPanUpdate()
  }

  dispatchPanUpdate () {
    this.dispatchEvent(
      new CustomEvent('pan-update', {
        bubbles: true,
        composed: true,
        detail: {
          scrollLeft: this.$container.scrollLeft,
          scrollTop: this.$container.scrollTop
        }
      })
    )
  }

  registerListeners () {
    this.$container.addEventListener('pointerdown', this.startPan)
    this.$container.addEventListener('pointerup', this.stopPan)
    this.$container.addEventListener('pointercancel', this.stopPan)
    this.$container.addEventListener('pointermove', this.updatePan)
    this.$container.addEventListener('scroll', this.onScroll)
  }

  removeListeners () {
    this.$container.removeEventListener('pointerdown', this.startPan)
    this.$container.removeEventListener('pointerup', this.stopPan)
    this.$container.removeEventListener('pointercancel', this.stopPan)
    this.$container.removeEventListener('pointermove', this.updatePan)
    this.$container.removeEventListener('scroll', this.onScroll)
  }
}

customElements.define('pan-container', PanContainer)
