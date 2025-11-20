class AudioPlayer {
  constructor () {
    this.audioCtx = null
    this.masterGain = null
    this.buffers = {}
    this.activeSources = {}
  }

  play (name, { volume = 1.0, loop = false } = {}) {
    if (!this.audioCtx) {
      return console.warn(`[AudioPlayer] audio context is locked`)
    }

    const source = this.audioCtx.createBufferSource()
    source.buffer = this.buffers[name]
    source.loop = loop

    const gain = this.audioCtx.createGain()
    gain.gain.value = Math.max(0, volume)

    source.connect(gain)
    gain.connect(this.masterGain)

    source.start(0)

    this.activeSources[name] = { source, gain }
    source.onended = () => {
      delete this.activeSources[name]
    }
  }

  stop (name) {
    if (!this.audioCtx) {
      return console.warn(`[AudioPlayer] audio context is locked`)
    }

    const entry = this.activeSources[name]
    if (!entry) return

    entry.source.stop()
  }

  // Loads audio files and converts them to AudioBuffers.
  // This can be done even when the AudioContext is suspended.
  async load (name, src) {
    const raw = await fetch(src)
    const buffer = await raw.arrayBuffer()
    this.buffers[name] = buffer
  }

  async unlock () {
    if (this.audioCtx) return

    this.audioCtx = new AudioContext()
    this.masterGain = this.audioCtx.createGain()
    this.masterGain.gain.value = 1.0
    this.masterGain.connect(this.audioCtx.destination)
    await this.audioCtx.resume()
    await this.decodeBuffers()
    this.locked = false
  }

  async decodeBuffers () {
    if (!this.audioCtx) {
      console.warn('[AudioPlayer] cannot decode: audio context is locked')
      return
    }

    if (this.audioCtx.state !== 'running') {
      console.warn('[AudioPlayer] cannot decode: audio context is not running')
      return
    }

    await Promise.all(
      Object.entries(this.buffers).map(async ([name, arrayBuffer]) => {
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer)
        this.buffers[name] = audioBuffer
      })
    )
  }
}

export const audioPlayer = new AudioPlayer()
