import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'
import DashBoardsView from '@/views/DashBoardsView.vue'
import IrrigationView from '@/views/irrigationView.vue'
import EventsView from '@/views/EventsView.vue'
import Usersview from '@/views/UsersView.vue'
import LoginView from '@/views/LoginView.vue'
import RootView from '@/views/RootView.vue'
import { useUserStore } from '../stores/users'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: RootView,
      meta: { keepAlive: true, requiresAuth: true },
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
      meta: { keepAlive: true, requiresAuth: true },
    },
    {
      path: '/dashboards',
      name: 'dashboards',
      component: DashBoardsView,
      meta: { keepAlive: true, requiresAuth: true },
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/KnowledgeView.vue'),
      meta: { keepAlive: true, requiresAuth: true },
    },
    {
      path: '/irrigation',
      name: 'irrigation',
      component: IrrigationView,
      meta: { keepAlive: true, requiresAuth: true },
    },
    {
      path: '/events',
      name: 'events',
      component: EventsView,
      meta: { keepAlive: true, requiresAuth: true },
    },
    {
      path: '/users',
      name: 'users',
      component: Usersview,
      meta: { keepAlive: true, requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const store = useUserStore()
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
