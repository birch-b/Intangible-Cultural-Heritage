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
      v-loading="loading"
      :data="categoryList"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
        width="80"
      />
      <el-table-column prop="name" label="名称" width="200" />
      <el-table-column prop="description" label="介绍" />
      <!-- 后端无状态字段，已移除 -->
      <el-table-column label="封面" width="120">
        <template #default="scope">
          <el-image
            style="width: 80px; height: 50px"
            :src="scope.row.icon"
            fit="cover"
            :preview-src-list="[scope.row.icon]"
            :z-index="9999"
            preview-teleported
          >
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <!-- 添加创建时间显示 -->
      <el-table-column label="创建时间" width="180">
        <template #default="scope">
          {{ formatTime(scope.row.createTime) }}
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
        <!-- 后端无状态字段，已移除 -->
        <el-form-item label="封面图片" prop="icon">
          <el-upload
            class="category-uploader"
            :show-file-list="false"
            :http-request="handleCustomUpload"
            :before-upload="beforeUpload"
          >
            <img
              v-if="categoryForm.icon"
              :src="categoryForm.icon"
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
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="submitCategoryForm"
            >确定</el-button
          >
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
          <el-button
            type="danger"
            :loading="deleteLoading"
            @click="confirmDeleteCategory"
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
          <el-button
            type="danger"
            :loading="deleteLoading"
            @click="confirmBatchDelete"
            >确定删除</el-button
          >
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Delete, Picture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  pageCategory,
  addCategory,
  updateCategory,
  deleteCategory
} from '@/api/category'
import { uploadFileAPI } from '@/api/file'
import { formatTime } from '@/utils/format'

// 项目类别列表相关
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalCategories = ref(0)
const categoryList = ref([])

// 选中的类别
const selectedCategories = ref([])

// 对话框相关
const categoryDialogVisible = ref(false)
const categoryFormMode = ref('add')
const categoryFormRef = ref(null)
const submitLoading = ref(false)
const deleteLoading = ref(false)

const categoryForm = reactive({
  id: undefined,
  name: '',
  description: '',
  icon: ''
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
  icon: [{ required: true, message: '请上传封面图片', trigger: 'change' }]
}

// 计算表格序号
const indexMethod = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
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
const fetchCategoryList = async () => {
  loading.value = true
  try {
    const res = await pageCategory({
      current: currentPage.value,
      size: pageSize.value,
      sortField: 'createTime',
      sortOrder: 'asc'
    })
    if (res.code === '0') {
      // 前端兜底排序
      const records = res.data.records
      if (records && records.length > 0) {
        records.sort((a, b) => new Date(a.createTime) - new Date(b.createTime))
      }
      categoryList.value = records
      totalCategories.value = parseInt(res.data.total)
    } else {
      // 兼容直接返回数据的情况
      if (res.records) {
        const records = res.records
        if (records && records.length > 0) {
          records.sort(
            (a, b) => new Date(a.createTime) - new Date(b.createTime)
          )
        }
        categoryList.value = records
        totalCategories.value = parseInt(res.total)
      }
    }
  } catch (error) {
    console.error('获取类别列表失败', error)
  } finally {
    loading.value = false
  }
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
const confirmBatchDelete = async () => {
  deleteLoading.value = true
  try {
    // 后端未提供批量接口，循环调用单删
    const deletePromises = selectedCategories.value.map((item) =>
      deleteCategory(item.id)
    )
    await Promise.all(deletePromises)

    ElMessage.success(
      `已成功删除 ${selectedCategories.value.length} 个项目类别`
    )
    batchDeleteDialogVisible.value = false
    // 删除后刷新列表
    if (
      categoryList.value.length === selectedCategories.value.length &&
      currentPage.value > 1
    ) {
      currentPage.value--
    }
    fetchCategoryList()
    selectedCategories.value = []
  } catch (error) {
    console.error('批量删除失败', error)
    // ElMessage.error('批量删除部分或全部失败')
  } finally {
    deleteLoading.value = false
  }
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

// 自定义上传
const handleCustomUpload = async (options) => {
  const { file } = options
  try {
    const res = await uploadFileAPI([file])
    if (res.code === '0') {
      // 假设后端返回的数据结构中 data 是文件 URL
      // 根据实际接口返回调整
      categoryForm.icon = res.data
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch (error) {
    console.error('上传出错', error)
    // ElMessage.error('上传出错') // request.js 已经统一处理了错误提示，这里可以省略或仅打日志
  }
}

// 编辑项目类别
const handleEditCategory = (row) => {
  categoryFormMode.value = 'edit'
  // Object.assign(categoryForm, row) // 浅拷贝，row 中可能有不需要的字段
  categoryForm.id = row.id
  categoryForm.name = row.name
  categoryForm.description = row.description
  categoryForm.icon = row.icon
  categoryDialogVisible.value = true
}

// 删除项目类别
const handleDeleteCategory = (row) => {
  categoryToDelete.value = row
  deleteDialogVisible.value = true
}

// 确认删除项目类别
const confirmDeleteCategory = async () => {
  if (!categoryToDelete.value) return
  deleteLoading.value = true
  try {
    const res = await deleteCategory(categoryToDelete.value.id)
    if (res.code === '0') {
      ElMessage.success(`项目类别 "${categoryToDelete.value.name}" 已成功删除`)
      deleteDialogVisible.value = false
      // 删除后刷新列表
      if (categoryList.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
      }
      fetchCategoryList()
    } else {
      ElMessage.success('删除成功') // 兼容
      deleteDialogVisible.value = false
      fetchCategoryList()
    }
  } catch (error) {
    console.error('删除失败', error)
  } finally {
    deleteLoading.value = false
  }
}

// 重置表单
const resetCategoryForm = () => {
  categoryForm.id = undefined
  categoryForm.name = ''
  categoryForm.description = ''
  categoryForm.icon = ''
  categoryFormRef.value?.resetFields()
}

// 提交表单
const submitCategoryForm = () => {
  categoryFormRef.value?.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (categoryFormMode.value === 'add') {
          const res = await addCategory(categoryForm)
          if (res.code === '0') {
            ElMessage.success('添加项目类别成功')
            categoryDialogVisible.value = false
            fetchCategoryList()
          }
        } else {
          const res = await updateCategory(categoryForm)
          if (res.code === '0') {
            ElMessage.success('更新项目类别成功')
            categoryDialogVisible.value = false
            fetchCategoryList()
          }
        }
      } catch (error) {
        console.error('提交失败', error)
      } finally {
        submitLoading.value = false
      }
    } else {
      return false
    }
  })
}

// 初始加载
onMounted(() => {
  fetchCategoryList()
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

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 20px;
}
</style>
