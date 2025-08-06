<template>
  <div>
    <Header />
    <div style="display: flex; height: 100vh;">
      <Sidebar />
       <div style="flex:1; display:flex; flex-direction:column;" class="main-content">
        <TabPanel />
        <!-- <router-view :key="$route.fullPath" style="flex:1; background:#f5f5f5; overflow:auto;" /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import TabPanel from './layouts/TabPanel.vue'
import './assets/main.css'
</script>

<style scoped>
/* Tránh layoput ko bị tràn */
.main-content {
  max-width: 100%;
  overflow: hidden;
}
</style>