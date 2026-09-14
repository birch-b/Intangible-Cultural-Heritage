<script setup>
import { ref, reactive } from 'vue'
import { Plus, ChatDotSquare } from '@element-plus/icons-vue'
import { submitFeedbackAPI } from '@/api/feedback'
import { uploadFileAPI } from '@/api/file'
import { ElMessage } from 'element-plus'

/**
 * 反馈类型选项
 * 后端 type 枚举：1-内容纠错 2-系统建议 3-其他
 * 当前界面提供 4 个入口，其中「体验问题」「产品咨询」统一归入「其他(3)」，
 * 具体类型名会通过 title 字段原样提交，后台仍可看到明细。
 */
const TYPE_OPTIONS = [
  { label: '功能建议', value: '功能建议', type: 2 },
  { label: '体验问题', value: '体验问题', type: 3 },
  { label: '产品咨询', value: '产品咨询', type: 3 },
  { label: '其他', value: '其他', type: 3 }
]

const MAX_CONTENT = 500
const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/bmp']
const MAX_SIZE_MB = 5
const MAX_IMAGES = 5

const formRef = ref(null)
const submitting = ref(false)
// el-upload 的文件列表（选中但尚未上传）
const imageList = ref([])

const form = reactive({
  feedbackType: '',
  content: ''
})

const rules = {
  feedbackType: [
    { required: true, message: '请选择反馈类型', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入反馈内容', trigger: 'blur' },
    {
      min: 5,
      message: '请至少输入 5 个字，方便我们理解您的问题',
      trigger: 'blur'
    }
  ]
}

// 校验单张图片是否合规，返回错误提示（合规时返回空字符串）
const validateImage = (rawFile) => {
  if (!ACCEPT_TYPES.includes(rawFile.type)) {
    return '仅支持 JPG / PNG / BMP 格式的图片'
  }
  if (rawFile.size / 1024 / 1024 > MAX_SIZE_MB) {
    return `单张图片不能超过 ${MAX_SIZE_MB}MB`
  }
  return ''
}

// 超出数量限制
const handleExceed = () => {
  ElMessage.warning(`最多上传 ${MAX_IMAGES} 张图片`)
}

// 兼容后端上传接口可能返回：数组 / 逗号分隔字符串 / 单个字符串
const normalizeUploadResult = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data.filter(Boolean)
  if (typeof data === 'string') {
    return data
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  // 提交前统一校验图片，避免出现「点了没反应」
  const invalid = imageList.value.find(
    (f) => f.raw && validateImage(f.raw) !== ''
  )
  if (invalid) {
    ElMessage.error(
      `「${invalid.name}」不符合要求：${validateImage(invalid.raw)}`
    )
    return
  }

  submitting.value = true
  try {
    // 1. 上传图片（如有）
    let imageUrls = []
    const files = imageList.value.map((f) => f.raw).filter(Boolean)
    if (files.length) {
      const res = await uploadFileAPI(files)
      imageUrls = normalizeUploadResult(res && res.data)
      if (imageUrls.length === 0) {
        ElMessage.error('图片上传失败，请重试，或先移除图片再提交')
        return
      }
    }

    // 2. 提交反馈（后端要求 FormData）
    const typeOption = TYPE_OPTIONS.find((t) => t.value === form.feedbackType)
    const formData = new FormData()
    formData.append('type', typeOption ? typeOption.type : 3)
    formData.append('title', form.feedbackType)
    formData.append('content', form.content)
    imageUrls.forEach((url) => formData.append('images', url))

    await submitFeedbackAPI(formData)

    ElMessage.success('反馈提交成功，感谢您的宝贵意见')
    formRef.value.resetFields()
    imageList.value = []
  } catch (error) {
    console.error('提交反馈失败', error)
    ElMessage.error('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="feedback-page">
    <div class="page-inner">
      <div class="page-header">
        <h2>
          <el-icon><ChatDotSquare /></el-icon> 用户反馈
        </h2>
        <p>您的反馈对我们至关重要，我们会认真对待每一条建议</p>
      </div>

      <el-card class="feedback-card" shadow="never">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          @submit.prevent
        >
          <el-form-item label="反馈类型" prop="feedbackType">
            <el-radio-group v-model="form.feedbackType">
              <el-radio-button
                v-for="t in TYPE_OPTIONS"
                :key="t.value"
                :value="t.value"
              >
                {{ t.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="反馈内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="8"
              resize="none"
              :maxlength="MAX_CONTENT"
              show-word-limit
              placeholder="请详细描述您遇到的问题或建议：在哪个页面、做了什么操作、期望的结果是什么…"
            />
          </el-form-item>

          <el-form-item label="上传图片（选填）">
            <el-upload
              v-model:file-list="imageList"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :accept="'.jpg,.jpeg,.png,.bmp'"
              :limit="MAX_IMAGES"
              :on-exceed="handleExceed"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">
              支持 JPG / PNG / BMP，单张不超过 {{ MAX_SIZE_MB }}MB，最多
              {{ MAX_IMAGES }} 张
            </div>
          </el-form-item>

          <div class="form-actions">
            <el-button
              type="primary"
              size="large"
              :loading="submitting"
              @click="handleSubmit"
            >
              提交反馈
            </el-button>
          </div>
        </el-form>
      </el-card>

      <div class="info">
        <p>感谢您的宝贵意见</p>
        <p>我们会认真对待每一条反馈，并持续改进产品体验</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.feedback-page {
  min-height: 100vh;
  background-color: #e7eef7;
  padding: 30px 0 50px;
}

.page-inner {
  width: 62vw;
  min-width: 520px;
  max-width: 860px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;

  h2 {
    font-size: 28px;
    color: #8b0000;
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  p {
    color: #666;
    font-size: 14px;
    margin: 0;
  }
}

.feedback-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  :deep(.el-card__body) {
    padding: 28px 32px;
  }

  :deep(.el-form-item__label) {
    font-weight: 600;
    color: #444;
  }

  :deep(.el-form-item) {
    margin-bottom: 22px;
  }
}

.upload-tip {
  width: 100%;
  margin-top: 2px;
  font-size: 12px;
  color: #999;
  line-height: 1.6;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 12px;

  .el-button {
    min-width: 180px;
  }
}

.info {
  margin-top: 20px;
  text-align: center;
  color: #9aa4b2;
  font-size: 13px;
  line-height: 1.9;

  p {
    margin: 0;
  }
}

@media (max-width: 900px) {
  .page-inner {
    width: 90vw;
    min-width: 0;
  }
}
</style>
