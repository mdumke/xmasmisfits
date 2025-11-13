const ASSET_MAPPING_PATH = 'assets.json'
const IMAGE_BASE_PATH = 'images'

class AssetLoader {
  _assetMapping = null

  get assetMapping () {
    if (!this._assetMapping) {
      throw new Error('Asset mapping not loaded yet')
    }
    return Object.freeze(this._assetMapping)
  }

  // Load calendar assets with progress callback
  // onProgress: function(percent: number) => void
  async preloadCalendarAssets (onProgress) {
    if (!this._assetMapping) {
      await this.loadAssetMapping()
    }

    const imageFilenames = [
      this._assetMapping.background.filename,
      ...this._assetMapping.doors.map(door => door.filename)
    ]

    assetLoader.preloadImages(imageFilenames, (loaded, total) => {
      onProgress(total === 0 ? 0 : Math.floor((loaded / total) * 100))
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
