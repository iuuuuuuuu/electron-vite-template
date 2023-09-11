import { BrowserWindow, BrowserWindowConstructorOptions, app, shell } from 'electron'
import { RouteLocationRaw } from 'vue-router'

import * as path from 'path'
import { appIcon, isDev } from '../../config/dynamicConfig'
import { ipcEventNames } from '../../config/staticConfig'
import { winConfigs } from '../../config/winConfig'
import { winPositionRecord } from '../store/elStore'
import ipcMainSubsice from '../common/ipcMainSubsice'

export const allWindows: { [key: string]: myAppWindw } = {}

export const createWins = (
  name: string,
  config: BrowserWindowConstructorOptions,
  winConfig: winConfigType
) => {
  let activeWin = allWindows[name]
  if (!allWindows[name]) {
    allWindows[name] = new myAppWindw(name, config, winConfig)
    // 禁止出现右键菜单
    activeWin = allWindows[name]
    activeWin.hookWindowMessage(278, () => {
      activeWin.setEnabled(false)
      setTimeout(() => activeWin.setEnabled(true), 300)
      return true
    })
  }
  return activeWin
}

export class myAppWindw extends BrowserWindow {
  public name: string
  constructor(
    winName: string,
    config: Electron.BrowserWindowConstructorOptions,
    winConfig: winConfigType
  ) {
    const baseConfig: Electron.BrowserWindowConstructorOptions = {
      // 图标
      icon: appIcon,
      width: config.width,
      minWidth: config.width,
      maxWidth: config.width,
      height: config.height,
      minHeight: config.height,
      maxHeight: config.height,
      show: false,
      useContentSize: false,
      // 禁止用户改变窗口大小
      resizable: false,
      //开自定义外窗
      frame: false,
      // 透明窗口
      transparent: true,
      // 窗口置顶
      // alwaysOnTop: true,
      // 窗口居中
      center: true,
      // 窗口最大化
      maximizable: false,
      // 窗口最小化
      minimizable: false,
      autoHideMenuBar: true,
      fullscreen: true,
      fullscreenable: false, //窗口是否可以进入全屏模式。在macOS上，最大化/缩放按钮是否应该切换到全屏模式或最大化窗口。默认为true。
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        plugins: true,
        backgroundThrottling: false,
        // 沙盒关闭
        sandbox: false,
        // 关闭安全 解决跨域问题
        webSecurity: false,
        // remote 模块
        // enableRemoteModule: true,
        // nativeWindowOpen: false,
        devTools: isDev
      },
      ...(process.platform === 'linux' ? { icon: appIcon } : {})
    }
    const finalConfig = Object.assign(baseConfig, config)
    super(finalConfig)
    // 名字
    this.name = winName
    this.on('ready-to-show', () => {
      isDev && this.webContents.openDevTools()

      // 变回原来的大小 并且跳转到指定页面

      // 自定义配置
      if (winConfig.resizeWidth && winConfig.resizeHeight && winConfig.redirectTo?.now) {
        this.resetSize(winConfig.resizeWidth, winConfig.resizeHeight, winConfig.redirectTo.url)
      } else if (winConfig.redirectTo?.now) {
        // 重定向路由
        winConfig.redirectTo.url && this.redirectTo(winConfig.redirectTo.url)
      }
      if (winConfig.x && winConfig.y) {
        this.setPosition(winConfig.x, winConfig.y)
      }
      /**
       * @description: 通知渲染进程保存窗口配置
       */
      this.sendIpcEvent(ipcEventNames.WIN_CONFIG, winConfigs[this.name])
    })
    this.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
    // 窗口移动时保存位置
    this.on('moved', () => {
      const getContentBounds = this.getContentBounds()
      winPositionRecord.set(this.name, getContentBounds)
    })
    if (isDev) {
      const url = process.env['ELECTRON_RENDERER_URL'] || false
      if (!url) {
        new Electron.Notification({
          title: 'ELECTRON_RENDERER_URL is not defined'
        })
        app.quit()
      } else {
        this.loadURL(url)
      }
    } else {
      this.loadFile(path.join(__dirname, '../renderer/index.html'))
    }
  }
  /**
   * @description: 重置窗口大小
   */
  resetSize(width: number, height: number, to?: RouteLocationRaw) {
    this.setOpacity(0)
    this.setMaximumSize(width, height)
    this.setMinimumSize(width, height)
    this.setSize(width, height)
    this.center()
    to && this.redirectTo(to)
    setTimeout(() => {
      this.setOpacity(1)
      // this.show()
    }, 500)
  }
  /**
   * @description: 重定向路由
   */
  redirectTo(to: RouteLocationRaw) {
    this.sendIpcEvent(ipcEventNames.ROUTER_REPLACE, to)
  }
  /**
   * @description: 发送ipc事件
   */
  sendIpcEvent(eventName: string, data?: any) {
    this.webContents.send(ipcEventNames.IPC_EVENT, { eventName, data })
  }
}

export const templateWinConfig = (config?: Electron.BrowserWindowConstructorOptions) => {
  return {
    height: 1,
    width: 1,
    x: -1,
    y: -1,
    // 隐藏任务栏
    type: 'toolbar',
    // 窗口置顶
    alwaysOnTop: true,
    // 禁止移动窗口
    movable: true,
    ...config
  }
}

ipcMainSubsice.on(ipcEventNames.WIN_ACTION, (params: { action: winActionType; name: string }) => {
  const { action, name } = params
  // console.log('收到窗口操作', params)
  const win = allWindows[name]
  if (!win) console.warn('窗口不存在', allWindows)
  switch (action) {
    case 'close': {
      win.close()
      break
    }
    case 'hide': {
      win.hide()
      break
    }
    case 'show': {
      win.show()
      break
    }
    case 'minimize': {
      win.minimize()
    }
  }
})
