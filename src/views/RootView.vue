<template>
  <div class="root-view">
    <el-card class="intro-card">
      <h1>葡萄生产数字化平台</h1>
      <p class="subtitle">基于大模型的智能管控系统</p>

      <el-divider />

      <section class="section">
        <h2>系统简介</h2>
        <p>
          本平台通过构建葡萄生产数字化管理体系，结合传感器数据、天气信息和大模型能力，实现对灌溉、施肥等环节的智能化辅助决策。
        </p>
      </section>

      <section class="section">
        <h2>核心功能</h2>
        <ul>
          <li>🌱 生产指标采集与监控</li>
          <li>🤖 基于大模型的智能体推理与响应</li>
          <li>📊 数据可视化与历史记录查询</li>
        </ul>
      </section>

      <section class="section">
        <h2>技术架构</h2>
        <ul>
          <li>前端：Vue 3 + Element Plus</li>
          <li>后端：FastAPI + WebSocket</li>
          <li>大模型：Coze API + LlamaIndex</li>
          <li>数据存储：InfluxDB + SQLite</li>
          <li>可视化：Grafana</li>
        </ul>
      </section>

      <section class="section">
        <h2>项目亮点</h2>
        <ul>
          <li>✅ 支持流式大模型响应</li>
          <li>✅ 可扩展工具系统，支持 API 自动执行</li>
          <li>✅ 前后端解耦，支持局部热更新</li>
        </ul>
      </section>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 无需 JS 逻辑，此为静态展示页面
</script>

<style scoped>
.root-view {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.intro-card {
  max-width: 800px;
  width: 100%;
  padding: 20px;
  background-color: #fafafa;
}

h1 {
  font-size: 32px;
  margin-bottom: 0;
}

.subtitle {
  color: #666;
  font-size: 18px;
  margin-bottom: 20px;
}

.section {
  margin-top: 20px;
}

.section h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

ul {
  padding-left: 1.2em;
}

ul li {
  margin-bottom: 5px;
}
</style>
