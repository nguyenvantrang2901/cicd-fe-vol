<template>
  <el-tabs
    v-model="activeTab"
    type="card"
    @tab-remove="handleRemove"
    @tab-click="handleClick"
    closable
  >
    <el-tab-pane
      v-for="tab in tabs"
      :key="tab.route"
      :label="tab.title"
      :name="tab.route"
      :closable="tab.closable !== false"
    >
      <router-view v-if="activeTab === tab.route" />
  </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTabPanelStore } from '@/store/tabPanelStore'
import { storeToRefs } from 'pinia'

const store = useTabPanelStore()
const { tabs, activeTab } = storeToRefs(store)
const { removeTab } = store
const router = useRouter()
const route = useRoute()

// Tự đồng bộ route -> activeTab
watch(() => route.path, (newPath) => {
  activeTab.value = newPath
})

// Click tab → push route
const handleClick = (pane) => {
  router.push(pane.paneName)
}

const handleRemove = (targetName) => {
  const index = tabs.value.findIndex(t => t.route === targetName)
  console.log("Đóng tab: ", targetName, "tại index:", index)
  const isActive = activeTab.value === targetName
  // Tính tab kế tiếp trước khi xóa
  let nextTab = null
  if(isActive) {
    nextTab = tabs.value[index - 1] || tabs.value[index + 1] || tabs.value[0]
  }
  // Xóa tab
  if(targetName === "/approval/approval-main") {
    // Không cho phép đóng tab chính
    return
  }
  removeTab(targetName)

  // Chuyển route sang tab còn lại nếu còn
  if(isActive && nextTab) {
    router.push(nextTab.route)
  }
}
</script>
