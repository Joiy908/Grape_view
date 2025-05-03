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
          <el-menu-item index="/about">
            <span>关于</span>
          </el-menu-item>
          <el-menu-item index="/contact">
            <span>联系</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main class="main-content">
        <RouterView />
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
  width: 80px;
  overflow: auto;
}
.main-content {
  padding: 0 20px;
  height: calc(100vh - 40px);
  overflow: auto;
}
</style>
