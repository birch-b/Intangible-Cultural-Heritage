<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>培训内容管理</span>
        <div class="header-actions">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增内容
          </el-button>
        </div>
      </div>
    </template>

    <!-- 筛选区域 -->
    <div class="filter-area">
      <el-input
        v-model="titleFilter"
        placeholder="内容标题"
        class="search-input"
        clearable
        @keyup.enter="searchList"
      />
      <el-select
        v-model="contentTypeFilter"
        placeholder="内容类型"
        clearable
        class="type-select"
        @change="searchList"
      >
        <el-option
          v-for="item in CONTENT_TYPE_OPTIONS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="categoryFilter"
        placeholder="所属分类"
        clearable
        filterable
        class="type-select"
        @change="searchList"
      >
        <el-option
          v-for="item in categoryOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="statusFilter"
        placeholder="状态"
        clearable
        class="status-select"
        @change="searchList"
      >
        <el-option label="已发布" :value="1" />
        <el-option label="草稿" :value="0" />
      </el-select>
      <el-button :icon="Search" type="primary" @click="searchList">
        查询
      </el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="courseList" stripe style="width: 100%">
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
        prop="title"
        label="标题"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column label="类型" width="100">
        <template #default="scope">
          <el-tag effect="plain">{{
            scope.row.contentTypeName ||
            getContentTypeName(scope.row.contentType)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="110">
        <template #default="scope">
          {{ getCategoryName(scope.row.categoryId) }}
        </template>
      </el-table-column>
      <el-table-column prop="teacher" label="讲师" width="90" />
      <el-table-column label="费用" width="90">
        <template #default="scope">
          {{ scope.row.isFree === 1 ? '免费' : `¥${scope.row.fee ?? 0}` }}
        </template>
      </el-table-column>
      <el-table-column prop="enrolledCount" label="已报名" width="80">
        <template #default="scope">{{ scope.row.enrolledCount || 0 }}</template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'success' : 'info'"
            effect="light"
          >
            {{ scope.row.status === 1 ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="info" @click="handleView(scope.row)">
            查看
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
        <el-empty description="暂无内容" />
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

    <!-- 新增/编辑/查看 对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="820px"
      top="5vh"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="110px"
        :disabled="dialogMode === 'view'"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="formData.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内容类型" prop="contentType">
              <el-select
                v-model="formData.contentType"
                placeholder="请选择类型"
                style="width: 100%"
              >
                <el-option
                  v-for="item in CONTENT_TYPE_OPTIONS"
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
            <el-form-item label="所属分类" prop="categoryId">
              <el-select
                v-model="formData.categoryId"
                placeholder="请选择分类"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="讲师/主讲人" prop="teacher">
              <el-input v-model="formData.teacher" placeholder="请输入讲师" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="时长描述" prop="duration">
              <el-input
                v-model="formData.duration"
                placeholder="如：共12课时 / 90分钟"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否免费" prop="isFree">
              <el-radio-group v-model="formData.isFree">
                <el-radio :label="1">免费</el-radio>
                <el-radio :label="0">收费</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="formData.isFree === 0">
          <el-col :span="12">
            <el-form-item label="费用" prop="fee">
              <el-input-number
                v-model="formData.fee"
                :min="0"
                :precision="2"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报名截止时间" prop="enrollmentDeadline">
              <el-date-picker
                v-model="formData.enrollmentDeadline"
                type="datetime"
                placeholder="选择报名截止时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人数上限" prop="maxEnrollment">
              <el-input-number
                v-model="formData.maxEnrollment"
                :min="0"
                controls-position="right"
              />
              <span class="form-tip">0 表示不限制</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :label="0">草稿</el-radio>
                <el-radio :label="1">发布</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="互动学习社区" prop="communityEnabled">
              <el-switch
                v-model="formData.communityEnabled"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="封面图" prop="coverImage">
          <el-upload
            class="cover-uploader"
            :show-file-list="false"
            :http-request="(opt) => handleFileUpload(opt, 'coverImage')"
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
        <el-form-item label="简介" prop="summary">
          <el-input
            v-model="formData.summary"
            type="textarea"
            :rows="2"
            maxlength="512"
            show-word-limit
            placeholder="请输入简介/摘要"
          />
        </el-form-item>
        <el-form-item label="详情" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="4"
            placeholder="详情（支持富文本HTML）"
          />
        </el-form-item>

        <!-- 章节管理 -->
        <el-divider content-position="left">
          章节/资源（视频、图文、附件）
        </el-divider>
        <div class="section-list">
          <el-card
            v-for="(section, index) in formData.sectionList"
            :key="index"
            class="section-card"
            shadow="never"
          >
            <template #header>
              <div class="section-header">
                <span>章节 {{ index + 1 }}</span>
                <el-button
                  type="danger"
                  size="small"
                  plain
                  :disabled="dialogMode === 'view'"
                  @click="removeSection(index)"
                >
                  删除
                </el-button>
              </div>
            </template>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="章节标题" label-width="90px">
                  <el-input
                    v-model="section.title"
                    placeholder="请输入章节标题"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="章节类型" label-width="90px">
                  <el-select v-model="section.sectionType" style="width: 100%">
                    <el-option label="视频" :value="1" />
                    <el-option label="图文" :value="2" />
                    <el-option label="附件" :value="3" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="时长描述" label-width="90px">
                  <el-input
                    v-model="section.duration"
                    placeholder="如：15分钟"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序序号" label-width="90px">
                  <el-input-number v-model="section.sortNo" :min="0" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              v-if="section.sectionType === 1"
              label="视频地址"
              label-width="90px"
            >
              <el-input v-model="section.videoUrl" placeholder="视频URL">
                <template #append>
                  <el-upload
                    :show-file-list="false"
                    :http-request="
                      (opt) => handleSectionFileUpload(opt, section, 'videoUrl')
                    "
                    :before-upload="beforeVideoUpload"
                  >
                    <el-button :disabled="dialogMode === 'view'"
                      >上传</el-button
                    >
                  </el-upload>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="section.sectionType === 2"
              label="图文内容"
              label-width="90px"
            >
              <el-input
                v-model="section.content"
                type="textarea"
                :rows="3"
                placeholder="图文内容（支持HTML）"
              />
            </el-form-item>
            <el-form-item
              v-if="section.sectionType === 3"
              label="附件地址"
              label-width="90px"
            >
              <el-input
                v-model="section.attachmentUrl"
                placeholder="附件下载URL"
              >
                <template #append>
                  <el-upload
                    :show-file-list="false"
                    :http-request="
                      (opt) =>
                        handleSectionFileUpload(opt, section, 'attachmentUrl')
                    "
                  >
                    <el-button :disabled="dialogMode === 'view'"
                      >上传</el-button
                    >
                  </el-upload>
                </template>
              </el-input>
            </el-form-item>
          </el-card>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            plain
            class="add-section-btn"
            @click="addSection"
          >
            + 添加章节
          </el-button>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ dialogMode === 'view' ? '关闭' : '取消' }}
          </el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="submitForm"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Search, Plus, Picture } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  pageCourse,
  getCourseDetail,
  createCourse,
  updateCourse,
  deleteCourse
} from '@/api/course'
import { listTrainingCategory } from '@/api/trainingCategory'
import { uploadFileAPI } from '@/api/file'

