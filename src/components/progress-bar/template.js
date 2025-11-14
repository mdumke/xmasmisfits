import * as css from 'bundle-text:./progress-bar.css'

export const template = document.createElement('template')

template.innerHTML = `
  <style>${css}</style>

  <main id="bar" class="bar" part="bar"></main>
`
