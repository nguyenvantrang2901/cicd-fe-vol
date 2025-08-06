<template>
  <el-container style="height: 100vh">
    
    <el-container>
      
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
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
