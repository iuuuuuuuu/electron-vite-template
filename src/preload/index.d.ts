import { ElectronAPI } from '@electron-toolkit/preload'
import * as elStore from '../main/store/elStore'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    elStore: typeof elStore
  }
}
