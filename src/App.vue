<template>
  <el-container>
    <!-- 顶部导航栏 -->
    <el-header class="fixed-header">
      <h1>我的主页</h1>
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
      <el-main class="scroll-main">
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

<style>
/* 固定 header */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px; /* el-header 默认高度 */
  background-color: #409eff;
  color: white;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

/* 固定侧边栏 */
.fixed-aside {
  position: fixed;
  top: 50px; /* header 高度 */
  left: 0;
  bottom: 0;
  width: 150px;
  background-color: #f2f2f2;
  overflow: auto;
}

/* 主体内容，左边预留 aside 宽度，顶部预留 header 高度 */
.scroll-main {
  margin-top: 50px;
  margin-left: 150px;
  padding: 0;
  /* height: calc(100vh - 0px); */
  overflow: auto;
  background-color: #fff;
  box-sizing: border-box;
}
</style>
