/*
 * Web component button to turn the volume on and off
 *
 */

import * as css from 'bundle-text:./audio-toggle.css'

class AudioToggle extends HTMLElement {
  static get observedAttributes () {
    return ['on', 'off']
  }

  attributeChangedCallback (name, _oldValue, newValue) {
    // normalize: ensure only one of 'on' or 'off'
    if (name === 'on' && newValue !== null) {
      if (this.hasAttribute('off')) this.removeAttribute('off')
    } else if (name === 'off' && newValue !== null) {
      if (this.hasAttribute('on')) this.removeAttribute('on')
    }
    // if both removed externally, default to off state
    if (!this.hasAttribute('on') && !this.hasAttribute('off')) {
      this.setAttribute('off', '')
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

  get on () {
    return this.hasAttribute('on')
  }

  set on (value) {
    if (value) {
      this.setAttribute('on', '')
      this.removeAttribute('off')
    } else {
      this.setAttribute('off', '')
      this.removeAttribute('on')
    }
    this.updateIcon()
  }

  toggle = () => {
    this.on = !this.on
    this.on ? this.dispatchUnmute() : this.dispatchMute()
  }

  dispatchMute () {
    const event = new CustomEvent('audio-mute', {
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(event)
  }

  dispatchUnmute () {
    const event = new CustomEvent('audio-unmute', {
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(event)
  }

  updateIcon () {
    // derive state only from 'on' attribute
    const isOn = this.hasAttribute('on')
    const iconSrc = isOn ? 'ui/volume.svg' : 'ui/volume-slash.svg'
    this.$icon.src = `images/${iconSrc}`
    this.$icon.alt = isOn ? 'Sound On' : 'Sound Off'
  }
}

customElements.define('audio-toggle', AudioToggle)
