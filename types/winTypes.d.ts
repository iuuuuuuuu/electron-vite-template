interface winConfigType {
  name: undefined | string
  width?: number
  height?: number
  show?: boolean
  redirectTo?: {
    now?: boolean
    url?: string
  }
  resizeHeight?: number
  resizeWidth?: number
  x?: number
  y?: number
  // [key: string]: any
}

type winActionType = 'close' | 'hide' | 'show' | 'minimize'

declare interface Window {
  message: MessageApiInjection
  dialog: useDialogApiInjection
  notification: NotificationApiInjection
}

namespace iuEvent {
  interface EventType {
    eventName: string
    data: any
  }
  interface EventRes {
    code: 200 | 500
    data: any
  }
}
