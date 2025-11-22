/*
 * Game-loop based timer that emits 'tick' events at a regular interval.
 *
 */

class Timer {
  // 8 ticks per two seconds
  dt = 0
  counter = 0
  maxCounter = 8
  cutoff = (2 / 8) * 1000
  prevTime = 0
  ref = 0

  run = time => {
    if (this.prevTime > 0) {
      this.dt += time - this.prevTime

      if (this.dt >= this.cutoff) {
        this.dt %= this.cutoff
        this.counter = (this.counter + 1) % this.maxCounter
        this.tick()
      }
    }
    this.prevTime = time
    this.ref = requestAnimationFrame(this.run)
  }

  tick () {
    document.dispatchEvent(
      new CustomEvent('tick', {
        detail: { i: this.counter }
      })
    )
  }

  /*
    run = (time: number) => {
    this.ref = requestAnimationFrame(this.run)
    if (this.prevTime > 0) {
      this.callback && this.callback(time - this.prevTime)
    }
    this.prevTime = time
  }


    every (ms: number, iterations: number, cb: DeltaTimeCallback) {
    return new Promise<void>(resolve => {
      if (this.callback) {
        throw new Error('timer is already running')
      }

      let time = 0
      let i = 0

      this.callback = dt => {
        time += dt

        if (time >= ms) {
          cb(time)
          time %= ms
          i++
        }

        if (iterations > 0 && i >= iterations) {
          this.stop()
          resolve()
        }
      }

      this.run(this.prevTime)
    })
      */
}

export const timer = new Timer()
