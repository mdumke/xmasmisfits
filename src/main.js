import { PanContainer } from './pan-container.js'

const $app = document.querySelector('#app')
const $panContainer = document.querySelector('#pan-container')

new PanContainer($panContainer, $app)
