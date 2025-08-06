<template>
  <el-container style="height: 100vh">
    <el-aside width="250px">
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header style="padding: 0">
        <Header />
      </el-header>
      <el-main style="padding: 16px">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { Monitor, UserFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar {
  background-color: #001529;
  color: white;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
}
.logo {
  font-size: 18px;
  font-weight: bold;
}
</style>
