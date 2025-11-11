import './components/pan-container/pan-container.js'

document.getElementById('door-04').addEventListener('click', e => {
  console.log('door 04 clicked')
  e.currentTarget.classList.add('open')
})

document.getElementById('door-04-content').addEventListener('click', () => {
  console.log('play door 04 content')
})
