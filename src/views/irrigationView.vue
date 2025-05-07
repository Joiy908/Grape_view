<template>
  <div class="irrigation-view">
    <!-- 添加浇水记录和土壤湿度数据 -->
    <el-card class="form-card">
      <div class="form-iframe-container">
        <div class="form-section">
          <h2>添加浇水记录</h2>
          <el-form :model="form" :rules="rules" ref="formRef" :inline="true">
            <el-form-item label="出水口" prop="outlet" style="width: 190px">
              <el-input v-model="form.outlet" placeholder="请输入出水口"></el-input>
            </el-form-item>
            <el-form-item label="葡萄园 ID" prop="vineyard_id">
              <el-input
                v-model="form.vineyard_id"
                style="width: 150px"
                placeholder="请输入葡萄园 ID"
              ></el-input>
            </el-form-item>
            <el-form-item label="水量（m³）" prop="amount">
              <el-input-number
                v-model="form.amount"
                :min="0"
                :precision="2"
                placeholder="请输入水量"
                style="width: 200px"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="灌溉面积（㎡）" prop="area">
              <el-input-number
                v-model="form.area"
                :min="0"
                :precision="2"
                placeholder="请输入面积"
                style="width: 200px"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="时间（可选）" prop="timestamp">
              <el-date-picker
                v-model="form.timestamp"
                type="datetime"
                placeholder="选择时间（默认当前时间）"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="iframe-section">
          <h3>土壤湿度数据</h3>
          <iframe
            :src="soil_moisture_url"
            title="土壤湿度数据"
            width="100%"
            height="200"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </el-card>

    <!-- 查询浇水记录和历史 -->
    <el-card class="query-card">
      <h2>查询浇水记录</h2>
      <!-- 查询过滤区域 -->
      <el-form :model="filter" inline>
        <el-form-item>
          <el-date-picker
            v-model="filter.start_time"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ssZ"
            style="width: 180px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filter.end_time"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ssZ"
            style="width: 180px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="出水口">
          <el-input
            v-model="filter.outlet"
            placeholder="请输入出水口"
            style="width: 120px"
          ></el-input>
        </el-form-item>
        <el-form-item label="葡萄园 ID">
          <el-input
            v-model="filter.vineyard_id"
            placeholder="请输入葡萄园 ID"
            style="width: 130px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchHistory">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 浇水历史表格 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        max-height="250"
        class="history-table"
        :default-sort="{ prop: 'timestamp', order: 'descending' }"
      >
        <el-table-column prop="outlet" label="出水口" width="150"></el-table-column>
        <el-table-column prop="vineyard_id" label="葡萄园 ID" width="150"></el-table-column>
        <el-table-column prop="amount" label="水量（m³）" width="120"></el-table-column>
        <el-table-column prop="area" label="面积（㎡）" width="120"></el-table-column>
        <el-table-column prop="timestamp" label="时间" width="200"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import dayjs from 'dayjs'

const now = Date.now() // 当前时间戳（毫秒）
const hours = 60 * 60 * 1000 // 一小时的毫秒数
const tenMinutesAgo = now - 24 * hours
const timeRange = `from=${tenMinutesAgo}&to=${now}`
const baseSrc =
  'http://localhost:3000/d-solo/beg6v9ucyg54wf/e891a1-e89084-e59bad-e58cba-e695b0-e68dae'
const commonParams = `orgId=1&timezone=browser&theme=light&__feature.dashboardSceneSolo&${timeRange}`
const soil_moisture_url = `${baseSrc}?${commonParams}&panelId=6`

// 表单数据
const form = ref({
  outlet: '',
  vineyard_id: '',
  amount: undefined,
  area: undefined,
  timestamp: null,
})
const formRef = ref(null)
const rules = {
  outlet: [{ required: true, message: '请输入出水口', trigger: 'blur' }],
  vineyard_id: [{ required: true, message: '请输入葡萄园 ID', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入水量', trigger: 'change' }],
  area: [{ required: true, message: '请输入面积', trigger: 'change' }],
}

// 过滤数据
const filter = ref({
  start_time: null,
  end_time: null,
  outlet: '',
  vineyard_id: '',
})

// 表格数据
const tableData = ref([])

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate()
    const event = { ...form.value }
    if (event.timestamp) {
      // 转换为 RFC3339 格式 (YYYY-MM-DDTHH:mm:ss+08:00)
      event.timestamp = dayjs(event.timestamp).format('YYYY-MM-DDTHH:mm:ss+08:00')
    }
    const response = await axios.post('http://localhost:8080/api/v1/irrigation_events', event)
    ElMessage.success('添加成功')
    resetForm()
    fetchHistory() // 刷新表格
  } catch (error) {
    ElMessage.error('添加失败：' + (error.response?.data?.detail || error.message))
  }
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
  form.value.timestamp = null
}

// 查询历史
const fetchHistory = async () => {
  try {
    const params = { ...filter.value }
    console.log(params)
    const response = await axios.get('http://localhost:8080/api/v1/irrigation_events', { params })
    tableData.value = response.data.data.map((item) => ({
      ...item,
      timestamp: dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
    }))
  } catch (error) {
    ElMessage.error('查询失败：' + (error.response?.data?.detail || error.message))
  }
}

// 重置过滤
const resetFilter = () => {
  filter.value = {
    start_time: null,
    end_time: null,
    outlet: '',
    vineyard_id: '',
  }
  fetchHistory()
}

// 初始化时加载历史数据
fetchHistory()
</script>

<style scoped>
.irrigation-view {
  padding: 20px;
}

.form-card,
.query-card {
  margin-bottom: 20px;
}

h2,
h3 {
  margin: 0 0 20px 0;
}

.form-iframe-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-section,
.iframe-section {
  padding: 10px;
}

.iframe-section iframe {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.history-table {
  margin-top: 20px;
}
</style>