// 内容类型 1-在线课程 2-研培项目 3-讲座 4-资讯
const CONTENT_TYPE_OPTIONS = [
  { value: 1, label: '在线课程' },
  { value: 2, label: '研培项目' },
  { value: 3, label: '讲座' },
  { value: 4, label: '资讯' }
]
const getContentTypeName = (type) =>
  CONTENT_TYPE_OPTIONS.find((i) => i.value === Number(type))?.label || '未知'

// 分类选项
const categoryOptions = ref([])
const fetchCategoryOptions = async () => {
  try {
    const res = await listTrainingCategory()
    if (res.code === '0') {
      categoryOptions.value = res.data || []
    } else if (Array.isArray(res)) {
      categoryOptions.value = res
    }
  } catch (error) {
    console.error('获取培训分类失败', error)
  }
}
const getCategoryName = (id) =>
  categoryOptions.value.find((c) => c.id === id)?.name || '—'

// 列表与分页
const loading = ref(false)
const courseList = ref([])
const total = ref(0)
const queryParams = reactive({ current: 1, size: 10 })

// 筛选
const titleFilter = ref('')
const contentTypeFilter = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

// 对话框
const dialogVisible = ref(false)
const dialogMode = ref('add')
const submitLoading = ref(false)
const formRef = ref(null)

const dialogTitle = computed(() => {
  const map = { add: '新增内容', edit: '编辑内容', view: '查看内容' }
  return map[dialogMode.value]
})

const defaultSection = () => ({
  id: undefined,
  courseId: undefined,
  title: '',
  sectionType: 1,
  videoUrl: '',
  content: '',
  attachmentUrl: '',
  duration: '',
  sortNo: 0
})

const defaultForm = () => ({
  id: undefined,
  categoryId: null,
  title: '',
  contentType: 1,
  coverImage: '',
  summary: '',
  content: '',
  teacher: '',
  duration: '',
  isFree: 1,
  fee: 0,
  status: 0,
  enrollmentDeadline: '',
  maxEnrollment: 0,
  communityEnabled: 1,
  sectionList: []
})
const formData = reactive(defaultForm())

const formRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  contentType: [
    { required: true, message: '请选择内容类型', trigger: 'change' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const indexMethod = (index) =>
  (queryParams.current - 1) * queryParams.size + index + 1

// 获取列表
const fetchList = async () => {
  loading.value = true
  try {
    const res = await pageCourse({
      current: queryParams.current,
      size: queryParams.size,
      title: titleFilter.value || undefined,
      contentType:
        contentTypeFilter.value === '' ? undefined : contentTypeFilter.value,
      categoryId: categoryFilter.value || undefined,
      status: statusFilter.value === '' ? undefined : statusFilter.value
    })
    if (res.code === '0' && res.data) {
      courseList.value = res.data.records || []
      total.value = Number(res.data.total) || 0
    } else if (res.records) {
      courseList.value = res.records
      total.value = Number(res.total) || 0
    } else {
      courseList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取内容列表失败', error)
  } finally {
    loading.value = false
  }
}

const searchList = () => {
  queryParams.current = 1
  fetchList()
}

const resetFilters = () => {
  titleFilter.value = ''
  contentTypeFilter.value = ''
  categoryFilter.value = ''
  statusFilter.value = ''
  queryParams.current = 1
  fetchList()
}

// 章节操作
const addSection = () => {
  formData.sectionList.push(defaultSection())
}
const removeSection = (index) => {
  formData.sectionList.splice(index, 1)
}

// 打开对话框
const openDialog = async (mode, row) => {
  dialogMode.value = mode
  Object.assign(formData, defaultForm())
  if (row && (mode === 'edit' || mode === 'view')) {
    try {
      const res = await getCourseDetail(row.id)
      const detail =
        res.code === '0' && res.data ? res.data : res.id ? res : row
      Object.assign(formData, {
        id: detail.id,
        categoryId: detail.categoryId ?? null,
        title: detail.title || '',
        contentType: detail.contentType ?? 1,
        coverImage: detail.coverImage || '',
        summary: detail.summary || '',
        content: detail.content || '',
        teacher: detail.teacher || '',
        duration: detail.duration || '',
        isFree: detail.isFree ?? 1,
        fee: detail.fee ?? 0,
        status: detail.status ?? 0,
        enrollmentDeadline: detail.enrollmentDeadline || '',
        maxEnrollment: detail.maxEnrollment ?? 0,
        communityEnabled: detail.communityEnabled ?? 1,
        sectionList: (detail.sectionList || []).map((s) => ({
          id: s.id,
          courseId: s.courseId,
          title: s.title || '',
          sectionType: s.sectionType ?? 1,
          videoUrl: s.videoUrl || '',
          content: s.content || '',
          attachmentUrl: s.attachmentUrl || '',
          duration: s.duration || '',
          sortNo: s.sortNo ?? 0
        }))
      })
    } catch (error) {
      console.error('获取内容详情失败', error)
      ElMessage.error('获取内容详情失败')
      return
    }
  }
  dialogVisible.value = true
}

const handleAdd = () => openDialog('add')
const handleEdit = (row) => openDialog('edit', row)
const handleView = (row) => openDialog('view', row)

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除内容「${row.title}」吗？此操作不可撤销。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await deleteCourse(row.id)
        ElMessage.success('删除成功')
        if (courseList.value.length === 1 && queryParams.current > 1) {
          queryParams.current--
        }
        fetchList()
      } catch (error) {
        console.error('删除内容失败', error)
      }
    })
    .catch(() => {})
}

// 上传校验
const beforeImageUpload = (file) => {
  const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) ElMessage.error('只能上传 JPG/PNG/WEBP 格式图片!')
  if (!isLt5M) ElMessage.error('图片大小不能超过 5MB!')
  return isImage && isLt5M
}
const beforeVideoUpload = (file) => {
  const isLt200M = file.size / 1024 / 1024 < 200
  if (!isLt200M) ElMessage.error('视频大小不能超过 200MB!')
  return isLt200M
}

// 封面上传
const handleFileUpload = async (options, field) => {
  const { file } = options
  try {
    const res = await uploadFileAPI([file])
    if (res.code === '0') {
      formData[field] = res.data
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch (error) {
    console.error('文件上传出错', error)
  }
}

// 章节文件上传
const handleSectionFileUpload = async (options, section, field) => {
  const { file } = options
  try {
    const res = await uploadFileAPI([file])
    if (res.code === '0') {
      section[field] = res.data
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch (error) {
    console.error('章节文件上传出错', error)
  }
}

// 提交
const submitForm = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      const payload = {
        ...formData,
        fee: formData.isFree === 1 ? 0 : formData.fee,
        enrollmentDeadline: formData.enrollmentDeadline || null,
        sectionList: formData.sectionList.map((s, i) => ({
          ...s,
          courseId: formData.id,
          sortNo: s.sortNo ?? i
        }))
      }
      if (dialogMode.value === 'add') {
        await createCourse(payload)
        ElMessage.success('新增成功')
      } else {
        await updateCourse(payload)
        ElMessage.success('更新成功')
      }
      dialogVisible.value = false
      fetchList()
    } catch (error) {
      console.error('提交内容失败', error)
    } finally {
      submitLoading.value = false
    }
  })
}

onMounted(() => {
  fetchCategoryOptions()
  fetchList()
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

.filter-area {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  width: 180px;
}

.type-select {
  width: 150px;
}

.status-select {
  width: 120px;
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

.form-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
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

.section-list {
  margin-top: 10px;
}

.section-card {
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-section-btn {
  width: 100%;
  margin-top: 4px;
}
</style>
