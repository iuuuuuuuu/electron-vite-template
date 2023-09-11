export const winNames = {
  MASTER_WIN: 'masterWin'
}

export const winConfigs: {
  [key: string]: winConfigType
} = {
  [winNames.MASTER_WIN]: {
    name: winNames.MASTER_WIN,
    width: 1400,
    height: 800,
    show: true,
    redirectTo: {
      now: true,
      url: '/main'
    }
  }
}

export const winActions = {
  CLOSE: 'close',
  HIDE: 'hide',
  SHOW: 'show',
  // 最小化
  MINIMIZE: 'minimize'
}
