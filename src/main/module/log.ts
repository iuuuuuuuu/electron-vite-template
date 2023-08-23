import log from 'electron-log'

const initLog = () => {
  // 输出时间
  const logFormat = '[{level}] [{y}-{m}-{d} {h}:{i}:{s}.{ms}] {scope} {text}'
  log.transports.console.format = logFormat
  log.transports.file.format = logFormat
  // 日志大小，默认：1048576（1M），达到最大上限后，备份文件并重命名为：main.old.log，有且仅有一个备份文件
  log.transports.file.maxSize = 1048576
  return Object.assign(console, log.functions)
}

export default initLog
