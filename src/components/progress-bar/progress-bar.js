/*
 * Web component to display a simple progress bar
 *
 */

import { template } from './template.js'

/**
 * @element progress-bar
 * @summary A simple accessible progress indicator.
 *
 * @attr {number} value - The current progress value.
 * @attr {number} max - The maximum progress value.
 * @part bar - The filled bar element, used for styling.
 */
class ProgressBar extends HTMLElement {
  static get observedAttributes () {
    return ['value', 'max']
  }

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$container = this.shadowRoot.querySelector('#container')
    this.$bar = this.shadowRoot.querySelector('#bar')
  }

  connectedCallback () {
    this.setAttribute('role', 'progressbar')
    this.setAttribute('aria-valuemin', '0')
    this.update()
  }

  attributeChangedCallback () {
    this.update()
  }

  update () {
    const max = Number(this.getAttribute('max') || 100)
    const value = Math.min(Number(this.getAttribute('value') || 0), max)
    const percent = max === 0 ? 0 : (value / max) * 100
    this.$bar.style.width = `${percent}%`
    this.setAttribute('aria-valuenow', value.toString())
    this.setAttribute('aria-valuemax', max.toString())
  }
}

customElements.define('progress-bar', ProgressBar)
