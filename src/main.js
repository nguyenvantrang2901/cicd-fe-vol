import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

//Loading toàn app
import { showLoading, hideLoading } from '@/utils/loading'
router.beforeEach((to, from, next) => {
  showLoading('Loading ...')
  next()
})
router.afterEach(() => {
  hideLoading(1000) // Delay nhỏ cho mượt
})

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(pinia)
// Đăng ký tất cả icon nếu dùng
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
