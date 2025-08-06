<template>
  <div class="header">
    <!-- Logo + tên -->
    <div class="header-left">
      <span class="title">.Net8 Vol开发框架</span>
    </div>

    <!-- Navigation menu -->
    <div class="header-center">
      <el-menu 
        mode="horizontal" 
        :default-active="active" 
        class="nav-menu" 
        background-color="transparent" 
        text-color="#fff" 
        active-text-color="#ffd04b"
      >
        <el-menu-item @click="handleClickHeaderID(item.id)" v-for="item in headerItems" :key="item.id" :index="String(item.id)">{{ item.name }}</el-menu-item>
      </el-menu>
    </div>

    <!-- User & tools -->
    <div class="header-right">
      <el-input
        v-model="search"
        placeholder="Search..."
        :prefix-icon="Search"
        size="small"
        class="search-box"
      />
      <el-icon class="icon-btn" @click="handleUser"><User /></el-icon>
      <el-icon class="icon-btn" @click="drawerSetting=true"><Setting /></el-icon>
      <el-icon class="icon-btn"><SwitchButton /></el-icon>
      <el-icon class="icon-btn"><Bell /></el-icon>

      <!--Hiển thị Drawer khi click settings-->
      <el-drawer v-model="drawerSetting" title="Basic Settings" :with-header="true" size="25%">
            <SettingsDrawer/>
        </el-drawer>

      <el-avatar
        :size="32"
        :src="logoUser"
        class="avatar"
      />
      <el-dropdown trigger="hover" placement="bottom-start">
        <div class="user-info">
            <span class="username">Trang NV</span>
            <span class="datetime">{{ now }}</span>
        </div>
        
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item><el-icon class="icon-btn"><Bell /></el-icon> Thông báo</el-dropdown-item>
                <el-dropdown-item @click="handleUser"><el-icon class="icon-btn"><User /></el-icon>Thông tin người dùng</el-dropdown-item>
                <el-dropdown-item @click="drawerSetting= true"><el-icon class="icon-btn"><Setting /></el-icon>Cài đặt</el-dropdown-item>
                <el-dropdown-item><el-icon class="icon-btn"><SwitchButton /></el-icon>Đăng xuất</el-dropdown-item>
            </el-dropdown-menu>

            <el-drawer v-model="drawerSetting" title="Basic Settings" :with-header="true" size="25%">
                <SettingsDrawer/>
            </el-drawer>
            
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bell, SwitchButton, User, Setting, Search } from '@element-plus/icons-vue'
import logoUser from '@/assets/logo.jpg'
import SettingsDrawer from '@/helper/SettingsDrawer.vue'
import { useRouter} from 'vue-router'
import { showLoading, hideLoading } from '@/utils/loading'
import headerApi from '@/api/headerItem'
//store
import { useMenuStore } from '@/store/menuStore'
import { useTabPanelStore } from '@/store/tabPanelStore'
const store = useTabPanelStore()
const menuStore = useMenuStore()

const route = useRouter()

const active = ref('1')
const search = ref('')
const headerItems = ref([])
const loading = ref(false)
const now = ref('')
const updateTime = () => {
  const d = new Date()
  now.value = d.toLocaleString('zh-CN', { hour12: false })
}
onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
const drawerSetting = ref(false)
const handleUser = async () => {
  showLoading("Loading ...")
  try{
    store.addTab({
      title: 'User info',
      route: '/userInfo',
      closable: true
    })
    await route.push('/userInfo')
  }
  finally {
    hideLoading(1000)
  }
}
// Fetch header items
const fetchDataHeaderItem = async() => {
  loading.value = true 
  try {
    const res = await headerApi.getAll()
    if (res && res.data) {
      headerItems.value = res.data.data
      if(headerItems.value.length > 0) {
        const firstID = headerItems.value[0].id
        active.value = String(firstID)
        menuStore.setHeaderID(firstID)
      }
    } else {
      console.log("No header items found")
    }
  } catch (error) {
    console.log("Error fetching header items:", error)
    loading.value = false
  }finally {
    loading.value = false
  }
}
//click header
const handleClickHeaderID = (id) => {
  active.value = String(id)
  menuStore.setHeaderID(id)
}
onMounted(() => {
  fetchDataHeaderItem()
})
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1890ff;
  padding: 0 20px;
  color: white;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}
.logo {
  width: 30px;
  margin-right: 8px;
}
.title {
  font-weight: bold;
  font-size: 18px;
}

.header-center {
  flex-grow: 1;
  margin-left: 70px;
}
.nav-menu {
  background-color: transparent;
  border-bottom: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}
.search-box {
  width: 180px;
  height: 35px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #fff;
}
.clock {
  margin-left: 10px;
  font-size: 14px;
}
.el-input_inner {
  border-radius: 15px;
}
.avatar {
  margin-left: 8px;
}
.username {
  font-weight: bold;
  font-size: 14px;
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  line-height: 1.2;
  padding-top: 5px;
  color: #fff;
}
.icon-btn {
  font-size: 18px;
  cursor: pointer;
}
</style>
