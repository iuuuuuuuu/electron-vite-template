import { NIcon } from 'naive-ui'
import { h } from 'vue'
/**
 *@description 通过ipmort 导入的icon 利用h函数渲染
 */
export const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, { default: () => h(icon) })
  }
}
