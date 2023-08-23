import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'

export const useAppStore = defineStore('useAppStore', {
  state: (): {
    winRecord: winConfigType
    [key: string]: any
  } => {
    return {
      StorageSize: {
        size: '',
        updateTime: ''
      },
      userConfig: {
        isThemeDark: false
      },
      winRecord: {
        name: undefined
      }
    }
  },
  actions: {
    // async getStorageSize() {
    //   this.setStoreInfo()
    //   if (getStorageSizeTimer) {
    //     clearTimeout(getStorageSizeTimer)
    //   }
    //   getStorageSizeTimer = setTimeout(async () => this.setStoreInfo(), 1000 * 30)
    // },
    // async setStoreInfo() {
    //   this.StorageSize.size = await getUseSize()
    //   this.StorageSize.updateTime = new Date().toLocaleString()
    // }
  }
})

/**
 * 获取所有的 appStore 的 需要同步的 key
 */
const delKeys = ['StorageSize', 'winRecord']
export const getAppStoreKeys = () => {
  const appStore = useAppStore()
  const piniaKeysAry = Object.keys(appStore.$state)
  // 去除 winRecord 不需要同步的key
  delKeys.map((key) => {
    piniaKeysAry.splice(piniaKeysAry.indexOf(key), 1)
  })
  return piniaKeysAry
}

let store: ReturnType<typeof useAppStore>
export default () => {
  store = store ?? useAppStore()
  return storeToRefs(store)
}
