<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { computed, ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getActivityDetail } from '@/api/heritageActivity'
import {
  registerActivity,
  cancelActivityRegistration,
  checkActivityRegistration
} from '@/api/activityRegistration'
import { getActivityTypeLabel } from '@/constants/activityType'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const detail = ref(null)
const loading = ref(false)
const errorMessage = ref('')

// 报名相关状态
const signupLoading = ref(false)
const isRegistered = ref(false) // 当前用户是否已报名
const signupDialogVisible = ref(false)
const signupFormRef = ref(null)
const signupForm = reactive({
  remark: ''
})

// 已报名人数
const registeredCount = computed(
  () => Number(detail.value?.registeredCount) || 0
)

// 报名截止时间
const registrationDeadline = computed(
  () => detail.value?.registrationDeadline || null
)

// 人数上限（0 表示不限制）
const maxParticipants = computed(
  () => Number(detail.value?.maxParticipants) || 0
)

// 报名是否已截止
const isDeadlinePassed = computed(() => {
  const deadline = registrationDeadline.value
  if (!deadline) return false
  return dayjs(deadline).isBefore(dayjs())
})

// 是否名额已满
const isFull = computed(() => {
  return (
    maxParticipants.value > 0 && registeredCount.value >= maxParticipants.value
  )
})

// 报名按钮是否禁用
const signupDisabled = computed(
  () => isRegistered.value || isDeadlinePassed.value || isFull.value
)

const imageList = computed(() => {
  const list = detail.value?.imageList
  if (Array.isArray(list)) return list
  return []
})

const previewList = computed(() => {
  return imageList.value.map((item) => item?.imageUrl).filter(Boolean)
})

