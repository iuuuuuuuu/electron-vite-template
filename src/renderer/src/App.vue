<script setup lang="ts">
import { NMessageProvider, darkTheme, lightTheme } from 'naive-ui'
import { useRouter, useRoute, RouteLocationRaw } from 'vue-router'
import getAppStore, { useAppStore, getAppStoreKeys } from '@renderer/store/getAppStore'
import ipcEventListen from '@renderer/common/ipcEventListen'
import { ipcEventNames } from './config/renderConfigs'
import asyncStore from '@renderer/common/module/asyncStore'
const appStore = useAppStore()
const { userConfig, winRecord } = getAppStore()

const $router = useRouter()
const $route = useRoute()
$router.push('/')

/**
 * @description 负责路由跳转
 */
ipcEventListen.on(ipcEventNames.ROUTER_REPLACE, (to: RouteLocationRaw) => {
  console.log('to', to)
  setTimeout(() => {
    if (typeof to == 'string') {
      $router.replace(to)
    } else {
      $router.replace(to)
    }
  }, 300)
})

/**
 *@description 负责同步配置
 */
appStore.$subscribe(() => {
  getAppStoreKeys().map((key) => {
    window.elStore.appStore.set(key, appStore.$state[key])
    localStorage.setItem(key, JSON.stringify(appStore.$state[key]))
  })
})

/**
 *@description 各个窗口同步本地数据
 */
asyncStore()
let asyncStoreTimer: NodeJS.Timeout | null = null
window.addEventListener('storage', () => {
  asyncStoreTimer && clearTimeout(asyncStoreTimer)
  asyncStoreTimer = setTimeout(() => {
    asyncStore()
  }, 200)
})
ipcEventListen.on(ipcEventNames.WIN_CONFIG, (config: winConfigType) => {
  winRecord.value = config
})
</script>

<template>
  <n-notification-provider>
    <NMessageProvider>
      <n-dialog-provider>
        <n-config-provider :theme="userConfig.isThemeDark ? darkTheme : lightTheme">
          <n-el
            tag="div"
            :id="$route.path == '/' ? '' : 'bigBox'"
            class="w-screen h-screen overflow-hidden rounded-md"
            :class="{
              'bg-white': !userConfig.isThemeDark,
              'bg-slate-900': userConfig.isThemeDark
            }"
          >
            <RouterView />
          </n-el>
        </n-config-provider>
      </n-dialog-provider>
    </NMessageProvider>
  </n-notification-provider>
</template>

<style lang="less">
#bigBox {
  border: solid 0.1vh var(--divider-color);
}
</style>
