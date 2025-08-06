<template>
  <el-menu
    class="el-menu-vertical-demo"
    :default-openeds="['']"
    router
    unique-opened
    background-color="#ffffff"
    text-color="#303133"
    active-text-color="#409EFF"
  >
    <el-input
      v-model="search"
      placeholder="Search..."
      class="search-input"
      size="small"
      :prefix-icon="Search"
    />

    <el-sub-menu v-for="(item, index) in filteredMenu" :index="index.toString()" :key="item.name">
      <template #title>
        <el-icon :size="18">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.name }}</span>
      </template>

      <el-menu-item
        v-for="child in item.children"
        :index="child.route"
        :key="child.name"
        @click="openTab(child.route, child.name)"
      >
        {{ child.name }}
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTabPanelStore } from '@/store/tabPanelStore'
import sidebarApi from '@/api/sidebarMenu'
import { useMenuStore } from '@/store/menuStore'
const menuStore = useMenuStore()

const sidebars = ref([])
const loading = ref(false)

const router = useRouter()
const store = useTabPanelStore()
const { addTab } = store

const openTab = (route, title) => {
  addTab({route, title})
  router.push(route)
}
const search = ref('')

const fetchDataSidebarMenu = async (headerID) => {
  loading.value = true
  try {
    const res = await sidebarApi.getByHeaderId(headerID)
    if(res && res.data) {
      sidebars.value = res.data.data || []
      loading.value = false
      console.log("Sidebar menu data fetched successfully:", sidebars.value)
    } else {
      console.warn("No data found for sidebar menu")
    }
  } catch (error) {
    console.error("Error fetching sidebar menu:", error)
  }finally {
    loading.value = false
  }
}
const filteredMenu = computed(() => {
  if (!search.value) return sidebars.value
  const s = search.value.toLowerCase()
  return sidebars.value
    .map((item) => {
      const matchedChildren = item.children.filter((c) =>
        c.name.toLowerCase().includes(s)
      )
      if (matchedChildren.length > 0) {
        return { ...item, children: matchedChildren }
      }
      return null
    })
    .filter((item) => item !== null)
})
watch(
  () => menuStore.selectedHeaderID,
  (newId) => {
    if(newId != null){
      fetchDataSidebarMenu(newId)
    }
  },
  {
    immediate: true
  }
)
onMounted(() => {
  fetchDataSidebarMenu()
})
</script>

<style scoped>
.el-menu {
  width: 230px;
  border-right: 1px solid #eee;
  height: 100vh;
}
.search-input {
  padding: 10px;
  height: 55px;
}
.el-sub-menu {
  font-weight: normal;
}
</style>
