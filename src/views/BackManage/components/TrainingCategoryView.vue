<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>培训分类管理</span>
        <div class="header-actions">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增分类
          </el-button>
        </div>
      </div>
    </template>

    <!-- 筛选区域 -->
    <div class="filter-area">
      <el-input
        v-model="nameFilter"
        placeholder="分类名称"
        class="search-input"
        clearable
        @keyup.enter="searchList"
      />
      <el-button :icon="Search" type="primary" @click="searchList">
        查询
      </el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="loading"
      :data="categoryList"
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
        width="70"
      />
      <el-table-column label="封面" width="100">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.coverImage"
            :preview-src-list="[scope.row.coverImage]"
            fit="cover"
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
      <el-table-column
        prop="name"
        label="分类名称"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="description"
        label="描述"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column prop="sortOrder" label="排序" width="80" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">
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
      <template #empty>
        <el-empty description="暂无分类" />
      </template>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.current"
        v-model:page-size="queryParams.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 50]"
        @size-change="fetchList"
        @current-change="fetchList"
      />
    </div>

    <!-- 新增/编辑 对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增分类' : '编辑分类'"
      width="560px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="90px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="封面图" prop="coverImage">
          <el-upload
            class="cover-uploader"
            :show-file-list="false"
            :http-request="handleCoverUpload"
            :before-upload="beforeImageUpload"
          >
            <img
              v-if="formData.coverImage"
              :src="formData.coverImage"
              class="cover-image"
            />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="el-upload__tip">JPG/PNG，不超过 5MB</div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            maxlength="255"
            show-word-limit
            placeholder="请输入分类描述"
          />
        </el-form-item>
        <el-form-item label="排序序号" prop="sortOrder">
          <el-input-number v-model="formData.sortOrder" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="submitForm"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Plus, Picture } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  pageTrainingCategory,
  createTrainingCategory,
  updateTrainingCategory,
  deleteTrainingCategory
} from '@/api/trainingCategory'
import { uploadFileAPI } from '@/api/file'

const loading = ref(false)
const categoryList = ref([])
const total = ref(0)
const queryParams = reactive({ current: 1, size: 10 })

const nameFilter = ref('')

const dialogVisible = ref(false)
const dialogMode = ref('add')
const submitLoading = ref(false)
const formRef = ref(null)

const defaultForm = () => ({
  id: undefined,
  name: '',
  coverImage: '',
  description: '',
  sortOrder: 0
})
const formData = reactive(defaultForm())

const formRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const indexMethod = (index) =>
  (queryParams.current - 1) * queryParams.size + index + 1

const fetchList = async () => {
  loading.value = true
  try {
    const res = await pageTrainingCategory({
      current: queryParams.current,
      size: queryParams.size,
      name: nameFilter.value || undefined
    })
    if (res.code === '0' && res.data) {
      categoryList.value = res.data.records || []
      total.value = Number(res.data.total) || 0
    } else if (res.records) {
      categoryList.value = res.records
      total.value = Number(res.total) || 0
    } else {
      categoryList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取培训分类列表失败', error)
  } finally {
    loading.value = false
  }
}

const searchList = () => {
  queryParams.current = 1
  fetchList()
}

const resetFilters = () => {
  nameFilter.value = ''
  queryParams.current = 1
  fetchList()
}

const handleAdd = () => {
  dialogMode.value = 'add'
  Object.assign(formData, defaultForm())
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogMode.value = 'edit'
  Object.assign(formData, defaultForm(), {
    id: row.id,
    name: row.name || '',
    coverImage: row.coverImage || '',
    description: row.description || '',
    sortOrder: row.sortOrder ?? 0
  })
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除分类「${row.name}」吗？此操作不可撤销。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await deleteTrainingCategory(row.id)
        ElMessage.success('删除成功')
        if (categoryList.value.length === 1 && queryParams.current > 1) {
          queryParams.current--
        }
        fetchList()
      } catch (error) {
        console.error('删除培训分类失败', error)
      }
    })
    .catch(() => {})
}

const beforeImageUpload = (file) => {
  const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) ElMessage.error('只能上传 JPG/PNG/WEBP 格式图片!')
  if (!isLt5M) ElMessage.error('图片大小不能超过 5MB!')
  return isImage && isLt5M
}

const handleCoverUpload = async (options) => {
  const { file } = options
  try {
    const res = await uploadFileAPI([file])
    if (res.code === '0') {
      formData.coverImage = res.data
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch (error) {
    console.error('封面上传出错', error)
  }
}

const submitForm = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      if (dialogMode.value === 'add') {
        await createTrainingCategory({ ...formData })
        ElMessage.success('新增成功')
      } else {
        await updateTrainingCategory({ ...formData })
        ElMessage.success('更新成功')
      }
      dialogVisible.value = false
      fetchList()
    } catch (error) {
      console.error('提交培训分类失败', error)
    } finally {
      submitLoading.value = false
    }
  })
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-area {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  width: 200px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 100px;
}

.cover-uploader:hover {
  border-color: #409eff;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.cover-image {
  width: 178px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
