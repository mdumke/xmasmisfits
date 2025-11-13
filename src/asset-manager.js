import { assetLoader } from './asset-loader.js'

class AssetManager {
  assetMapping = null

  // Load calendar assets with progress callback
  // onProgress: function(percent: number) => void
  async loadCalendarAssets (onProgress) {
    this.assetMapping = await assetLoader.loadAssetMapping()

    const imageFilenames = [
      this.assetMapping.map.filename,
      ...this.assetMapping.doors.map(door => door.filename)
    ]

    assetLoader.preloadImages(imageFilenames, (loaded, total) => {
      onProgress(total === 0 ? 0 : Math.floor((loaded / total) * 100))
    })
  }
}

export const assetManager = new AssetManager()
