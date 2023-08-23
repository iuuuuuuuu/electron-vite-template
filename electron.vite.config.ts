// electron.vite.config.ts
import { bytecodePlugin, defineConfig, externalizeDepsPlugin } from 'electron-vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
// import htmlMetaPlugin from 'vite-plugin-html-meta'
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
      // 配置 html meta
      // htmlMetaPlugin({
      //   csp: {
      //     defaultSrc: ['self'],
      //     connectSrc: ['https://lol-api-champion.op.gg'],
      //     scriptSrc: ['self', 'unsafe-inline', 'unsafe-eval'],
      //     imgSrc: ['self', 'data:', 'blob:', 'https://*'],
      //     workerSrc: ['self', 'blob:']
      //   }
      // })
    ]
  }
})
export { electron_vite_config_default as default }
