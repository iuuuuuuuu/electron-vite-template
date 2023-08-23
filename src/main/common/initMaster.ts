import { appIcon } from '../../config/dynamicConfig'
import { appName } from '../../config/staticConfig'
import { app, Tray, Menu } from 'electron'
import createMasterWin from '../manageWins/masterWin'
import log from '../module/log'

export default () => {
  registerTray()
  // 注册日志输出事件
  log()
}

/**
 * @description: 注册托盘图标
 */
export const registerTray = () => {
  const masterWin = createMasterWin()
  const tray = new Tray(appIcon)
  // 设置托盘悬浮提示
  tray.setToolTip(appName)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (masterWin == null) return
    const isVisable = masterWin.isVisible()
    if (isVisable) {
      masterWin.hide()
    } else {
      masterWin.show()
    }
  })
}
