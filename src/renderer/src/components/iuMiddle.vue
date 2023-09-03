<script setup lang="ts">
import {} from 'vue'
import { useMessage, useDialog, useNotification } from 'naive-ui'
const message = useMessage()
const dialog = useDialog()
const notification = useNotification()
window.message = message
window.dialog = dialog
window.notification = notification
</script>
<template>
  <router-view />
</template>
<style scoped lang="less">
/*  */
</style>