const getDetail = async () => {
  const id = route.query.id
  if (!id) {
    errorMessage.value = '缺少活动ID，无法加载详情'
    detail.value = null
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await getActivityDetail(id)
    if (res.code === '0' || res.code === 200 || !res.code) {
      const data = res.data || res
      const normalized = data && typeof data === 'object' ? data : null

      if (normalized && typeof normalized.imageList === 'string') {
        try {
          normalized.imageList = JSON.parse(normalized.imageList)
        } catch {
          normalized.imageList = []
        }
      }

      detail.value = normalized
      if (!detail.value) {
        errorMessage.value = '未获取到活动详情数据'
      } else {
        // 登录用户查询报名状态（接口未就绪时静默失败，不影响详情浏览）
        fetchRegistrationStatus(normalized.id)
      }
      return
    }

    detail.value = null
    errorMessage.value = res.message || '活动详情加载失败，请稍后重试'
  } catch (error) {
    console.error('获取详情失败', error)
    detail.value = null
    errorMessage.value = '活动详情加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 查询当前用户对该活动的报名状态
const fetchRegistrationStatus = async (activityId) => {
  if (!userStore.token || !activityId) return
  try {
    const res = await checkActivityRegistration(activityId)
    if (res.code === '0') {
      isRegistered.value = !!res.data
    }
  } catch (error) {
    // 报名接口未上线时忽略，页面按未报名展示
    console.warn('查询报名状态失败', error)
  }
}

// 点击报名：未登录先跳转登录
const handleSignupClick = () => {
  if (!userStore.token) {
    ElMessage.warning('请先登录后再报名')
    router.push({
      path: '/login',
      query: { redirect: route.fullPath }
    })
    return
  }
  signupForm.remark = ''
  signupDialogVisible.value = true
}

// 提交报名
const submitSignup = () => {
  signupFormRef.value?.validate(async (valid) => {
    if (!valid) return
    signupLoading.value = true
    try {
      const res = await registerActivity({
        activityId: detail.value.id,
        remark: signupForm.remark
      })
      if (res.code === '0') {
        ElMessage.success('报名成功！可在个人中心“我的活动”查看')
        signupDialogVisible.value = false
        isRegistered.value = true
        detail.value.registeredCount = registeredCount.value + 1
      }
    } catch (error) {
      console.error('报名失败', error)
    } finally {
      signupLoading.value = false
    }
  })
}

// 取消报名
const handleCancelSignup = () => {
  ElMessageBox.confirm('确定要取消本次活动报名吗？', '取消报名', {
    confirmButtonText: '确定取消',
    cancelButtonText: '再想想',
    type: 'warning'
  })
    .then(async () => {
      try {
        await cancelActivityRegistration(detail.value.id)
        ElMessage.success('已取消报名')
        isRegistered.value = false
        detail.value.registeredCount = Math.max(0, registeredCount.value - 1)
      } catch (error) {
        console.error('取消报名失败', error)
      }
    })
    .catch(() => {})
}

const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : ''
}

// 活动分类名称（枚举统一维护于 src/constants/activityType.js）
const getTypeName = (val) => {
  const label = getActivityTypeLabel(val)
  return label === '未知' ? '其他活动' : label
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <div class="detail-container" v-loading="loading">
    <div class="breadcrumb-bar">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/activity' }"
          >活动资讯</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/act_category' }"
          >全部活动</el-breadcrumb-item
        >
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div v-if="errorMessage" class="status-wrap">
      <el-alert
        :title="errorMessage"
        type="error"
        show-icon
        :closable="false"
      />
    </div>

    <div v-else-if="!detail" class="status-wrap">
      <el-empty description="暂无活动详情" />
    </div>

    <div v-else class="content-wrapper">
      <h1 class="title">{{ detail.title }}</h1>
      <div class="meta-info">
        <span class="tag">{{ getTypeName(detail.type) }}</span>
        <span class="time">发布时间：{{ formatTime(detail.createTime) }}</span>
        <span class="publisher">发布者：{{ detail.publisher || '未知' }}</span>
      </div>

      <div class="activity-info-card">
        <div class="info-item">
          <span class="label">活动时间：</span>
          <span class="value">{{ detail.activityTime || '暂无时间信息' }}</span>
        </div>
        <div class="info-item">
          <span class="label">活动地点：</span>
          <span class="value">{{ detail.location || '暂无地点信息' }}</span>
        </div>
        <div class="info-item">
          <span class="label">报名人数：</span>
          <span class="value">
            {{ registeredCount }} 人<template v-if="maxParticipants > 0">
              / 上限 {{ maxParticipants }} 人</template
            >
          </span>
        </div>
        <div class="info-item" v-if="registrationDeadline">
          <span class="label">报名截止：</span>
          <span class="value">{{ formatTime(registrationDeadline) }}</span>
        </div>
      </div>

      <!-- 报名操作区 -->
      <div class="signup-bar">
        <template v-if="isRegistered">
          <el-tag type="success" size="large" effect="light">已报名</el-tag>
          <el-button type="danger" plain @click="handleCancelSignup">
            取消报名
          </el-button>
        </template>
        <template v-else>
          <el-button
            type="primary"
            size="large"
            :loading="signupLoading"
            :disabled="signupDisabled"
            @click="handleSignupClick"
          >
            {{
              isDeadlinePassed ? '报名已截止' : isFull ? '名额已满' : '立即报名'
            }}
          </el-button>
        </template>
      </div>

      <!-- 报名信息填写弹窗 -->
      <el-dialog
        v-model="signupDialogVisible"
        title="活动报名"
        width="460px"
        :close-on-click-modal="false"
      >
        <el-form ref="signupFormRef" :model="signupForm" label-width="90px">
          <el-form-item label="活动名称">
            <span>{{ detail.title }}</span>
          </el-form-item>
          <el-form-item label="报名备注">
            <el-input
              v-model="signupForm.remark"
              type="textarea"
              :rows="3"
              maxlength="255"
              show-word-limit
              placeholder="选填，如有同行人数或特殊需求可备注"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="signupDialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              :loading="signupLoading"
              @click="submitSignup"
              >确认报名</el-button
            >
          </span>
        </template>
      </el-dialog>

      <div class="cover-image" v-if="detail.coverImage">
        <img :src="detail.coverImage" alt="活动封面" />
      </div>

      <div class="description" v-if="detail.description">
        <h3>活动摘要</h3>
        <p>{{ detail.description }}</p>
      </div>

      <div
        class="html-content"
        v-if="detail.content"
        v-html="detail.content"
      ></div>
      <el-empty v-else description="暂无正文内容" />

      <div class="gallery" v-if="imageList.length > 0">
        <h3>精彩瞬间</h3>
        <div class="gallery-grid">
          <div
            class="gallery-item"
            v-for="(img, index) in imageList"
            :key="index"
          >
            <el-image
              :src="img.imageUrl"
              fit="cover"
              :preview-src-list="previewList"
              :initial-index="index"
              preview-teleported
            />
            <p class="caption">{{ img.caption }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-container {
  min-height: 100vh;
  background-color: #88393c;
  padding-bottom: 50px;

  .breadcrumb-bar {
    background-color: #88393c;
    padding: 20px 10%;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .status-wrap {
    width: 80%;
    margin: 0 auto;
    background-color: #fff;
    padding: 24px;
    border-radius: 8px;
  }

  .content-wrapper {
    width: 80%;
    margin: 0 auto;
    background-color: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .title {
      font-size: 28px;
      color: #303133;
      margin-bottom: 20px;
      text-align: center;
    }

    .meta-info {
      display: flex;
      justify-content: center;
      gap: 20px;
      color: #909399;
      font-size: 14px;
      margin-bottom: 30px;
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 20px;

      .tag {
        color: #409eff;
        background: #ecf5ff;
        padding: 2px 8px;
        border-radius: 4px;
      }
    }

    .activity-info-card {
      background-color: #fdf6ec;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 30px;

      .info-item {
        margin-bottom: 10px;
        font-size: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-weight: bold;
          color: #e6a23c;
        }

        .value {
          color: #606266;
        }
      }
    }

    .signup-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-bottom: 30px;
    }

    .cover-image {
      text-align: center;
      margin-bottom: 30px;

      img {
        max-width: 100%;
        max-height: 500px;
        border-radius: 4px;
      }
    }

    .description {
      background-color: #f4f4f5;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 30px;
      border-left: 5px solid #909399;

      h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 18px;
      }

      p {
        margin: 0;
        line-height: 1.6;
        color: #606266;
        white-space: pre-wrap;
      }
    }

    .html-content {
      line-height: 1.8;
      color: #303133;
      font-size: 16px;
      margin-bottom: 40px;
      white-space: pre-wrap;

      :deep(img) {
        max-width: 100%;
        height: auto;
      }
    }

    .gallery {
      h3 {
        border-left: 4px solid #409eff;
        padding-left: 10px;
        margin-bottom: 20px;
      }

      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;

        .gallery-item {
          text-align: center;

          .el-image {
            width: 100%;
            height: 150px;
            border-radius: 4px;
          }

          .caption {
            margin-top: 8px;
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }
}
</style>
