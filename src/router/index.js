import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import Tasks from '../views/Tasks.vue'
import Projects from '../views/Projects.vue'
import Users from '../views/Users.vue'
import {Me} from '../services/AuthEndpoints'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta:{
        auth: false
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta:{
        auth: true
      }
    },
    {
      path: '/dashboard/task',
      name: 'dashboard_task',
      component: Tasks,
      meta:{
        auth: true
      }
    },
    {
      path: '/dashboard/project',
      name: 'dashboard_project',
      component: Projects,
      meta:{
        auth: true
      }
    },
    {
      path: '/dashboard/users',
      name: 'dashboard_users',
      component: Users,
      meta:{
        auth: true
      }
    }
  ]
})

router.beforeEach(async(to, from, next) =>{
  
  const requireAuth = to.meta.auth
  console.log("paso")

  if(requireAuth){
    try {
      const token = $cookies.get('token')
      const authResponse = await Me(token)
      next()
    } catch (error) {
      next("/")
    }
  }else{
    next()
  }
})



export default router
