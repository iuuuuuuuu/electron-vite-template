import { ipcEventNames } from '@renderer/config/renderConfigs'
const { electron } = window
const { ipcRenderer } = electron

const events = new Map()
ipcRenderer.removeAllListeners(ipcEventNames.IPC_EVENT)
ipcRenderer.on(
  ipcEventNames.IPC_EVENT,
  async (_e, params: iuEvent.EventType): Promise<iuEvent.EventRes> => {
    let { eventName, data } = params
    const event = events.get(eventName)
    // console.log(eventName, data)
    try {
      data = JSON.parse(data)
    } catch (error) {}
    return event && (await event(data))
  }
)

export default class ipcEventListen {
  private constructor() {}

  /**
   * @description: IPC事件监听
   */
  public static on(eventName: string, callback: Function) {
    eventName = eventName.trim()
    if (events.has(eventName)) {
      console.warn(`ipc event ${eventName} has been registered`)
      events.delete(eventName)
    }
    events.set(eventName, callback)
  }
  /**
   * @description: IPC事件移除监听
   */
  public static off(eventName: string) {
    events.delete(eventName.trim())
  }
  /**
   * @description: IPC事件发送
   */
  public static send(eventName: string, params: any) {
    ipcRenderer.send(ipcEventNames.IPC_MAIN_EVENT, {
      eventName,
      data: JSON.stringify(params)
    })
  }
  /**
   * @description: IPC事件发送并等待返回
   */
  public static async invoke(eventName: string, params: any) {
    const resp = await ipcRenderer.invoke(ipcEventNames.IPC_HANDLE_EVENT, {
      eventName,
      data: params
    })
    console.log('resp', eventName, resp)

    let { data, code } = resp
    try {
      data = JSON.parse(data)
    } catch (error) {}
    if (code == 200) {
      return data
    } else {
      console.error('eventName', data)
      return false
    }
  }
}
