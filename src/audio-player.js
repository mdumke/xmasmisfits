class AudioPlayer {
  constructor () {
    this.audioCtx = null
    this.buffers = {}
    this.metainfo = {}
    this.activeSources = {}
  }

  play (name) {
    if (!this.audioCtx) {
      return console.warn(`[AudioPlayer] audio context is locked`)
    }

    const buffer = this.buffers[name]
    if (!buffer) {
      return console.warn(`[AudioPlayer] buffer "${name}" not found`)
    }

    const source = this.audioCtx.createBufferSource()
    source.buffer = buffer

    const vol = parseFloat(this.metainfo[name]?.volume) || 1.0
    const gain = this.audioCtx.createGain()
    gain.gain.value = Math.max(0, vol)
    source.connect(gain)
    gain.connect(this.audioCtx.destination)

    source.start(0)

    this.activeSources[name] = source
    source.onended = () => {
      delete this.activeSources[name]
    }
  }

  // Loads audio files and converts them to AudioBuffers.
  // This can be done even when the AudioContext is suspended.
  async load (name, src, config = {}) {
    const raw = await fetch(src)
    const buffer = await raw.arrayBuffer()
    this.buffers[name] = buffer
    this.metainfo[name] = { ...config }
  }

  async unlock () {
    if (this.audioCtx) return

    this.audioCtx = new AudioContext()
    await this.audioCtx.resume()
    await this.decodeBuffers()
    this.locked = false
  }

  async decodeBuffers () {
    if (!this.audioCtx) {
      console.warn('[AudioPlayer] cannot decode: audio context is locked')
      return
    }

    if (!this.audioCtx.state === 'running') {
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
