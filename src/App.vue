<template>
  <el-container style="height: 100vh">
    <!-- 顶部导航栏 -->
    <el-header class="fixed-header">
      <h2>葡萄生产数字化系统</h2>
      <div class="user-status">
        <span v-if="store.isLoggedIn">
          您好, {{ store.currentUser?.username }}
          <el-icon class="logout-icon" @click="logout"><SwitchButton /></el-icon>
        </span>
        <span v-else>
          <router-link to="/login">登录</router-link>
        </span>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside v-if="store.isLoggedIn" class="fixed-aside">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          router
        >
          <el-menu-item index="/">
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/dashboards">
            <span>环境数据</span>
          </el-menu-item>
          <el-menu-item index="/irrigation">
            <span>灌溉管理</span>
          </el-menu-item>
          <el-menu-item index="/events">
            <span>农事管理</span>
          </el-menu-item>
          <el-menu-item index="/knowledge">
            <span>葡萄知识</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/users'
import { ElMessage } from 'element-plus'
import { SwitchButton } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const store = useUserStore()
const activeMenu = ref(route.path)

watch(route, (newRoute) => {
  activeMenu.value = newRoute.path
})

const handleSelect = (index) => {
  activeMenu.value = index
}

const logout = () => {
  store.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.fixed-header {
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 20px;
}

.user-status {
  font-size: 14px;
}

.user-status .logout-icon {
  cursor: pointer;
  margin-left: 8px;
  vertical-align: middle;
}

.user-status a {
  color: white;
  text-decoration: none;
}

.user-status a:hover {
  text-decoration: underline;
}

.fixed-aside {
  background-color: #f2f2f2;
  width: 100px;
  overflow: auto;
}

.main-content {
  padding: 0 20px;
  height: calc(100vh - 40px);
  overflow: auto;
}
</style>
