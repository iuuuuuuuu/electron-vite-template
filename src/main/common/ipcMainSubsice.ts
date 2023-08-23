import { ipcMain } from 'electron'
import { ipcEventNames } from '../../config/staticConfig'

// 储存事件回调
const eventCallbacks = new Map()

ipcMain.on(
  ipcEventNames.IPC_MAIN_EVENT,
  async (_e, params: iuEvent.EventType): Promise<iuEvent.EventRes> => {
    let { eventName, data } = params
    const event = eventCallbacks.get(eventName)
    // return console.log(eventName, params)
    try {
      data = JSON.parse(data)
    } catch (error) {}
    try {
      if (!event) {
        return {
          code: 500,
          data: '事件不存在'
        }
      } else {
        const resp = await event(data)
        return {
          code: 200,
          data: resp
        }
      }
    } catch (error: any) {
      return {
        code: 500,
        data: error.message
      }
    }
  }
)

export default class ipcMainSubsice {
  private constructor() {}

  /**
   * @description: 事件监听
   */
  public static on(eventName: string, callback: Function) {
    if (eventCallbacks.has(eventName)) {
      console.error(`事件${eventName}已存在,上一个事件已卸载!`)
      ipcMainSubsice.off(eventName)
    }
    eventCallbacks.set(eventName, callback)
  }
  /**
   * @description: 事件卸载
   */
  public static off(eventName: string) {
    eventName = eventName.trim()
    if (eventCallbacks.has(eventName)) {
      eventCallbacks.delete(eventName)
      console.log(`事件${eventName}已卸载`)
    } else {
      console.error(`事件${eventName}不存在,无法卸载!`)
    }
  }
}
