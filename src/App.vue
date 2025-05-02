<template>
  <el-container>
    <!-- 顶部导航栏 -->
    <!-- <el-header style="background-color: #409eff; color: white; display: flex; align-items: center">
      <h1 style="margin: 0; font-size: 20px">我的主页</h1>
    </el-header> -->

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="100px" style="background-color: #f5f5f5">
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
      <el-main>
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
