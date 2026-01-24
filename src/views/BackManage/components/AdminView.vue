<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>管理员管理</span>
        <div class="header-actions">
          <el-select v-model="searchRole" placeholder="角色" clearable style="width: 120px; margin-right: 10px" @change="searchAdmins">
            <el-option label="普通用户" :value="0" />
            <el-option label="普通管理员" :value="1" />
            <el-option label="超级管理员" :value="2" />
          </el-select>
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
      <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="role" label="角色">
        <template #default="scope">
          <el-tag
            :type="scope.row.role === '超级管理员' ? 'danger' : (scope.row.role === '普通管理员' ? 'warning' : 'success')"
            effect="light"
          >
            {{ scope.row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="lastLoginTime" label="最后登录时间" width="180" />
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
              userInfo.role !== '超级管理员' || scope.row.role === '超级管理员' || scope.row.username === userInfo.username
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
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="adminForm.username"
            :disabled="adminFormMode === 'edit'"
          />
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
      <p>确定要删除管理员 "{{ adminToDelete.username }}" 吗？此操作不可撤销。</p>
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { pageUserAPI, createAdminAPI, updateAdminAPI, deleteUserAPI } from '@/api/user'

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
const searchRole = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalAdmins = ref(0)

// 管理员数据
const adminList = ref([])

// 对话框相关
const adminDialogVisible = ref(false)
const adminFormMode = ref('add')
const adminFormRef = ref(null)
const adminForm = reactive({
  id: 0,
  username: '',
  role: '普通管理员',
  phone: '',
  password: '',
  confirmPassword: ''
})

// 删除对话框相关
const deleteDialogVisible = ref(false)
const adminToDelete = ref(null)

// 计算表格序号
const indexMethod = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

// 表单验证规则
const validatePass = (rule, value, callback) => {
  if (adminFormMode.value === 'add' && value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (adminForm.confirmPassword !== '') {
      adminFormRef.value?.validateField('confirmPassword', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (adminFormMode.value === 'add' && value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== adminForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const adminRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
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
const fetchAdminList = async () => {
  try {
    const params = {
      current: currentPage.value,
      size: pageSize.value,
      username: adminSearchQuery.value,
      role: searchRole.value
    }
    const res = await pageUserAPI(params)
    if (res.code === '0') {
      adminList.value = res.data.records.map(item => ({
        ...item,
        role: item.role === 2 ? '超级管理员' : (item.role === 1 ? '普通管理员' : '普通用户')
      }))
      totalAdmins.value = res.data.total
    }
  } catch (error) {
    console.error('获取管理员列表失败', error)
    ElMessage.error('获取管理员列表失败')
  }
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
  // 只复制需要的字段
  adminForm.id = row.id
  adminForm.username = row.username
  adminForm.role = row.role
  adminForm.phone = row.phone
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
const confirmDeleteAdmin = async () => {
  try {
    const res = await deleteUserAPI(adminToDelete.value.username)
    if (res.code === '0') {
      ElMessage.success(`管理员 "${adminToDelete.value.username}" 已成功删除`)
      deleteDialogVisible.value = false
      fetchAdminList()
    }
  } catch (error) {
    console.error('删除失败', error)
    ElMessage.error('删除失败')
  }
}

// 重置表单
const resetAdminForm = () => {
  adminForm.id = 0
  adminForm.username = ''
  adminForm.role = '普通管理员'
  adminForm.phone = ''
  adminForm.password = ''
  adminForm.confirmPassword = ''
  nextTick(() => {
    adminFormRef.value?.resetFields()
  })
}

// 提交表单
const submitAdminForm = () => {
  adminFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (adminFormMode.value === 'add') {
          // 添加管理员
          const reqData = {
            username: adminForm.username,
            password: adminForm.password,
            phone: adminForm.phone,
            role: adminForm.role === '超级管理员' ? 2 : 1
          }
          const res = await createAdminAPI(reqData)
          if (res.code === '0') {
            ElMessage.success('添加管理员成功')
            adminDialogVisible.value = false
            fetchAdminList()
          }
        } else {
          // 更新管理员
          const reqData = {
            username: adminForm.username,
            phone: adminForm.phone,
            role: adminForm.role === '超级管理员' ? 2 : 1
          }
          if (adminForm.password) {
            reqData.password = adminForm.password
          }
          const res = await updateAdminAPI(reqData)
          if (res.code === '0') {
            ElMessage.success('更新管理员成功')
            adminDialogVisible.value = false
            fetchAdminList()
          }
        }
      } catch (error) {
        console.error('提交失败', error)
        ElMessage.error('操作失败: ' + (error.msg || '未知错误'))
      }
    } else {
      return false
    }
  })
}

// 初始加载
onMounted(() => {
  fetchAdminList()
})
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
