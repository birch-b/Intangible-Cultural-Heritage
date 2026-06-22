<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>非遗资源管理</span>
        <div class="header-actions">
          <el-button type="primary" @click="handleAddMedia">
            <el-icon><Plus /></el-icon>新增资源
          </el-button>
        </div>
      </div>
    </template>

    <!-- 筛选区域 -->
    <div class="filter-area">
      <el-input
        v-model="queryForm.keyword"
        placeholder="标题/描述"
        class="search-input"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      />
      <el-select
        v-model="queryForm.sourceType"
        placeholder="资源来源"
        clearable
        style="width: 120px"
        @change="handleSearch"
      >
        <el-option label="基础资源" :value="0" />
        <el-option label="媒体关注" :value="1" />
        <el-option label="文化讲堂" :value="2" />
      </el-select>
      <el-select
        v-model="queryForm.mediaType"
        placeholder="资源类型"
        clearable
        style="width: 120px"
        @change="handleSearch"
      >
        <el-option label="图片" :value="1" />
        <el-option label="视频" :value="2" />
        <el-option label="音频" :value="3" />
      </el-select>

      <!-- 关联项目筛选 -->
      <el-select
        v-model="queryForm.itemId"
        placeholder="关联项目"
        class="search-input"
        clearable
        filterable
        @change="handleSearch"
      >
        <el-option
          v-for="item in heritageOptions"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        />
      </el-select>

      <el-button :icon="Search" @click="handleSearch">查询</el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <!-- 资源列表 -->
    <el-table v-loading="loading" :data="mediaList" stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column label="预览" width="120">
        <template #default="scope">
          <!-- 图片 -->
          <el-image
            v-if="scope.row.mediaType === 1"
            style="width: 80px; height: 60px"
            :src="scope.row.url"
            :preview-src-list="[scope.row.url]"
            fit="cover"
            :z-index="9999"
            preview-teleported
          />
          <!-- 视频 -->
          <div
            v-else-if="scope.row.mediaType === 2"
            class="media-thumbnail"
            @click="handlePreview(scope.row)"
          >
            <el-image
              v-if="scope.row.coverUrl"
              :src="scope.row.coverUrl"
              class="thumbnail-content"
              fit="cover"
            />
            <video
              v-show="!scope.row.coverUrl"
              :src="scope.row.url"
              preload="metadata"
              class="thumbnail-content"
              @loadedmetadata="onMetadataLoaded($event, scope.row.id)"
            ></video>
            <span class="media-icon">🎬</span>
            <span class="media-duration">{{
              formatDuration(mediaDurations[scope.row.id])
            }}</span>
            <div class="play-overlay">
              <el-icon><VideoPlay /></el-icon>
            </div>
          </div>
          <!-- 音频 -->
          <div
            v-else-if="scope.row.mediaType === 3"
            class="media-thumbnail"
            @click="handlePreview(scope.row)"
          >
            <el-image
              :src="scope.row.coverUrl || getHeritageCover(scope.row.itemId)"
              class="thumbnail-content"
              fit="cover"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span class="media-icon">🎵</span>
            <span class="media-duration">{{
              formatDuration(mediaDurations[scope.row.id])
            }}</span>
            <audio
              :src="scope.row.url"
              preload="metadata"
              style="display: none"
              @loadedmetadata="onMetadataLoaded($event, scope.row.id)"
            ></audio>
            <div class="play-overlay">
              <el-icon><Headset /></el-icon>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" show-overflow-tooltip />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column label="来源" width="100">
        <template #default="scope">
          <el-tag :type="getSourceTypeTag(scope.row.sourceType)">
            {{ getSourceTypeName(scope.row.sourceType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="80">
        <template #default="scope">
          <el-tag effect="plain">{{
            getMediaTypeName(scope.row.mediaType)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="关联项目" width="150" show-overflow-tooltip>
        <template #default="scope">
          {{ getHeritageTitle(scope.row.itemId) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template #default="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEditMedia(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteMedia(scope.row)"
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
        :page-sizes="[10, 20, 50]"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formMode === 'add' ? '新增资源' : '编辑资源'"
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="资源来源" prop="sourceType">
          <el-radio-group v-model="form.sourceType">
            <el-radio :label="0">基础资源</el-radio>
            <el-radio :label="1">媒体关注</el-radio>
            <el-radio :label="2">文化讲堂</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 基础资源必须关联项目，其他类型可选 -->
        <el-form-item
          label="关联项目"
          prop="itemId"
          :rules="
            form.sourceType === 0
              ? [
                  {
                    required: true,
                    message: '基础资源必须关联项目',
                    trigger: 'change'
                  }
                ]
              : []
          "
        >
          <el-select
            v-model="form.itemId"
            placeholder="请选择非遗项目"
            style="width: 100%"
            filterable
            clearable
          >
            <el-option
              v-for="item in heritageOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="资源类型" prop="mediaType">
          <el-select
            v-model="form.mediaType"
            placeholder="请选择类型"
            style="width: 100%"
          >
            <el-option label="图片" :value="1" />
            <el-option label="视频" :value="2" />
            <el-option label="音频" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入资源标题" />
        </el-form-item>

        <el-form-item label="资源文件" prop="url">
          <el-upload
            class="upload-demo"
            :http-request="handleUpload"
            :before-upload="beforeUpload"
            :show-file-list="false"
            drag
            :disabled="isUploading"
          >
            <div v-if="form.url" class="preview-container">
              <img v-if="form.mediaType === 1" :src="form.url" class="avatar" />
              <video
                v-else-if="form.mediaType === 2"
                :src="form.url"
                class="avatar"
              ></video>
              <div v-else class="file-name">{{ form.url }}</div>
            </div>
            <div v-else>
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽文件到此处或 <em>点击上传</em>
              </div>
            </div>
          </el-upload>
          <el-progress
            v-if="isUploading"
            :percentage="uploadProgress"
            :status="uploadProgress === 100 ? 'success' : ''"
            style="margin-top: 10px"
          />
        </el-form-item>

        <el-form-item
          v-if="form.mediaType === 2 || form.mediaType === 3"
          label="封面图"
          prop="coverUrl"
        >
          <el-upload
            class="upload-demo"
            :http-request="handleCoverUpload"
            :before-upload="beforeCoverUpload"
            :show-file-list="false"
            drag
            :disabled="isCoverUploading"
          >
            <div v-if="form.coverUrl" class="preview-container">
              <img :src="form.coverUrl" class="avatar" />
            </div>
            <div v-else>
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽图片到此处或 <em>点击上传</em>
              </div>
            </div>
          </el-upload>
          <el-progress
            v-if="isCoverUploading"
            :percentage="coverUploadProgress"
            :status="coverUploadProgress === 100 ? 'success' : ''"
            style="margin-top: 10px"
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述（图片可选，音视频建议填写）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="资源预览"
      width="50%"
      destroy-on-close
      @close="handleClosePreview"
    >
      <div style="text-align: center">
        <video
          v-if="previewType === 2"
          :src="previewUrl"
          controls
          autoplay
          style="max-width: 100%; max-height: 500px"
        ></video>
        <audio
          v-if="previewType === 3"
          :src="previewUrl"
          controls
          autoplay
          style="width: 100%"
        ></audio>
      </div>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  Search,
  Plus,
  UploadFilled,
  VideoPlay,
  Headset,
  Picture
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getMediaPageAPI,
  addMediaAPI,
  updateMediaAPI,
  deleteMediaAPI
} from '@/api/heritageMedia'
import { getHeritagePageAPI } from '@/api/heritage'
import { uploadFileAPI } from '@/api/file'
import { formatTime } from '@/utils/format'

// 状态定义
const loading = ref(false)
const mediaList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const heritageOptions = ref([])

// 查询条件
const queryForm = reactive({
  keyword: '',
  sourceType: undefined,
  mediaType: undefined,
  itemId: undefined
})

// 表单相关
const dialogVisible = ref(false)
const formMode = ref('add')
const formRef = ref(null)
const submitLoading = ref(false)
const form = reactive({
  id: undefined,
  itemId: undefined,
  mediaType: 1, // 默认图片
  url: '',
  coverUrl: '',
  sourceType: 0, // 默认基础资源
  title: '',
  description: ''
})
const uploadProgress = ref(0)
const isUploading = ref(false)
const coverUploadProgress = ref(0)
const isCoverUploading = ref(false)
const previewVisible = ref(false)
const previewUrl = ref('')
const previewType = ref(1)
const mediaDurations = reactive({})

const rules = {
  mediaType: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
  url: [{ required: true, message: '请上传资源文件', trigger: 'change' }],
  sourceType: [{ required: true, message: '请选择资源来源', trigger: 'change' }]
}

// 辅助函数
const getSourceTypeName = (type) => {
  const map = { 0: '基础资源', 1: '媒体关注', 2: '文化讲堂' }
  return map[type] || '未知'
}

const getSourceTypeTag = (type) => {
  const map = { 0: 'info', 1: 'warning', 2: 'success' }
  return map[type] || 'info'
}

const getMediaTypeName = (type) => {
  const map = { 1: '图片', 2: '视频', 3: '音频' }
  return map[type] || '未知'
}

const getHeritageTitle = (id) => {
  if (!id) return '-'
  const found = heritageOptions.value.find((item) => item.id === id)
  return found ? found.title : id
}

const getHeritageCover = (id) => {
  if (!id) return ''
  const found = heritageOptions.value.find((item) => item.id === id)
  return found ? found.coverImage : ''
}

const onMetadataLoaded = (e, id) => {
  mediaDurations[id] = e.target.duration
}

const formatDuration = (seconds) => {
  if (!seconds) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const handlePreview = (row) => {
  previewUrl.value = row.url
  previewType.value = row.mediaType
  previewVisible.value = true
}

const handleClosePreview = () => {
  previewUrl.value = ''
  previewVisible.value = false
}

// 获取非遗项目列表（用于下拉框）
const fetchHeritageList = async () => {
  try {
    const res = await getHeritagePageAPI({
      current: 1,
      size: 1000 // 获取足够多的项目用于选择
    })
    if (res.code === '0' || res.code === 200) {
      heritageOptions.value = res.data.records || []
    }
  } catch (error) {
    console.error('获取非遗项目列表失败', error)
  }
}

// 获取资源列表
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      current: currentPage.value,
      size: pageSize.value,
      keyword: queryForm.keyword,
      sourceType: queryForm.sourceType,
      mediaType: queryForm.mediaType,
      itemId: queryForm.itemId || undefined
    }
    const res = await getMediaPageAPI(params)
    if (res.code === '0' || res.code === 200) {
      mediaList.value = res.data.records
      total.value = parseInt(res.data.total)
    }
  } catch (error) {
    console.error('获取列表失败', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const resetFilters = () => {
  queryForm.keyword = ''
  queryForm.sourceType = undefined
  queryForm.mediaType = undefined
  queryForm.itemId = undefined
  handleSearch()
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

// 新增/编辑
const handleAddMedia = () => {
  formMode.value = 'add'
  resetForm()
  dialogVisible.value = true
}

const handleEditMedia = (row) => {
  formMode.value = 'edit'
  resetForm()
  Object.assign(form, row)
  dialogVisible.value = true
}

const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
  form.id = undefined
  form.itemId = undefined
  form.mediaType = 1
  form.url = ''
  form.coverUrl = ''
  form.sourceType = 0
  form.title = ''
  form.description = ''
}

// 文件上传
const beforeUpload = (file) => {
  // 1. 校验文件大小 (500MB)
  const isLt500M = file.size / 1024 / 1024 < 500
  if (!isLt500M) {
    ElMessage.warning('文件大小不能超过 500MB!')
    return false
  }

  // 2. 校验文件类型与 mediaType 是否匹配
  // form.mediaType: 1-图片, 2-视频, 3-音频
  if (form.mediaType === 2 && !file.type.startsWith('video/')) {
    ElMessage.warning('请选择视频文件!')
    return false
  }
  if (form.mediaType === 1 && !file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件!')
    return false
  }
  if (form.mediaType === 3 && !file.type.startsWith('audio/')) {
    ElMessage.warning('请选择音频文件!')
    return false
  }

  return true
}

const handleUpload = async (options) => {
  const { file } = options
  isUploading.value = true
  uploadProgress.value = 0

  try {
    const res = await uploadFileAPI([file], (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      uploadProgress.value = percentCompleted
    })
    if (res.code === '0' || res.code === 200) {
      form.url = res.data
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch (error) {
    console.error('上传出错', error)
    // 优先显示后端返回的具体错误信息
    if (error.response && error.response.data && error.response.data.message) {
      ElMessage.error(error.response.data.message)
    } else if (error.message && error.message.includes('413')) {
      ElMessage.error('文件大小超过服务器限制')
    } else {
      ElMessage.error('上传出错，请稍后重试')
    }
  } finally {
    isUploading.value = false
  }
}

// 封面图上传逻辑
const beforeCoverUpload = (file) => {
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.warning('封面图大小不能超过 10MB!')
    return false
  }
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件!')
    return false
  }
  return true
}

const handleCoverUpload = async (options) => {
  const { file } = options
  isCoverUploading.value = true
  coverUploadProgress.value = 0

  try {
    const res = await uploadFileAPI([file], (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      coverUploadProgress.value = percentCompleted
    })
    if (res.code === '0' || res.code === 200) {
      form.coverUrl = res.data
      ElMessage.success('封面图上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch (error) {
    console.error('上传出错', error)
    if (error.response && error.response.data && error.response.data.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('上传出错，请稍后重试')
    }
  } finally {
    isCoverUploading.value = false
  }
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const api = formMode.value === 'add' ? addMediaAPI : updateMediaAPI
        const res = await api(form)
        if (res.code === '0' || res.code === 200) {
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

// 删除
const handleDeleteMedia = (row) => {
  ElMessageBox.confirm('确定要删除该资源吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteMediaAPI(row.id)
      if (res.code === '0' || res.code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    } catch (error) {
      console.error('删除失败', error)
    }
  })
}

onMounted(() => {
  fetchData()
  fetchHeritageList()
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
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  font-size: 14px;
  color: #606266;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.file-name {
  padding: 10px;
  word-break: break-all;
}

.upload-demo :deep(.el-upload-dragger) {
  width: 200px;
  height: 150px;
}

.media-thumbnail {
  width: 80px;
  height: 60px;
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  background-color: #000;
}

.thumbnail-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-icon {
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 14px;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.media-duration {
  position: absolute;
  bottom: 2px;
  right: 4px;
  color: #fff;
  font-size: 10px;
  background: rgba(0, 0, 0, 0.5);
  padding: 0 4px;
  border-radius: 4px;
  z-index: 2;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1;
}

.media-thumbnail:hover .play-overlay {
  opacity: 1;
}

.play-overlay .el-icon {
  color: #fff;
  font-size: 24px;
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
</style>
