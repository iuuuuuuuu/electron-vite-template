import { ipcMain } from 'electron'
import { ipcEventNames } from '../../config/staticConfig'

const events = new Map()

ipcMain.handle(
  ipcEventNames.IPC_HANDLE_EVENT,
  async (_e, params: iuEvent.EventType): Promise<iuEvent.EventRes> => {
    let { eventName, data } = params
    try {
      data = JSON.parse(data)
    } catch (error) {}
    const event = events.get(eventName)
    //   event && event(data)
    if (event) {
      try {
        const resp = await event(data)
        return {
          code: 200,
          data: JSON.stringify(resp)
        }
      } catch (error: any) {
        return {
          code: 500,
          data: error.message
        }
      }
    } else {
      return {
        code: 500,
        data: '事件不存在'
      }
    }
  }
)

export default class ipcHandleMainSubsice {
  private constructor() {}

  /**
   * @description: 事件监听
   */
  public static on(eventName: string, callback: Function) {
    if (events.has(eventName)) {
      console.error(`Handle 事件${eventName}已存在,上一个事件已卸载!`)
      ipcHandleMainSubsice.off(eventName)
    }
    events.set(eventName, callback)
  }

  /**
   * @description: 事件卸载
   */
  public static off(eventName: string) {
    eventName = eventName.trim()
    if (events.has(eventName)) {
      events.delete(eventName)
      console.log(`Handle 事件${eventName}已卸载`)
    } else {
      console.error(`Handle 事件${eventName}不存在,无法卸载!`)
    }
  }
}
