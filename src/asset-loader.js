const ASSET_MAPPING_PATH = 'assets.json'
const IMAGE_BASE_PATH = 'images'

export const STAGE_INITIAL = 'initial'
export const STAGE_CALENDAR_ASSETS = 'calendar-assets'

class AssetLoader {
  progress = 0
  progressCallbacks = []
  loadingStage = STAGE_INITIAL
  calendarAssetsReady = false
  _assetMapping = null

  get assetMapping () {
    if (!this._assetMapping) {
      throw new Error('Asset mapping not loaded yet')
    }
    return Object.freeze(this._assetMapping)
  }

  async run () {
    await this.loadAssetMapping()
    await this.preloadCalendarAssets()
  }

  registerProgressCallback (key, cb) {
    cb(this.loadingStage, this.progress)
    this.progressCallbacks.push({ key, cb })
  }

  unregisterProgressCallback (key) {
    this.progressCallbacks = this.progressCallbacks.filter(
      item => item.key !== key
    )
  }

  // Load calendar assets with progress callback
  // onProgress: function(percent: number) => void
  async preloadCalendarAssets () {
    this.loadingStage = STAGE_CALENDAR_ASSETS

    const imageFilenames = [
      this._assetMapping.background.filename,
      ...this._assetMapping.doors.map(door => door.filename)
    ]

    assetLoader.preloadImages(imageFilenames, (loaded, total) => {
      const progress = total === 0 ? 0 : Math.floor((loaded / total) * 100)
      this.progress = progress
      this.progressCallbacks.forEach(({ cb }) =>
        cb(this.loadingStage, progress)
      )

      if (progress >= 100) {
        this.calendarAssetsReady = true
      }
    })
  }

  async preloadImages (filenames, onProgress) {
    let total = filenames.length
    let loaded = 0

    const imagePromises = filenames.map(filename =>
      this.preloadImage(`${IMAGE_BASE_PATH}/${filename}`).then(img => {
        loaded++
        if (onProgress) onProgress(loaded, total)
        return img
      })
    )

    await Promise.all(imagePromises)
  }

  async preloadImage (src) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
      img.src = src
    })
  }

  async loadAssetMapping () {
    const response = await fetch(ASSET_MAPPING_PATH)
    this._assetMapping = await response.json()
  }
}

export const assetLoader = new AssetLoader()
