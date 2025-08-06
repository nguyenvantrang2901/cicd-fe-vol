import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import MyApproval from '@/components/MES/approval/MyApproval.vue'
import ApprovalConfig from '@/components/MES/approval/ApprovalConfig.vue'
import UserInfo from '@/components/users/UserInfo.vue'

const routes = [
  {
    path: '/',
    component: BaseLayout,
    redirect: 'approval/approval-main',
    children: [
      {
        path: 'approval/approval-main',
        name: 'MyApproval',
        component: MyApproval
      },
      {
        path: '/approval/approval-config',
        name: 'ApprovalConfig',
        component: ApprovalConfig
      },
      // các page khác
    ]
  },
  {
    path: '/userInfo',
    name: 'UserInfo',
    component: UserInfo,
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
