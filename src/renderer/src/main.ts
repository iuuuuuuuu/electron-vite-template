const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/css/index.css'
import 'animate.css'

// 本地数据库
import { connectIndexedDB } from './indexdDB'
connectIndexedDB()

// 设置标题
import { appName } from './config/renderConfigs'
document.title = appName

createApp(App).use(router).use(createPinia()).mount('#app')
