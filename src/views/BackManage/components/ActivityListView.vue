<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>活动资讯管理</span>
        <div class="header-actions">
          <!-- 搜索区域 -->
          <el-select
            v-model="queryParams.type"
            placeholder="全部分类"
            clearable
            class="search-select"
            @change="searchNews"
          >
            <el-option
              v-for="item in ACTIVITY_TYPES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="queryParams.title"
            placeholder="请输入活动标题"
            class="search-input"
            clearable
            @keyup.enter="searchNews"
          >
            <template #append>
              <el-button :icon="Search" @click="searchNews" />
            </template>
          </el-input>
          <el-button type="primary" @click="handleAddNews">
            <el-icon><Plus /></el-icon>发布资讯
          </el-button>
        </div>
      </div>
    </template>

    <!-- 资讯列表 -->
    <el-table :data="newsList" stripe style="width: 100%" v-loading="loading">
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
        width="80"
      />
      <el-table-column
        prop="title"
        label="标题"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column label="分类" width="100">
        <template #default="scope">
          <el-tag effect="plain">{{ getTypeName(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="封面图" width="100">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 40px"
            :src="scope.row.coverImage"
            :preview-src-list="[scope.row.coverImage]"
            fit="cover"
            preview-teleported
          />
        </template>
      </el-table-column>
      <el-table-column prop="publisher" label="发布人" width="100" />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160"
        :formatter="formatDateTime"
      />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
            {{ scope.row.status === 1 ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEditNews(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteNews(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.current"
        v-model:page-size="queryParams.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 50]"
        @size-change="searchNews"
        @current-change="searchNews"
      />
    </div>

    <!-- 编辑/新增对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑活动' : '发布活动'"
      width="800px"
      top="5vh"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动标题" prop="title">
              <el-input v-model="formData.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动分类" prop="type">
              <el-select
                v-model="formData.type"
                placeholder="请选择分类"
                style="width: 100%"
              >
                <el-option
                  v-for="item in ACTIVITY_TYPES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发布人" prop="publisher">
              <el-input
                v-model="formData.publisher"
                placeholder="请输入发布人/单位"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :label="0">草稿</el-radio>
                <el-radio :label="1">发布</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="活动时间" prop="activityTime">
          <el-date-picker
            v-model="activityDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="活动地点" prop="location">
          <el-input v-model="formData.location" placeholder="请输入活动地点" />
        </el-form-item>

        <el-form-item label="封面图片" prop="coverImage">
          <div class="cover-upload-wrapper">
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="handleCoverUpload"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              drag
            >
              <img
                v-if="formData.coverImage"
                :src="formData.coverImage"
                class="avatar"
              />
              <div v-else class="avatar-uploader-icon">
                <el-icon><Plus /></el-icon>
                <div class="upload-text">拖拽/点击</div>
              </div>
            </el-upload>
            <!-- 仅在有图片时显示提示文本 -->
            <div class="upload-tip" v-if="!formData.coverImage">
              建议尺寸 16:9，支持 JPG/PNG/GIF，大小不超过 5MB
            </div>
          </div>
        </el-form-item>

        <el-form-item label="活动摘要" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="2"
            placeholder="简短描述，用于列表展示"
          />
        </el-form-item>

        <el-form-item label="活动详情" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="5"
            placeholder="支持HTML富文本内容"
          />
        </el-form-item>

        <!-- 核心：图集编辑区域 -->
        <el-divider content-position="left">精彩瞬间 (图集)</el-divider>
        <div class="gallery-container">
          <div
            v-for="(img, index) in formData.imageList"
            :key="index"
            class="gallery-item"
          >
            <div class="gallery-item-inner">
              <el-upload
                class="gallery-uploader"
                action="#"
                :http-request="(options) => handleGalleryUpload(options, index)"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                drag
              >
                <img
                  v-if="img.imageUrl"
                  :src="img.imageUrl"
                  class="gallery-img-preview"
                />
                <div v-else class="gallery-uploader-placeholder">
                  <el-icon><Plus /></el-icon>
                  <span>拖拽/点击</span>
                </div>
              </el-upload>

              <div class="gallery-info">
                <el-input
                  v-model="img.caption"
                  placeholder="请输入图片说明..."
                  size="small"
                  class="caption-input"
                >
                  <template #prepend>题注</template>
                </el-input>
              </div>

              <el-button
                type="danger"
                icon="Delete"
                circle
                size="small"
                class="delete-btn"
                @click="removeGalleryItem(index)"
              />
            </div>
          </div>

          <el-button
            type="primary"
            plain
            style="width: 100%; margin-top: 10px"
            @click="addGalleryItem"
          >
            + 添加一张图片
          </el-button>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  pageActivity,
  getActivityDetail,
  createActivity,
  updateActivity,
  deleteActivity
} from '@/api/heritageActivity'
import { uploadFileAPI } from '@/api/file'
import dayjs from 'dayjs'

// --- 常量定义 ---
const ACTIVITY_TYPES = [
  { label: '展示推广', value: 1 },
  { label: '表演活动', value: 2 },
  { label: '交流融合', value: 3 },
  { label: '教育体验', value: 4 },
  { label: '市集消费', value: 5 },
  { label: '学术交流', value: 6 }
]

const getTypeName = (val) => {
  const type = ACTIVITY_TYPES.find((t) => t.value === val)
  return type ? type.label : '未知'
}

// 格式化日期时间
const formatDateTime = (row, column, cellValue) => {
  if (!cellValue) return ''
  return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
}

// 计算表格序号
const indexMethod = (index) => {
  return (queryParams.current - 1) * queryParams.size + index + 1
}

// --- 列表相关 ---
const loading = ref(false)
const newsList = ref([])
const total = ref(0)
const queryParams = reactive({
  current: 1,
  size: 10,
  title: '',
  type: null
})

const searchNews = async () => {
  loading.value = true
  try {
    const res = await pageActivity(queryParams)
    // 兼容后端返回格式 (假设 res.data 是 Page 对象)
    // 如果直接返回的是 Page 对象，则根据实际结构调整
    const pageData = res.data || {}
    newsList.value = pageData.records || []
    total.value = pageData.total || 0
  } catch (error) {
    console.error('获取列表失败', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

// --- 增删改相关 ---
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const activityDateRange = ref([]) // 日期范围绑定

const formData = reactive({
  id: null,
  title: '',
  type: null,
  publisher: '',
  status: 0,
  activityTime: '',
  location: '',
  coverImage: '',
  description: '',
  content: '',
  imageList: [] // { imageUrl, caption, sort }
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择分类', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 打开新增弹窗
const handleAddNews = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 打开编辑弹窗
const handleEditNews = async (row) => {
  isEdit.value = true
  resetForm()
  // 先从列表填充基础数据，防止详情接口慢导致空白
  Object.assign(formData, row)

  // 回显日期范围
  if (formData.activityTime) {
    // 尝试解析常见分隔符
    const separators = [' 至 ', ' - ', ' ~ ']
    for (const sep of separators) {
      if (formData.activityTime.includes(sep)) {
        const parts = formData.activityTime.split(sep)
        if (parts.length === 2) {
          activityDateRange.value = [parts[0].trim(), parts[1].trim()]
          break
        }
      }
    }
  }

  // 获取完整详情（主要是 content 和 imageList）
  try {
    const res = await getActivityDetail(row.id)
    if (res.data) {
      Object.assign(formData, res.data)
      // 确保 imageList 存在
      if (!formData.imageList) formData.imageList = []
    }
  } catch (error) {
    console.error('获取详情失败', error)
  }
  dialogVisible.value = true
}

// 删除
const handleDeleteNews = (row) => {
  ElMessageBox.confirm('确认删除该活动吗？此操作不可恢复。', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteActivity(row.id)
      ElMessage.success('删除成功')
      searchNews()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 重置表单
const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
  formData.id = null
  formData.title = ''
  formData.type = null
  formData.publisher = ''
  formData.status = 0
  formData.activityTime = ''
  formData.location = ''
  formData.coverImage = ''
  formData.description = ''
  formData.content = ''
  formData.imageList = []
  activityDateRange.value = []
}

// 图集操作
const addGalleryItem = () => {
  formData.imageList.push({ imageUrl: '', caption: '', sort: 0 })
}

const removeGalleryItem = (index) => {
  formData.imageList.splice(index, 1)
}

// 上传前校验
const beforeAvatarUpload = (rawFile) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('图片必须是 JPG/PNG/GIF 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

// 封面图上传
const handleCoverUpload = async (options) => {
  const { file, onSuccess, onError } = options
  try {
    const res = await uploadFileAPI([file])
    if (res.code === '0' || res.code === 200 || !res.code) {
      // 兼容返回格式：可能是字符串路径，也可能是数组
      let url = ''
      if (Array.isArray(res.data)) {
        url = res.data[0]
      } else {
        url = res.data
      }
      formData.coverImage = url
      onSuccess(url)
      ElMessage.success('上传成功')
    } else {
      onError(new Error(res.message || '上传失败'))
      ElMessage.error(res.message || '上传失败')
    }
  } catch (err) {
    onError(err)
    ElMessage.error('上传出错')
  }
}

// 图集上传
const handleGalleryUpload = async (options, index) => {
  const { file, onSuccess, onError } = options
  try {
    const res = await uploadFileAPI([file])
    if (res.code === '0' || res.code === 200 || !res.code) {
      let url = ''
      if (Array.isArray(res.data)) {
        url = res.data[0]
      } else {
        url = res.data
      }
      formData.imageList[index].imageUrl = url
      onSuccess(url)
      ElMessage.success('上传成功')
    } else {
      onError(new Error(res.message || '上传失败'))
      ElMessage.error(res.message || '上传失败')
    }
  } catch (err) {
    onError(err)
    ElMessage.error('上传出错')
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        // 处理日期时间
        if (activityDateRange.value && activityDateRange.value.length === 2) {
          formData.activityTime = `${activityDateRange.value[0]} 至 ${activityDateRange.value[1]}`
        }

        // 自动处理 sort
        formData.imageList.forEach((img, idx) => {
          img.sort = idx + 1
        })

        if (isEdit.value) {
          await updateActivity(formData)
          ElMessage.success('更新成功')
        } else {
          await createActivity(formData)
          ElMessage.success('发布成功')
        }
        dialogVisible.value = false
        searchNews()
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '发布失败')
        console.error(error)
      } finally {
        submitting.value = false
      }
    }
  })
}

// 初始化
onMounted(() => {
  searchNews()
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
}
.search-select {
  width: 150px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 图集样式 */
.gallery-container {
  border: 1px dashed #dcdfe6;
  padding: 15px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.gallery-item {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
  color: #909399;
}

/* 封面图上传样式 */
.cover-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
}

.avatar-uploader .avatar {
  width: 140px;
  height: 90px;
  display: block;
  object-fit: cover;
  border-radius: 4px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 140px;
  height: 90px;
  text-align: center;
  line-height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 图集上传样式 */
.gallery-container {
  border: 1px dashed #dcdfe6;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.gallery-item {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.gallery-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.gallery-item-inner {
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 12px;
}

.gallery-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.gallery-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.gallery-img-preview {
  width: 80px;
  height: 80px;
  display: block;
  object-fit: cover;
}

.gallery-uploader-placeholder {
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #8c939d;
  font-size: 12px;
  background-color: #f5f7fa;
}

.gallery-info {
  flex: 1;
}

.caption-input {
  width: 100%;
}

.delete-btn {
  flex-shrink: 0;
  margin-left: 5px;
}
</style>
