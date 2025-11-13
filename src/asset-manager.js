import { assetLoader } from './asset-loader.js'

class AssetManager {
  assetMapping = null
  imageProgressCallback = null
  imageProgress = { loaded: 0, total: 0, done: false }

  get imageBundleLoaded () {
    return this.imageProgress.done
  }

  // Register a callback to receive progress updates during image bundle loading
  // Signature: function(loaded: number, total: number) => void
  registerImageProgressCallback (callback) {
    callback(this.imageProgress.loaded, this.imageProgress.total)
    this.imageProgressCallback = callback
  }

  // Preload all calendar image assets
  // Use registerProgressCallback to get progress updates
  async loadImageBundle () {
    this.assetMapping = await assetLoader.loadAssetMapping()

    const imageFilenames = [
      this.assetMapping.map.filename,
      ...this.assetMapping.doors.map(door => door.filename)
    ]

    assetLoader.preloadImages(imageFilenames, (loaded, total) => {
      this.imageProgress.loaded = loaded
      this.imageProgress.total = total
      this.imageProgress.done = loaded === total

      if (this.imageProgressCallback) {
        this.imageProgressCallback(loaded, total)
      }
    })
  }
}

export const assetManager = new AssetManager()
