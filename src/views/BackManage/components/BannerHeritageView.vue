<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>轮播图管理</span>
        <div class="header-actions">
          <el-input
            v-model="carouselSearchQuery"
            placeholder="请输入轮播图名称"
            class="search-input"
          >
            <template #append>
              <el-button :icon="Search" @click="searchCarousels" />
            </template>
          </el-input>
          <el-button type="primary" @click="showAddCarouselDialog">
            <el-icon><Plus /></el-icon>新增
          </el-button>
        </div>
      </div>
    </template>

    <!-- 轮播图列表 -->
    <el-table :data="carouselList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
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
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="linkUrl" label="链接地址" />
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
      <el-table-column prop="createTime" label="创建时间" width="180" />
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="carouselForm.title" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="carouselForm.sort" :min="1" />
        </el-form-item>
        <el-form-item label="链接地址" prop="linkUrl">
          <el-input v-model="carouselForm.linkUrl" />
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
            :show-file-list="false"
            action="/api/upload"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
          >
            <img
              v-if="carouselForm.imageUrl"
              :src="carouselForm.imageUrl"
              class="carousel-image"
            />
            <el-icon v-else class="carousel-uploader-icon"><Plus /></el-icon>
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
        确定要删除轮播图 "{{ carouselToDelete.title }}" 吗？此操作不可撤销。
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
import { ref, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 轮播图列表相关
const carouselSearchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCarousels = ref(2)

// 模拟轮播图数据
const carouselList = ref([
  {
    id: 1,
    title: '官方主题展示',
    imageUrl: '/path/to/image1.jpg',
    sort: 1,
    linkUrl: '/products/1',
    status: '启用',
    createTime: '2024-01-20 10:30:00'
  },
  {
    id: 2,
    title: '新品发布展示',
    imageUrl: '/path/to/image2.jpg',
    sort: 2,
    linkUrl: '/products/new',
    status: '禁用',
    createTime: '2024-01-19 15:45:00'
  }
])

// 对话框相关
const carouselDialogVisible = ref(false)
const carouselFormMode = ref('add')
const carouselFormRef = ref(null)
const carouselForm = reactive({
  id: 0,
  title: '',
  imageUrl: '',
  sort: 1,
  linkUrl: '',
  status: '启用'
})

// 删除对话框相关
const deleteDialogVisible = ref(false)
const carouselToDelete = ref(null)

// 表单验证规则
const carouselRules = {
  title: [
    { required: true, message: '请输入轮播图标题', trigger: 'blur' },
    { max: 50, message: '标题长度不能超过50个字符', trigger: 'blur' }
  ],
  sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
  linkUrl: [{ required: true, message: '请输入链接地址', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  imageUrl: [{ required: true, message: '请上传轮播图片', trigger: 'change' }]
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
const fetchCarouselList = () => {
  // 这里应该是调用API获取数据，现在使用模拟数据
  console.log('获取轮播图列表', {
    page: currentPage.value,
    pageSize: pageSize.value,
    query: carouselSearchQuery.value
  })
  // 实际项目中，这里应该调用后端API
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

// 图片上传成功回调
const handleUploadSuccess = (res, file) => {
  carouselForm.imageUrl = URL.createObjectURL(file.raw)
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
const confirmDeleteCarousel = () => {
  // 这里应该调用API删除轮播图
  console.log('删除轮播图', carouselToDelete.value)
  ElMessage.success(`轮播图 "${carouselToDelete.value.title}" 已成功删除`)
  deleteDialogVisible.value = false
  // 删除后刷新列表
  fetchCarouselList()
}

// 重置表单
const resetCarouselForm = () => {
  carouselForm.id = 0
  carouselForm.title = ''
  carouselForm.imageUrl = ''
  carouselForm.sort = 1
  carouselForm.linkUrl = ''
  carouselForm.status = '启用'
  carouselFormRef.value?.resetFields()
}

// 提交表单
const submitCarouselForm = () => {
  carouselFormRef.value?.validate((valid) => {
    if (valid) {
      if (carouselFormMode.value === 'add') {
        // 这里应该调用API添加轮播图
        console.log('添加轮播图', carouselForm)
        ElMessage.success('添加轮播图成功')
      } else {
        // 这里应该调用API更新轮播图
        console.log('更新轮播图', carouselForm)
        ElMessage.success('更新轮播图成功')
      }
      carouselDialogVisible.value = false
      fetchCarouselList()
    } else {
      return false
    }
  })
}

// 初始加载
fetchCarouselList()
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
  width: 178px;
  height: 100px;
}

.carousel-uploader:hover {
  border-color: #409eff;
}

.carousel-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.carousel-image {
  width: 178px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
