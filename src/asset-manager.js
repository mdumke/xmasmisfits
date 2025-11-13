import { assetLoader } from './asset-loader.js'

class AssetManager {
  assetMapping = null

  async loadCalendarAssets (onProgress) {
    this.assetMapping = await assetLoader.loadAssetMapping()

    const imageFilenames = [
      this.assetMapping.map.filename,
      ...this.assetMapping.doors.map(door => door.filename)
    ]

    assetLoader.preloadImages(imageFilenames, onProgress)
  }
}

export const assetManager = new AssetManager()
