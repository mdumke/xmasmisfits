import * as css from 'bundle-text:./snow-overlay.css'

export const template = document.createElement('template')

template.innerHTML = `
  <style>${css}</style>

  <canvas class="snow-canvas"></canvas>
  <slot></slot>
`
