<template>
  <div class="user-view">
    <!-- 添加用户 -->
    <el-card class="form-card">
      <h2>添加用户</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option
              v-for="role in roleOptions"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 查询用户 -->
    <el-card class="query-card">
      <h2>用户列表</h2>
      <div style="margin-bottom: 20px">
        <el-button type="danger" @click="logout">退出登录</el-button>
      </div>
      <el-form :model="filter" inline>
        <el-form-item label="用户名">
          <el-input v-model="filter.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="filter.role" placeholder="请选择角色">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="role in roleOptions"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchUsers">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" stripe style="width: 100%" class="users-table">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="username" label="用户名" width="150"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="role" label="角色" width="120"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="200"></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openEditDialog(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteUser(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" v-model="editDialogVisible" width="30%">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="editForm.password"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option
              v-for="role in roleOptions"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/users'

const store = useUserStore()
const router = useRouter()

// 角色选项
const roleOptions = [
  { value: '管理员', label: '管理员' },
  { value: '操作员', label: '操作员' },
  { value: '观察者', label: '观察者' },
]

// 表单数据
const form = ref({
  username: '',
  email: '',
  password: '',
  role: '',
})
const formRef = ref(null)
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入有效的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

// 过滤数据
const filter = ref({
  username: '',
  role: '',
})

// 表格数据
const tableData = ref([])

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  username: '',
  email: '',
  password: '',
  role: '',
})
const editFormRef = ref(null)

// 提交添加用户表单
const submitForm = async () => {
  try {
    await formRef.value.validate()
    store.addUser({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role,
    })
    ElMessage.success('添加用户成功')
    resetForm()
    fetchUsers()
  } catch (error) {
    ElMessage.error('添加用户失败')
  }
}

// 重置添加用户表单
const resetForm = () => {
  formRef.value.resetFields()
}

// 查询用户
const fetchUsers = () => {
  tableData.value = store.getUsers(filter.value)
}

// 重置过滤
const resetFilter = () => {
  filter.value = {
    username: '',
    role: '',
  }
  fetchUsers()
}

// 打开编辑对话框
const openEditDialog = (row) => {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

// 提交编辑用户表单
const submitEditForm = async () => {
  try {
    await editFormRef.value.validate()
    store.editUser(editForm.value)
    ElMessage.success('编辑用户成功')
    editDialogVisible.value = false
    fetchUsers()
  } catch (error) {
    ElMessage.error('编辑用户失败')
  }
}

// 删除用户
const deleteUser = (id) => {
  ElMessageBox.confirm('确定删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      store.deleteUser(id)
      ElMessage.success('删除用户成功')
      fetchUsers()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 退出登录
const logout = () => {
  store.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}

// 初始化时加载用户数据
fetchUsers()
</script>

<style scoped>
.user-view {
  padding: 20px;
}

.form-card,
.query-card {
  margin-bottom: 20px;
}

h2 {
  margin: 0 0 20px 0;
}

.users-table {
  margin-top: 20px;
}
</style>
