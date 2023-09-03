import { useAppStore, getAppStoreKeys } from '@renderer/store/getAppStore'
export default () => {
  const appStore = useAppStore()
  getAppStoreKeys().map((key) => {
    const piniakeyLength = Object.keys(appStore[key]).length
    console.log(window.elStore.appStore.get(key))
    const elStoreVal = window.elStore.appStore.get(key)
    if (!elStoreVal) return
    const elStorekeyLength = Object.keys(elStoreVal as string[]).length
    if (elStorekeyLength > piniakeyLength || elStorekeyLength == piniakeyLength) {
      let data = window.elStore.appStore.get(key)
      try {
        data = JSON.parse(data as string)
      } catch (error) {}
      appStore[key] = data
    }
  })
}
