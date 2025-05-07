import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'
import DashBoardsView from '@/views/DashBoardsView.vue'
import IrrigationView from '@/views/irrigationView.vue'
import EventsView from '@/views/EventsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: ChatView,
      meta: { keepAlive: true },
    },
    {
      path: '/dashboards',
      name: 'dashboards',
      component: DashBoardsView,
      meta: { keepAlive: true },
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/KnowledgeView.vue'),
    },
    {
      path: '/irrigation',
      name: 'irrigation',
      component: IrrigationView,
    },
    {
      path: '/events',
      name: 'events',
      component: EventsView,
    },
  ],
})

export default router
