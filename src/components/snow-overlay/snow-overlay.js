/*
 * Web component that renders snow on a transparent canvas overlay
 *
 */

import { template } from './template.js'
import { SnowCanvas } from './snow-canvas.js'

class SnowOverlay extends HTMLElement {
  static get observedAttributes () {
    return ['width', 'height']
  }

  get width () {
    return this.getAttribute('width') || 300
  }

  set width (val) {
    this.setAttribute('width', val)
  }

  get height () {
    return this.getAttribute('height') || 150
  }

  set height (val) {
    this.setAttribute('height', val)
  }

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$canvas = this.shadowRoot.querySelector('canvas')
    this.snowCanvas = new SnowCanvas(this.$canvas)
  }

  disconnectedCallback () {
    this.snowCanvas.stop()
  }

  attributeChangedCallback (name, _oldValue, newValue) {
    if (name === 'width') {
      this.style.width = `${newValue}px`
      this.$canvas.width = Number(newValue)
    }
    if (name === 'height') {
      this.style.height = `${newValue}px`
      this.$canvas.height = Number(newValue)
    }
  }

  startSnow (count) {
    this.snowCanvas.start(count)
  }
}

customElements.define('snow-overlay', SnowOverlay)
