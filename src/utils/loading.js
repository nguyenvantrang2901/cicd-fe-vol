// src/utils/loading.js
import { ElLoading } from 'element-plus'

let loadingInstance = null

export const showLoading = (text = 'Loading...') => {
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.3)',
    })
  }
}

export const hideLoading = (minDuration = 1000) => {
  if (loadingInstance) {
    const instance = loadingInstance
    loadingInstance = null

    setTimeout(() => {
      instance.close()
    }, minDuration)
  }
}
