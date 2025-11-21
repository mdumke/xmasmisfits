/*
 * Web component button to toggle full-screen mode
 *
 */

import * as css from 'bundle-text:./fullscreen-toggle.css'

class FullscreenToggle extends HTMLElement {
  static get observedAttributes () {
    return ['fullscreen', 'windowed']
  }

  attributeChangedCallback (name, _oldValue, newValue) {
    // normalize: ensure only one of 'fullscreen' or 'windowed'
    if (name === 'fullscreen' && newValue !== null) {
      if (this.hasAttribute('windowed')) this.removeAttribute('windowed')
    } else if (name === 'windowed' && newValue !== null) {
      if (this.hasAttribute('fullscreen')) this.removeAttribute('fullscreen')
    }
    // if both removed externally, default to windowed state
    if (!this.hasAttribute('fullscreen') && !this.hasAttribute('windowed')) {
      this.setAttribute('windowed', '')
    }
    this.updateIcon()
  }

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <div class="img-wrapper"><img /></div>
    `
    this.$icon = this.shadowRoot.querySelector('img')
    this.updateIcon()
    this.addEventListener('click', this.toggle)
  }

  get fullscreen () {
    return this.hasAttribute('fullscreen')
  }

  set fullscreen (value) {
    if (value) {
      this.setAttribute('fullscreen', '')
      this.removeAttribute('windowed')
    } else {
      this.setAttribute('windowed', '')
      this.removeAttribute('fullscreen')
    }
    this.updateIcon()
  }

  toggle = () => {
    this.fullscreen = !this.fullscreen
    this.fullscreen
      ? this.dispatchEnterFullScreen()
      : this.dispatchExitFullScreen()
  }

  dispatchEnterFullScreen () {
    const event = new CustomEvent('enter-fullscreen', {
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(event)
  }

  dispatchExitFullScreen () {
    const event = new CustomEvent('exit-fullscreen', {
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(event)
  }

  updateIcon () {
    if (this.fullscreen) {
      this.$icon.src = 'images/ui/minimize.svg'
      this.$icon.alt = 'Exit full-screen'
    } else {
      this.$icon.src = 'images/ui/maximize.svg'
      this.$icon.alt = 'Enter full-screen'
    }
  }
}

customElements.define('fullscreen-toggle', FullscreenToggle)
