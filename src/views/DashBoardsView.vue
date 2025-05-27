<script setup>
import { ref } from 'vue'

const now = Date.now() // 当前时间戳（毫秒）
const hours = 60 * 60 * 1000 // 一小时的毫秒数
const tenMinutesAgo = now - 24 * hours
const timeRange = `from=${tenMinutesAgo}&to=${now}`
const baseSrc =
  'http://localhost:3000/d-solo/beg6v9ucyg54wf/e891a1-e89084-e59bad-e58cba-e695b0-e68dae'
const commonParams = `orgId=1&timezone=browser&theme=light&__feature.dashboardSceneSolo&${timeRange}`
const realtimePanelIds = [7, 10, 8, 9, 11, 12]
const realtimePanels = ref(
  realtimePanelIds.map((id) => ({
    src: `${baseSrc}?${commonParams}&panelId=${id}`,
    height: 100,
  })),
)
const historyPanelIds = [1, 2, 3, 4, 5, 6]
const historyPanels = ref(
  historyPanelIds.map((id) => ({
    src: `${baseSrc}?${commonParams}&panelId=${id}`,
    height: 200,
  })),
)
</script>

<template>
  <div style="margin-top: 15px">
    <h2 style="margin-bottom: 18px; font-size: 24px; color: #333">环境数据</h2>
    <!-- 实时面板 -->
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="4" v-for="(panel, index) in realtimePanels" :key="'rt-' + index">
        <iframe
          :src="panel.src"
          frameborder="0"
          style="width: 100%; border-radius: 8px"
          :style="{ height: panel.height + 'px' }"
        />
      </el-col>
    </el-row>
    <!-- 历史图表 2 行，每行 3 个 -->
    <el-row :gutter="20" style="margin-bottom: 20px" v-for="row in 2" :key="'his-row-' + row">
      <el-col
        :span="8"
        v-for="(panel, index) in historyPanels.slice((row - 1) * 3, row * 3)"
        :key="'his-' + row + '-' + index"
      >
        <iframe
          :src="panel.src"
          frameborder="0"
          style="width: 100%; border-radius: 8px"
          :style="{ height: panel.height + 'px' }"
        />
      </el-col>
    </el-row>
  </div>
</template>
