import path from 'path'
import { is } from '@electron-toolkit/utils'
import { app } from 'electron'

// 应用icon
export const appIcon = path.join(__dirname, '../../resources/icon.png')

// 是否开发模式
export const isDev = is.dev && process.env['ELECTRON_RENDERER_URL'] ? true : false

// 日志目录
export const logPath = app.getPath('logs')

// 资源托管目录
export const resourcesPath = app.isPackaged
  ? path.join(app.getPath('exe'), '../resources/extraResources')
  : path.join(__dirname, '../../resources')
