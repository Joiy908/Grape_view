<template>
  <el-container style="height: 100vh">
    <!-- 顶部导航栏 -->
    <el-header class="fixed-header">
      <h2>葡萄生产数字化系统</h2>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside class="fixed-aside">
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
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = ref(route.path)

watch(route, (newRoute) => {
  activeMenu.value = newRoute.path
})

const handleSelect = (index) => {
  activeMenu.value = index
}
</script>

<style scope>
.fixed-header {
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  height: 40px;
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
