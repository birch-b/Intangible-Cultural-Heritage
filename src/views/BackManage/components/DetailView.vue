<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>非遗项目管理</span>
        <div class="header-actions">
          <el-select
            v-model="queryForm.categoryId"
            placeholder="请选择类别"
            clearable
            style="width: 150px"
            @change="handleSearch"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-input
            v-model="queryForm.title"
            placeholder="请输入项目名称"
            class="search-input"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>新增项目
          </el-button>
          <el-button type="danger" @click="showBatchDeleteDialog">
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
        </div>
      </div>
    </template>

    <!-- 项目列表 -->
    <el-table
      v-loading="loading"
      :data="projectList"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
      <!-- <el-table-column prop="id" label="ID" width="80" /> -->
      <el-table-column prop="title" label="名称" width="80" show-overflow-tooltip />
      <el-table-column prop="categoryName" label="分类" width="120" />
      <el-table-column prop="region" label="地区" width="100" />
      <el-table-column label="封面" width="100">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.coverImage"
            :preview-src-list="[scope.row.coverImage]"
            :z-index="9999"
            preview-teleported
            fit="cover"
          >
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="summary" label="简介" show-overflow-tooltip />
      <el-table-column prop="views" label="浏览量" width="80" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <div class="pagination-info">共 {{ total }} 条记录</div>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formMode === 'add' ? '新增非遗项目' : '编辑非遗项目'"
      width="600px"
      top="5vh"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="项目名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="所属类别" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择类别" style="width: 100%">
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属地区" prop="region">
          <el-input v-model="form.region" placeholder="请输入所属地区" />
        </el-form-item>
        <el-form-item label="封面图片" prop="coverImage">
          <el-upload
            class="avatar-uploader"
            :http-request="handleCustomUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <img v-if="form.coverImage" :src="form.coverImage" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="简短摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="2"
            placeholder="请输入简短摘要"
          />
        </el-form-item>
        <el-form-item label="详细介绍" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入详细介绍"
          />
        </el-form-item>
        <el-form-item label="发布状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">已发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="精选推荐" prop="isFeatured">
          <el-switch
            v-model="form.isFeatured"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="删除确认" width="400px">
      <p>确定要删除选中的项目吗？此操作不可撤销。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" :loading="deleteLoading" @click="confirmDelete">
            确定删除
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Plus, Delete, Picture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  pageHeritageItem,
  createHeritageItem,
  updateHeritageItem,
  deleteHeritageItem,
  getHeritageDetailAPI
} from '@/api/heritage'
import { listAllCategory } from '@/api/category'
import { uploadFileAPI } from '@/api/file'

// 状态定义
const loading = ref(false)
const projectList = ref([])
const categoryOptions = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref([])

// 查询条件
const queryForm = reactive({
  title: '',
  categoryId: undefined
})

// 表单相关
const dialogVisible = ref(false)
const formMode = ref('add')
const formRef = ref(null)
const submitLoading = ref(false)
const form = reactive({
  id: undefined,
  title: '',
  categoryId: undefined,
  region: '',
  coverImage: '',
  summary: '',
  content: '',
  status: 0,
  isFeatured: 0
})

// 删除相关
const deleteDialogVisible = ref(false)
const deleteLoading = ref(false)
const rowToDelete = ref(null) // 单个删除时的行对象

// 表单校验规则
const rules = {
  title: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择所属类别', trigger: 'change' }],
  coverImage: [{ required: true, message: '请上传封面图片', trigger: 'change' }],
  summary: [{ required: true, message: '请输入简短摘要', trigger: 'blur' }]
}

// 计算表格序号
const indexMethod = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

// 获取类别列表（用于下拉）
const fetchCategories = async () => {
  try {
    const res = await listAllCategory()
    if (res.code === '0') {
      categoryOptions.value = res.data
    }
  } catch (error) {
    console.error('获取类别列表失败', error)
  }
}

// 获取项目列表
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      current: currentPage.value,
      size: pageSize.value,
      title: queryForm.title,
      categoryId: queryForm.categoryId
    }
    const res = await pageHeritageItem(params)
    if (res.code === '0') {
      projectList.value = res.data.records
      total.value = parseInt(res.data.total)
    }
  } catch (error) {
    console.error('获取项目列表失败', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchData()
}

// 状态显示辅助函数
const getStatusType = (status) => {
  const map = { 0: 'info', 1: 'warning', 2: 'success' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { 0: '草稿', 1: '待审核', 2: '已发布' }
  return map[status] || '未知'
}

// 新增
const showAddDialog = () => {
  formMode.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = async (row) => {
  formMode.value = 'edit'
  // 先重置表单，避免旧数据残留
  resetForm()
  
  // 基础数据回显
  Object.assign(form, row)
  form.status = Number(row.status)
  
  // 打开弹窗（此时可能 content 为空）
  dialogVisible.value = true
  
  // 调用详情接口获取完整数据（主要是 content）
  try {
    const res = await getHeritageDetailAPI(row.id)
    if (res.code === '0' && res.data) {
      Object.assign(form, res.data)
      form.status = Number(res.data.status)
    }
  } catch (error) {
    console.error('获取项目详情失败', error)
    ElMessage.warning('获取详细信息失败，请重试: ' + (error.message || '未知错误'))
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
  form.id = undefined
  form.title = ''
  form.categoryId = undefined
  form.region = ''
  form.coverImage = ''
  form.summary = ''
  form.content = ''
  form.status = 0
  form.isFeatured = 0
}

// 图片上传
const beforeUpload = (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) ElMessage.error('上传图片只能是 JPG 或 PNG 格式!')
  if (!isLt2M) ElMessage.error('上传图片大小不能超过 2MB!')
  return isImage && isLt2M
}

const handleCustomUpload = async (options) => {
  const { file } = options
  try {
    const res = await uploadFileAPI([file])
    if (res.code === '0') {
      form.coverImage = res.data
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch (error) {
    console.error('上传出错', error)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const api = formMode.value === 'add' ? createHeritageItem : updateHeritageItem
        const res = await api(form)
        if (res.code === '0') {
          ElMessage.success(formMode.value === 'add' ? '新增成功' : '更新成功')
          dialogVisible.value = false
          fetchData()
        }
      } catch (error) {
        console.error('提交失败', error)
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 表格选择
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 删除
const handleDelete = (row) => {
  rowToDelete.value = row
  deleteDialogVisible.value = true
}

// 批量删除
const showBatchDeleteDialog = () => {
  if (selectedRows.value.length === 0) {
    return ElMessage.warning('请选择要删除的项目')
  }
  rowToDelete.value = null // 标记为批量删除
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = async () => {
  deleteLoading.value = true
  try {
    if (rowToDelete.value) {
      // 单个删除
      const res = await deleteHeritageItem(rowToDelete.value.id)
      if (res.code === '0') {
        ElMessage.success('删除成功')
      }
    } else {
      // 批量删除
      const promises = selectedRows.value.map(row => deleteHeritageItem(row.id))
      await Promise.all(promises)
      ElMessage.success(`成功删除 ${selectedRows.value.length} 项`)
      selectedRows.value = []
    }
    deleteDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('删除失败', error)
  } finally {
    deleteLoading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchCategories()
  fetchData()
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
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 200px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
