<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>管理员管理</span>
        <div class="header-actions">
          <el-input
            v-model="adminSearchQuery"
            placeholder="请输入管理员名称"
            class="search-input"
          >
            <template #append>
              <el-button :icon="Search" @click="searchAdmins" />
            </template>
          </el-input>
          <el-button type="primary" @click="showAddAdminDialog">
            <el-icon><Plus /></el-icon>添加管理员
          </el-button>
        </div>
      </div>
    </template>

    <!-- 管理员列表 -->
    <el-table :data="adminList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="account" label="账号" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="role" label="角色">
        <template #default="scope">
          <el-tag
            :type="scope.row.role === '超级管理员' ? 'primary' : 'danger'"
            effect="light"
          >
            {{ scope.row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="lastLogin" label="最后登录时间" width="180" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEditAdmin(scope.row)"
            :disabled="
              userInfo.role !== '超级管理员' && scope.row.role === '超级管理员'
            "
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteAdmin(scope.row)"
            :disabled="
              userInfo.role !== '超级管理员' || scope.row.role === '超级管理员'
            "
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <el-pagination
        v-model="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalAdmins"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @update:page-size="pageSize = $event"
      />
    </div>

    <!-- 添加/编辑管理员对话框 -->
    <el-dialog
      v-model="adminDialogVisible"
      :title="adminFormMode === 'add' ? '添加管理员' : '编辑管理员'"
      width="500px"
    >
      <el-form
        :model="adminForm"
        :rules="adminRules"
        ref="adminFormRef"
        label-width="100px"
      >
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="adminForm.account"
            :disabled="adminFormMode === 'edit'"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="adminForm.name" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select
            v-model="adminForm.role"
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              label="超级管理员"
              value="超级管理员"
              :disabled="userInfo.role !== '超级管理员'"
            />
            <el-option label="普通管理员" value="普通管理员" />
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="adminForm.phone" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          v-if="adminFormMode === 'add'"
        >
          <el-input
            v-model="adminForm.password"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          v-if="adminFormMode === 'add'"
        >
          <el-input
            v-model="adminForm.confirmPassword"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="adminDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAdminForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="删除确认" width="400px">
      <p>确定要删除管理员 "{{ adminToDelete.name }}" 吗？此操作不可撤销。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDeleteAdmin"
            >确定删除</el-button
          >
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 接收userInfo作为props
const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  }
})

console.log('userInfo', props.userInfo)
// 管理员列表相关
const adminSearchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalAdmins = ref(100)

// 模拟管理员数据
const adminList = ref([
  {
    id: 1,
    account: 'admin',
    name: '系统管理员',
    role: '超级管理员',
    phone: '13912345678',
    createTime: '2023-12-01 09:00:00',
    lastLogin: '2024-01-30 14:30:00'
  },
  {
    id: 2,
    account: 'zhangwei',
    name: '张伟',
    role: '超级管理员',
    phone: '13812345678',
    createTime: '2024-01-01',
    lastLogin: '2024-01-20 14:30:00'
  },
  {
    id: 3,
    account: 'liming',
    name: '李明',
    role: '普通管理员',
    phone: '13712345678',
    createTime: '2024-01-05',
    lastLogin: '2024-01-19 10:15:00'
  },
  {
    id: 4,
    account: 'wangfang',
    name: '王芳',
    role: '普通管理员',
    phone: '13612345678',
    createTime: '2024-01-10',
    lastLogin: '2024-01-18 16:45:00'
  }
])

// 对话框相关
const adminDialogVisible = ref(false)
const adminFormMode = ref('add')
const adminFormRef = ref(null)
const adminForm = reactive({
  id: 0,
  account: '',
  name: '',
  role: '普通管理员',
  phone: '',
  password: '',
  confirmPassword: ''
})

// 删除对话框相关
const deleteDialogVisible = ref(false)
const adminToDelete = ref(null)

// 表单验证规则
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (adminForm.confirmPassword !== '') {
      adminFormRef.value?.validateField('confirmPassword', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== adminForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const adminRules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  password: [{ validator: validatePass, trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }]
}

// 处理分页变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchAdminList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchAdminList()
}

// 获取管理员列表
const fetchAdminList = () => {
  // 这里应该是调用API获取数据，现在使用模拟数据
  console.log('获取管理员列表', {
    page: currentPage.value,
    pageSize: pageSize.value,
    query: adminSearchQuery.value
  })
  // 实际项目中，这里应该调用后端API
}

// 搜索管理员
const searchAdmins = () => {
  currentPage.value = 1
  fetchAdminList()
}

// 显示添加管理员对话框
const showAddAdminDialog = () => {
  adminFormMode.value = 'add'
  resetAdminForm()
  adminDialogVisible.value = true
}

// 编辑管理员
const handleEditAdmin = (row) => {
  adminFormMode.value = 'edit'
  Object.assign(adminForm, row)
  adminForm.password = ''
  adminForm.confirmPassword = ''
  adminDialogVisible.value = true
}

// 删除管理员
const handleDeleteAdmin = (row) => {
  adminToDelete.value = row
  deleteDialogVisible.value = true
}

// 确认删除管理员
const confirmDeleteAdmin = () => {
  // 这里应该调用API删除管理员
  console.log('删除管理员', adminToDelete.value)
  ElMessage.success(`管理员 "${adminToDelete.value.name}" 已成功删除`)
  deleteDialogVisible.value = false
  // 删除后刷新列表
  fetchAdminList()
}

// 重置表单
const resetAdminForm = () => {
  adminForm.id = 0
  adminForm.account = ''
  adminForm.name = ''
  adminForm.role = '普通管理员'
  adminForm.phone = ''
  adminForm.password = ''
  adminForm.confirmPassword = ''
  adminFormRef.value?.resetFields()
}

// 提交表单
const submitAdminForm = () => {
  adminFormRef.value?.validate((valid) => {
    if (valid) {
      if (adminFormMode.value === 'add') {
        // 这里应该调用API添加管理员
        console.log('添加管理员', adminForm)
        ElMessage.success('添加管理员成功')
      } else {
        // 这里应该调用API更新管理员
        console.log('更新管理员', adminForm)
        ElMessage.success('更新管理员成功')
      }
      adminDialogVisible.value = false
      fetchAdminList()
    } else {
      return false
    }
  })
}

// 初始加载
fetchAdminList()
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.search-input {
  width: 200px;
  margin-right: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
