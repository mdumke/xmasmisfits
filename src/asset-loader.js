const ASSET_MAPPING_PATH = 'assets.json'
const IMAGE_BASE_PATH = 'images'

class AssetLoader {
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
    return await response.json()
  }
}

export const assetLoader = new AssetLoader()
