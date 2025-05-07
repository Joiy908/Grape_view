<template>
  <div class="events-view">
    <!-- 添加事件 -->
    <el-card class="form-card">
      <h2>添加事件</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="事件类型" prop="event_type">
          <el-select v-model="form.event_type" placeholder="请选择事件类型">
            <el-option
              v-for="type in eventTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.event_type === 'custom'"
          label="自定义类型"
          prop="custom_event_type"
        >
          <el-input v-model="form.custom_event_type" placeholder="请输入自定义事件类型"></el-input>
        </el-form-item>
        <el-form-item label="葡萄园 ID" prop="vineyard_id">
          <el-input
            v-model="form.vineyard_id"
            placeholder="请输入葡萄园 ID（如 vineyard_01）"
          ></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="details">
          <el-input
            type="textarea"
            v-model="form.details"
            placeholder="请输入事件详情（可选）"
            :rows="4"
          ></el-input>
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
    </el-card>

    <!-- 查询事件 -->
    <el-card class="query-card">
      <h2>查询事件</h2>
      <el-form :model="filter" inline>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="filter.start_time"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="filter.end_time"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="事件类型">
          <el-select v-model="filter.event_type" placeholder="请选择事件类型">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="type in eventTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="葡萄园 ID">
          <el-input v-model="filter.vineyard_id" placeholder="请输入葡萄园 ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchEvents">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        class="events-table"
        :default-sort="{ prop: 'timestamp', order: 'descending' }"
      >
        <el-table-column prop="vineyard_id" label="葡萄园 ID" width="150"></el-table-column>
        <el-table-column prop="event_type" label="事件类型" width="150"></el-table-column>
        <el-table-column prop="details" label="详情" width="300"></el-table-column>
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

// 事件类型选项
const eventTypes = [
  { value: '建园', label: '建园' },
  { value: '苗木管理', label: '苗木管理' },
  { value: '施肥', label: '施肥' },
  { value: '病虫害防治', label: '病虫害防治' },
  { value: '土壤管理', label: '土壤管理' },
  { value: '花果管理', label: '花果管理' },
  { value: '整形修剪', label: '整形修剪' },
  { value: '葡萄采收', label: '葡萄采收' },
  { value: 'custom', label: '自定义' },
]

// 表单数据
const form = ref({
  event_type: '',
  custom_event_type: '',
  vineyard_id: '',
  details: '',
  timestamp: null,
})
const formRef = ref(null)
const rules = {
  event_type: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
  custom_event_type: [
    {
      required: true,
      message: '请输入自定义事件类型',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (form.value.event_type === 'custom' && !value) {
          callback(new Error('请输入自定义事件类型'))
        } else {
          callback()
        }
      },
    },
  ],
  vineyard_id: [{ required: true, message: '请输入葡萄园 ID', trigger: 'blur' }],
}

// 过滤数据
const filter = ref({
  start_time: null,
  end_time: null,
  event_type: '',
  vineyard_id: '',
})

// 表格数据
const tableData = ref([])

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate()
    const event = {
      event_type:
        form.value.event_type === 'custom' ? form.value.custom_event_type : form.value.event_type,
      vineyard_id: form.value.vineyard_id,
      details: form.value.details || null,
      timestamp: form.value.timestamp
        ? dayjs(form.value.timestamp).format('YYYY-MM-DDTHH:mm:ss+08:00')
        : null,
    }
    const response = await axios.post('http://localhost:8080/api/v1/events', event)
    ElMessage.success('添加成功')
    resetForm()
    fetchEvents() // 刷新表格
  } catch (error) {
    ElMessage.error('添加失败：' + (error.response?.data?.detail || error.message))
  }
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
  form.value.event_type = ''
  form.value.custom_event_type = ''
  form.value.timestamp = null
}

// 查询事件
const fetchEvents = async () => {
  try {
    const params = { ...filter.value }
    if (params.start_time) {
      params.start_time = dayjs(params.start_time).format('YYYY-MM-DDTHH:mm:ss+08:00')
    }
    if (params.end_time) {
      params.end_time = dayjs(params.end_time).format('YYYY-MM-DDTHH:mm:ss+08:00')
    }
    const response = await axios.get('http://localhost:8080/api/v1/events', { params })
    // 格式化 timestamp 为 YYYY-MM-DD HH:mm:ss
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
    event_type: '',
    vineyard_id: '',
  }
  fetchEvents()
}

// 初始化时加载事件数据
fetchEvents()
</script>

<style scoped>
.events-view {
  padding: 20px;
}

.form-card,
.query-card {
  margin-bottom: 20px;
}

h2 {
  margin: 0 0 20px 0;
}

.events-table {
  margin-top: 20px;
}
</style>
