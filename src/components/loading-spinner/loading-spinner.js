/*
 * Web component that displays a spinning ring
 *
 */

import * as css from 'bundle-text:./loading-spinner.css'

/**
 * @element loading-spinner
 * @summary A loading spinner component.
 *
 * @part spinner - The spinner element.
 */
class LoadingSpinner extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
      <style>${css}</style>

      <div class="spinner" part="spinner"></div>
    `
  }
}

customElements.define('loading-spinner', LoadingSpinner)
