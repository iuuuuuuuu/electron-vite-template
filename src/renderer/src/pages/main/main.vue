<script setup lang="ts">
import { ref, h, Ref } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import iuNav from '@renderer/components/iuNav.vue'
import routes from '@renderer/router/routes'
import { MenuOption } from 'naive-ui'
import { renderIcon } from '@renderer/common/utils'

const route = useRoute()
const router = useRouter()
const routesMenu: Ref<MenuOption[]> = ref([])
routes[1].children?.forEach((item) => {
  const n: {
    [key: string]: any
  } = {
    key: item.path,
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: item.name as string
          }
        },
        {
          default: () => item.meta?.title as string
        }
      )
  }

  item.meta?.icon && (n.icon = renderIcon(item.meta?.icon))
  routesMenu.value.push(n)
})
const toActiveKey = routesMenu.value[0].key
// 选中的路由
const activeRoute = ref(toActiveKey)
router.push(toActiveKey as string)
</script>
<template>
  <iuNav />
  <n-layout has-sider id="layout" class="w-screen" style="height: 97.5vh">
    <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="180">
      <n-menu
        v-model:value="activeRoute"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="routesMenu"
      />
    </n-layout-sider>
    <n-layout style="padding: 10px" :native-scrollbar="false">
      <n-card>
        <n-scrollbar style="height: 89vh">
          <div v-for="i in 100">{{ i }}</div>
          <router-view v-slot="{ Component }">
            <transition
              name="custom-classes"
              :duration="{ enter: 1000, leave: 50 }"
              enter-active-class="animate__animated animate__fadeIn"
              leave-active-class="animate__animated animate__fadeOut"
            >
              <keep-alive>
                <component :is="Component" :key="route.path" />
              </keep-alive>
            </transition>
          </router-view>
        </n-scrollbar>
      </n-card>
    </n-layout>
  </n-layout>
</template>
<style scoped lang="less">
/*  */
.n-scrollbar-content {
  height: 100%;
}
</style>
