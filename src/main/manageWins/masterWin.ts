import { app } from 'electron'
import { createWins, myAppWindw } from '../module/createWins'
import { winNames, winConfigs } from '../../config/winConfig'

let masterWin: myAppWindw | null = null
const winName = winNames.MASTER_WIN
const winSizeConfig = winConfigs[winName]
export default function createMasterWin() {
  if (!masterWin) {
    masterWin = createWins(
      winName,
      {
        height: winSizeConfig.height,
        width: winSizeConfig.width
      },
      winSizeConfig
    )
    masterWin.on('close', () => {
      app.quit()
    })
  }
  return masterWin
}
