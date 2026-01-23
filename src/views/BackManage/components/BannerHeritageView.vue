<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>轮播图管理</span>
        <div class="header-actions">

          <el-button type="primary" @click="showAddCarouselDialog">
            <el-icon><Plus /></el-icon>新增
          </el-button>
        </div>
      </div>
    </template>

    <!-- 轮播图列表 -->
    <el-table :data="carouselList" stripe style="width: 100%">
      <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
      <el-table-column label="图片" width="120">
        <template #default="scope">
          <el-image
            style="width: 80px; height: 50px"
            :src="scope.row.imageUrl"
            fit="cover"
            :preview-src-list="[scope.row.imageUrl]"
            :z-index="9999"
            preview-teleported
          />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" />
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
      <el-table-column prop="createTime" label="创建时间">
        <template #default="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEditCarousel(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteCarousel(scope.row)"
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
        :total="totalCarousels"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @update:page-size="pageSize = $event"
      />
    </div>

    <!-- 添加/编辑轮播图对话框 -->
    <el-dialog
      v-model="carouselDialogVisible"
      :title="carouselFormMode === 'add' ? '添加轮播图' : '编辑轮播图'"
      width="500px"
    >
      <el-form
        :model="carouselForm"
        :rules="carouselRules"
        ref="carouselFormRef"
        label-width="100px"
      >
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="carouselForm.sort" :min="1" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="carouselForm.status" style="width: 100%">
            <el-option label="启用" value="启用" />
            <el-option label="禁用" value="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item label="轮播图片" prop="imageUrl">
          <el-upload
            class="carousel-uploader"
            drag
            :show-file-list="false"
            :http-request="handleCustomUpload"
            :before-upload="beforeUpload"
          >
            <img
              v-if="carouselForm.imageUrl"
              :src="carouselForm.imageUrl"
              class="carousel-image"
            />
            <div v-else class="el-upload__text">
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
            </div>
          </el-upload>
          <div class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="carouselDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCarouselForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="删除确认" width="400px">
      <p>
        确定要删除此轮播图吗？此操作不可撤销。
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDeleteCarousel"
            >确定删除</el-button
          >
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Plus, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { formatTime } from '@/utils/format'
import { uploadFileAPI } from '@/api/file'
import { pageBannerAPI, saveBannerAPI, deleteBannerAPI } from '@/api/banner'

// 轮播图列表相关
const carouselSearchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCarousels = ref(0)
const carouselList = ref([])
const loading = ref(false)

// 对话框相关
const carouselDialogVisible = ref(false)
const carouselFormMode = ref('add')
const carouselFormRef = ref(null)
const carouselForm = reactive({
  id: 0,
  imageUrl: '',
  sort: 1,
  status: '启用'
})

// 删除对话框相关
const deleteDialogVisible = ref(false)
const carouselToDelete = ref(null)

// 表单验证规则
const carouselRules = {
  sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  imageUrl: [{ required: true, message: '请上传轮播图片', trigger: 'change' }]
}

// 计算表格序号
const indexMethod = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

// 处理分页变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchCarouselList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchCarouselList()
}

// 获取轮播图列表
const fetchCarouselList = async () => {
  loading.value = true
  try {
    const data = await pageBannerAPI({
      current: currentPage.value,
      size: pageSize.value,
      type: 'HERITAGE'
    })
    
    carouselList.value = data.records || []
    totalCarousels.value = data.total || 0
  } catch (error) {
    console.error('获取轮播图失败', error)
    ElMessage.error('获取轮播图失败')
  } finally {
    loading.value = false
  }
}

// 搜索轮播图
const searchCarousels = () => {
  currentPage.value = 1
  fetchCarouselList()
}

// 显示添加轮播图对话框
const showAddCarouselDialog = () => {
  carouselFormMode.value = 'add'
  resetCarouselForm()
  carouselDialogVisible.value = true
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
  try {
    const res = await uploadFileAPI([options.file])
    if (res.code === '0' || res.code === 200 || !res.code) {
      const urls = res.data || res
      if (Array.isArray(urls) && urls.length > 0) {
        carouselForm.imageUrl = urls[0]
        ElMessage.success('上传成功')
      } else if (typeof urls === 'string') {
        carouselForm.imageUrl = urls
        ElMessage.success('上传成功')
      } else {
        ElMessage.error('上传返回值格式异常')
      }
    } else {
      ElMessage.error(res.msg || '上传失败')
    }
  } catch (error) {
    console.error('上传出错', error)
    ElMessage.error('上传出错')
  }
}

// 编辑轮播图
const handleEditCarousel = (row) => {
  carouselFormMode.value = 'edit'
  Object.assign(carouselForm, row)
  carouselDialogVisible.value = true
}

// 删除轮播图
const handleDeleteCarousel = (row) => {
  carouselToDelete.value = row
  deleteDialogVisible.value = true
}

// 确认删除轮播图
const confirmDeleteCarousel = async () => {
  try {
    await deleteBannerAPI(carouselToDelete.value.id, 'HERITAGE')
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    fetchCarouselList()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 重置表单
const resetCarouselForm = () => {
  carouselForm.id = 0
  carouselForm.imageUrl = ''
  carouselForm.sort = 1
  carouselForm.status = '启用'
  carouselFormRef.value?.resetFields()
}

// 提交表单
const submitCarouselForm = () => {
  carouselFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await saveBannerAPI(carouselForm, 'HERITAGE')
        ElMessage.success(carouselFormMode.value === 'add' ? '添加成功' : '更新成功')
        carouselDialogVisible.value = false
        fetchCarouselList()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    } else {
      return false
    }
  })
}

// 初始加载
onMounted(() => {
  fetchCarouselList()
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

.carousel-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 360px;
  height: 150px;
  transition: var(--el-transition-duration-fast);
}

.carousel-uploader:hover {
  border-color: var(--el-color-primary);
}

.carousel-uploader :deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
}

.carousel-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.carousel-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
</style>
