/*
 * Web component that adds a blur overlay masking to its parent element.
 * Used to blur out the edges of the calendar.
 *
 */

import * as css from 'bundle-text:./blur-overlay.css'

class BlurOverlay extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
    `
  }
}

customElements.define('blur-overlay', BlurOverlay)
