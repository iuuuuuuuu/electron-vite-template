<script setup lang="ts">
import {} from 'vue'
import { appName, ipcEventNames } from '@renderer/config/renderConfigs'
import getAppStore from '@renderer/store/getAppStore'
import ipcEventListen from '@renderer/common/ipcEventListen'
const { userConfig, winRecord } = getAppStore()
const { dialog, message } = window
const storeKey = 'askIsQuitApp'
const askQuitStore = () => {
  return localStorage.getItem(storeKey) == 'true'
}
const sendWinEvent = (eventName: winActionType) => {
  if (eventName == 'hide' && !askQuitStore()) {
    return dialog.info({
      title: '提示',
      content: '退出应用 Or 隐藏到任务栏?',
      positiveText: '退出应用',
      negativeText: '隐藏到任务栏',
      onPositiveClick: () => {
        message.success('已保存配置~')
        localStorage.setItem(storeKey, 'true')
        userConfig.value.isQuitApp = true
        sendWinEvent('close')
      },
      onNegativeClick: () => {
        message.success('已保存配置~')
        localStorage.setItem(storeKey, 'true')
        sendWinEvent('hide')
      }
    })
  }
  if (eventName == 'hide' && userConfig.value.isQuitApp) {
    return sendWinEvent('close')
  }
  console.log('eventName', eventName)

  ipcEventListen.send(ipcEventNames.WIN_ACTION, {
    action: eventName,
    name: winRecord.value.name
  })
}
</script>
<template>
  <div id="nav" class="w-full">
    <div
      class="bar flex center h-5 justify-between px-1 absolute w-full z-50 rounded-md border-b-rose-400"
      :class="userConfig.isThemeDark ? 'bg-slate-100' : ' bg-gray-50'"
    >
      <div class="btnBox left flex justify-center center">
        <img class="cssRotateSAKURA w-4 h-4" src="../assets/icons.svg" alt="logo" />
        <span>{{ appName }}</span>
      </div>
      <!--  -->
      <div class="btnBox w-20 flex center justify-between">
        <n-icon
          size="18"
          @click="userConfig.isThemeDark = !userConfig.isThemeDark"
          class="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
            v-if="userConfig.isThemeDark"
          >
            <path
              d="M6.76 4.84l-1.8-1.79l-1.41 1.41l1.79 1.79l1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41l-1.79 1.79l1.41 1.41l1.79-1.79zm-3.21 13.7l1.79 1.8l1.41-1.41l-1.8-1.79l-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41l1.79-1.8l-1.41-1.41l-1.79 1.8z"
              fill="currentColor"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
            v-else
          >
            <path
              d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z"
              fill="currentColor"
            ></path>
          </svg>
        </n-icon>
        <n-icon size="20" @click="sendWinEvent('minimize')" class="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 12h14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </n-icon>
        <n-icon
          class="cursor-pointer"
          size="20"
          @click="sendWinEvent(userConfig.isQuitApp ? 'close' : 'hide')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
          >
            <path
              d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
              fill="currentColor"
            ></path>
          </svg>
        </n-icon>
      </div>
    </div>
  </div>
  <div class="h-5"></div>
</template>
<style scoped lang="less">
/*  */
#nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  .bar {
    -webkit-app-region: drag;
  }
  .btnBox {
    -webkit-app-region: no-drag;
  }
}
</style>
