<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>项目类别管理</span>
        <div class="header-actions">
          <el-button type="primary" @click="showAddCategoryDialog">
            <el-icon><Plus /></el-icon>新增类别
          </el-button>
          <el-button type="danger" @click="showBatchDeleteDialog">
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
        </div>
      </div>
    </template>

    <!-- 项目类别列表 -->
    <el-table
      :data="categoryList"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" width="200" />
      <el-table-column prop="description" label="介绍" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag
            :type="scope.row.status === '启用' ? 'success' : 'info'"
            effect="light"
          >
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="封面" width="120">
        <template #default="scope">
          <el-image
            style="width: 80px; height: 50px"
            :src="scope.row.coverImage"
            fit="cover"
            :preview-src-list="[scope.row.coverImage]"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEditCategory(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteCategory(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <div class="pagination-info">共 {{ totalCategories }} 条记录</div>
      <div class="pagination-selector">
        <span>{{ pageSize }}/page</span>
        <el-select v-model="pageSize" @change="handleSizeChange">
          <el-option label="10" :value="10" />
          <el-option label="20" :value="20" />
          <el-option label="50" :value="50" />
          <el-option label="100" :value="100" />
        </el-select>
      </div>
      <el-pagination
        v-model:current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="totalCategories"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加/编辑类别对话框 -->
    <el-dialog
      v-model="categoryDialogVisible"
      :title="categoryFormMode === 'add' ? '添加项目类别' : '编辑项目类别'"
      width="500px"
    >
      <el-form
        :model="categoryForm"
        :rules="categoryRules"
        ref="categoryFormRef"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
        <el-form-item label="介绍" prop="description">
          <el-input
            type="textarea"
            v-model="categoryForm.description"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="categoryForm.status" style="width: 100%">
            <el-option label="启用" value="启用" />
            <el-option label="禁用" value="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片" prop="coverImage">
          <el-upload
            class="category-uploader"
            :show-file-list="false"
            action="/api/upload"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
          >
            <img
              v-if="categoryForm.coverImage"
              :src="categoryForm.coverImage"
              class="category-image"
            />
            <el-icon v-else class="category-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="categoryDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCategoryForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="删除确认" width="400px">
      <p>
        确定要删除项目类别 "{{ categoryToDelete?.name }}" 吗？此操作不可撤销。
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDeleteCategory"
            >确定删除</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 批量删除确认对话框 -->
    <el-dialog
      v-model="batchDeleteDialogVisible"
      title="批量删除确认"
      width="400px"
    >
      <p>
        确定要删除选中的
        {{ selectedCategories.length }} 个项目类别吗？此操作不可撤销。
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchDeleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmBatchDelete"
            >确定删除</el-button
          >
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 项目类别列表相关
const currentPage = ref(1)
const pageSize = ref(10)
const totalCategories = ref(100)

// 模拟项目类别数据
const categoryList = ref([
  {
    id: 1,
    name: '传统工艺',
    description: '中国传统手工艺品的内容展示',
    status: '启用',
    coverImage: ''
  },
  {
    id: 2,
    name: '现代陶瓷',
    description: '现代陶瓷器皿展示内容艺术',
    status: '禁用',
    coverImage: ''
  }
])

// 选中的类别
const selectedCategories = ref([])

// 对话框相关
const categoryDialogVisible = ref(false)
const categoryFormMode = ref('add')
const categoryFormRef = ref(null)
const categoryForm = reactive({
  id: 0,
  name: '',
  description: '',
  status: '启用',
  coverImage: ''
})

// 删除对话框相关
const deleteDialogVisible = ref(false)
const categoryToDelete = ref(null)
const batchDeleteDialogVisible = ref(false)

// 表单验证规则
const categoryRules = {
  name: [
    { required: true, message: '请输入类别名称', trigger: 'blur' },
    { max: 50, message: '名称长度不能超过50个字符', trigger: 'blur' }
  ],
  description: [{ required: true, message: '请输入类别介绍', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  coverImage: [{ required: true, message: '请上传封面图片', trigger: 'change' }]
}

// 处理分页变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchCategoryList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchCategoryList()
}

// 获取项目类别列表
const fetchCategoryList = () => {
  // 这里应该是调用API获取数据，现在使用模拟数据
  console.log('获取项目类别列表', {
    page: currentPage.value,
    pageSize: pageSize.value
  })
  // 实际项目中，这里应该调用后端API
}

// 显示添加项目类别对话框
const showAddCategoryDialog = () => {
  categoryFormMode.value = 'add'
  resetCategoryForm()
  categoryDialogVisible.value = true
}

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedCategories.value = selection
}

// 显示批量删除对话框
const showBatchDeleteDialog = () => {
  if (selectedCategories.value.length === 0) {
    ElMessage.warning('请至少选择一个项目类别')
    return
  }
  batchDeleteDialogVisible.value = true
}

// 确认批量删除
const confirmBatchDelete = () => {
  // 这里应该调用API批量删除类别
  console.log('批量删除类别', selectedCategories.value)
  ElMessage.success(`已成功删除 ${selectedCategories.value.length} 个项目类别`)
  batchDeleteDialogVisible.value = false
  // 删除后刷新列表
  fetchCategoryList()
}

// 图片上传前检查
const beforeUpload = (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
  }
  return isImage && isLt2M
}

// 图片上传成功回调
const handleUploadSuccess = (res, file) => {
  categoryForm.coverImage = URL.createObjectURL(file.raw)
}

// 编辑项目类别
const handleEditCategory = (row) => {
  categoryFormMode.value = 'edit'
  Object.assign(categoryForm, row)
  categoryDialogVisible.value = true
}

// 删除项目类别
const handleDeleteCategory = (row) => {
  categoryToDelete.value = row
  deleteDialogVisible.value = true
}

// 确认删除项目类别
const confirmDeleteCategory = () => {
  // 这里应该调用API删除类别
  console.log('删除项目类别', categoryToDelete.value)
  ElMessage.success(`项目类别 "${categoryToDelete.value.name}" 已成功删除`)
  deleteDialogVisible.value = false
  // 删除后刷新列表
  fetchCategoryList()
}

// 重置表单
const resetCategoryForm = () => {
  categoryForm.id = 0
  categoryForm.name = ''
  categoryForm.description = ''
  categoryForm.status = '启用'
  categoryForm.coverImage = ''
  categoryFormRef.value?.resetFields()
}

// 提交表单
const submitCategoryForm = () => {
  categoryFormRef.value?.validate((valid) => {
    if (valid) {
      if (categoryFormMode.value === 'add') {
        // 这里应该调用API添加类别
        console.log('添加项目类别', categoryForm)
        ElMessage.success('添加项目类别成功')
      } else {
        // 这里应该调用API更新类别
        console.log('更新项目类别', categoryForm)
        ElMessage.success('更新项目类别成功')
      }
      categoryDialogVisible.value = false
      fetchCategoryList()
    } else {
      return false
    }
  })
}

// 初始加载
fetchCategoryList()
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.category-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 100px;
}

.category-uploader:hover {
  border-color: #409eff;
}

.category-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.category-image {
  width: 178px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
