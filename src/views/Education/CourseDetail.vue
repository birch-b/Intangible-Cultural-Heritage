<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  User,
  Clock,
  Calendar,
  UserFilled,
  VideoPlay,
  Document,
  Paperclip,
  Picture
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { getCourseDetail } from '@/api/course'
import {
  enrollCourse,
  cancelEnrollment,
  checkEnrollment
} from '@/api/trainingEnrollment'
import {
  pageTrainingComment,
  createTrainingComment,
  deleteTrainingComment
} from '@/api/trainingComment'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const courseId = route.params.id

const loading = ref(false)
const detail = ref(null)

// 章节
const activeSection = ref(null)
const sections = computed(() => {
  const list = detail.value?.sectionList || []
  return [...list].sort((a, b) => (a.sortNo ?? 0) - (b.sortNo ?? 0))
})
const sectionTypeMap = {
  1: { label: '视频', icon: VideoPlay },
  2: { label: '图文', icon: Document },
  3: { label: '附件', icon: Paperclip }
}

// 加入学习
const joinLoading = ref(false)
const joined = ref(false)

const deadlinePassed = computed(() => {
  const d = detail.value?.enrollmentDeadline
  return d ? dayjs(d).isBefore(dayjs()) : false
})
const isFull = computed(() => {
  const max = detail.value?.maxEnrollment
  return max && max > 0 && (detail.value?.enrolledCount || 0) >= max
})

const joinButtonText = computed(() => {
  if (joined.value) return '已加入学习'
  if (deadlinePassed.value) return '报名已截止'
  if (isFull.value) return '名额已满'
  return detail.value?.isFree === 1
    ? '立即加入学习'
    : `付费加入 ¥${detail.value?.fee ?? 0}`
})

const fetchDetail = async () => {
  loading.value = true
  try {
    const res = await getCourseDetail(courseId)
    detail.value = res.code === '0' ? res.data : res
    if (sections.value.length > 0) {
      activeSection.value = sections.value[0]
    }
  } catch (error) {
    console.error('获取课程详情失败', error)
    ElMessage.error('获取课程详情失败')
  } finally {
    loading.value = false
  }
}

const fetchJoinStatus = async () => {
  if (!userStore.token) return
  try {
    const res = await checkEnrollment(courseId)
    joined.value = res.code === '0' ? !!res.data : !!res
  } catch (error) {
    console.error('获取加入状态失败', error)
  }
}

const handleJoin = async () => {
  if (!userStore.token) {
    ElMessage.warning('请先登录后再加入学习')
    router.push('/login')
    return
  }
  if (joined.value) {
    // 退出学习
    try {
      await ElMessageBox.confirm('确定要退出该内容的学习吗？', '提示', {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await cancelEnrollment(courseId)
      joined.value = false
      if (detail.value.enrolledCount > 0) detail.value.enrolledCount--
      ElMessage.success('已退出学习')
    } catch {
      // 用户取消
    }
    return
  }
  if (deadlinePassed.value || isFull.value) return
  joinLoading.value = true
  try {
    await enrollCourse(courseId)
    joined.value = true
    detail.value.enrolledCount = (detail.value.enrolledCount || 0) + 1
    ElMessage.success('加入成功，开始学习吧')
  } catch (error) {
    console.error('加入学习失败', error)
  } finally {
    joinLoading.value = false
  }
}

const selectSection = (section) => {
  activeSection.value = section
}

// 评论社区
const commentLoading = ref(false)
const commentList = ref([])
const commentTotal = ref(0)
const commentParams = reactive({ current: 1, size: 10 })
const commentContent = ref('')
const replyTo = ref(null) // 被回复的评论
const commentSubmitting = ref(false)

const currentUserId = computed(
  () => userStore.userInfo?.id || userStore.userInfo?.userId
)

const fetchComments = async () => {
  commentLoading.value = true
  try {
    const res = await pageTrainingComment(courseId, {
      current: commentParams.current,
      size: commentParams.size
    })
    if (res.code === '0' && res.data) {
      commentList.value = res.data.records || []
      commentTotal.value = Number(res.data.total) || 0
    } else if (res.records) {
      commentList.value = res.records
      commentTotal.value = Number(res.total) || 0
    }
  } catch (error) {
    console.error('获取评论失败', error)
  } finally {
    commentLoading.value = false
  }
}

const startReply = (comment) => {
  replyTo.value = comment
}

const cancelReply = () => {
  replyTo.value = null
}

const submitComment = async () => {
  if (!userStore.token) {
    ElMessage.warning('请先登录后再发表评论')
    router.push('/login')
    return
  }
  if (!commentContent.value.trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }
  commentSubmitting.value = true
  try {
    await createTrainingComment({
      courseId,
      content: commentContent.value.trim(),
      parentId: replyTo.value?.id || null
    })
    ElMessage.success('评论成功')
    commentContent.value = ''
    replyTo.value = null
    commentParams.current = 1
    fetchComments()
  } catch (error) {
    console.error('发表评论失败', error)
  } finally {
    commentSubmitting.value = false
  }
}

const handleDeleteComment = (comment) => {
  ElMessageBox.confirm('确定要删除该评论吗？', '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteTrainingComment(comment.id)
        ElMessage.success('删除成功')
        fetchComments()
      } catch (error) {
        console.error('删除评论失败', error)
      }
    })
    .catch(() => {})
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchDetail().then(() => {
    fetchJoinStatus()
    if (detail.value?.communityEnabled === 1) {
      fetchComments()
    }
  })
})
</script>

<template>
  <div class="course-detail-page" v-loading="loading">
    <div class="page-inner">
      <el-button class="back-btn" :icon="ArrowLeft" text @click="goBack">
        返回
      </el-button>

      <template v-if="detail">
        <!-- 头部信息 -->
        <div class="course-header">
          <div class="cover-box">
            <img
              v-if="detail.coverImage"
              :src="detail.coverImage"
              :alt="detail.title"
            />
            <div v-else class="cover-empty">
              <el-icon :size="48"><Picture /></el-icon>
            </div>
          </div>
          <div class="header-info">
            <h1 class="course-title">{{ detail.title }}</h1>
            <p class="course-summary">{{ detail.summary }}</p>
            <div class="info-tags">
              <el-tag effect="dark">{{
                detail.contentTypeName || '培训内容'
              }}</el-tag>
              <el-tag v-if="detail.isFree === 1" type="success">免费</el-tag>
              <el-tag v-else type="danger">¥{{ detail.fee ?? 0 }}</el-tag>
            </div>
            <div class="info-meta">
              <span
                ><el-icon><User /></el-icon> 讲师：{{
                  detail.teacher || '佚名'
                }}</span
              >
              <span v-if="detail.duration">
                <el-icon><Clock /></el-icon> 时长：{{ detail.duration }}
              </span>
              <span
                ><el-icon><UserFilled /></el-icon>
                {{ detail.enrolledCount || 0 }} 人已学习</span
              >
              <span v-if="detail.enrollmentDeadline">
                <el-icon><Calendar /></el-icon>
                报名截止：{{ detail.enrollmentDeadline }}
              </span>
            </div>
            <el-button
              class="join-btn"
              type="primary"
              size="large"
              :loading="joinLoading"
              :disabled="!joined && (deadlinePassed || isFull)"
              @click="handleJoin"
            >
              {{ joinButtonText }}
            </el-button>
          </div>
        </div>

        <!-- 主体：章节 + 内容 -->
        <div class="course-body">
          <!-- 左侧章节列表 -->
          <div class="section-panel">
            <h3>课程章节（{{ sections.length }}）</h3>
            <el-scrollbar max-height="520px">
              <ul class="section-list">
                <li
                  v-for="(section, index) in sections"
                  :key="section.id || index"
                  class="section-item"
                  :class="{
                    active:
                      activeSection?.id === section.id ||
                      (!section.id && activeSection === section)
                  }"
                  @click="selectSection(section)"
                >
                  <span class="section-index">{{ index + 1 }}</span>
                  <div class="section-meta">
                    <span class="section-title">{{
                      section.title || '未命名章节'
                    }}</span>
                    <span class="section-sub">
                      <el-icon>
                        <component
                          :is="
                            sectionTypeMap[section.sectionType]?.icon ||
                            Document
                          "
                        />
                      </el-icon>
                      {{ sectionTypeMap[section.sectionType]?.label || '图文' }}
                      <template v-if="section.duration">
                        · {{ section.duration }}</template
                      >
                    </span>
                  </div>
                </li>
                <el-empty
                  v-if="sections.length === 0"
                  description="暂无章节"
                  :image-size="80"
                />
              </ul>
            </el-scrollbar>
          </div>

          <!-- 右侧内容区 -->
          <div class="content-panel">
            <template v-if="activeSection">
              <h3 class="content-title">{{ activeSection.title }}</h3>
              <!-- 视频 -->
              <div v-if="activeSection.sectionType === 1" class="video-box">
                <video
                  v-if="activeSection.videoUrl"
                  :src="activeSection.videoUrl"
                  controls
                  style="width: 100%; max-height: 460px; background: #000"
                ></video>
                <el-empty v-else description="暂无视频资源" />
              </div>
              <!-- 图文 -->
              <div
                v-else-if="activeSection.sectionType === 2"
                class="rich-content"
                v-html="activeSection.content"
              ></div>
              <!-- 附件 -->
              <div
                v-else-if="activeSection.sectionType === 3"
                class="attachment-box"
              >
                <el-icon :size="40"><Paperclip /></el-icon>
                <p>章节附件</p>
                <el-button
                  v-if="activeSection.attachmentUrl"
                  type="primary"
                  tag="a"
                  :href="activeSection.attachmentUrl"
                  target="_blank"
                  rel="noopener"
                >
                  下载附件
                </el-button>
                <el-empty v-else description="暂无附件" :image-size="60" />
              </div>
            </template>
            <el-empty v-else description="请选择左侧章节查看内容" />
          </div>
        </div>

        <!-- 详情介绍 -->
        <div class="course-intro" v-if="detail.content">
          <h3>内容介绍</h3>
          <div class="rich-content" v-html="detail.content"></div>
        </div>

        <!-- 互动学习社区 -->
        <div class="comment-area" v-if="detail.communityEnabled === 1">
          <h3>互动学习社区（{{ commentTotal }}）</h3>

          <div class="comment-input-box">
            <div v-if="replyTo" class="reply-tip">
              回复 @{{ replyTo.username }}
              <el-button link type="primary" size="small" @click="cancelReply"
                >取消回复</el-button
              >
            </div>
            <el-input
              v-model="commentContent"
              type="textarea"
              :rows="3"
              :placeholder="
                userStore.token ? '发表你的学习心得或疑问…' : '登录后可发表评论'
              "
              maxlength="500"
              show-word-limit
            />
            <div class="comment-actions">
              <el-button
                type="primary"
                :loading="commentSubmitting"
                :disabled="!userStore.token"
                @click="submitComment"
              >
                发表评论
              </el-button>
            </div>
          </div>

          <div class="comment-list" v-loading="commentLoading">
            <div
              v-for="comment in commentList"
              :key="comment.id"
              class="comment-item"
            >
              <el-avatar :size="38">{{
                (comment.username || '匿')[0]
              }}</el-avatar>
              <div class="comment-body">
                <div class="comment-head">
                  <span class="comment-user">{{
                    comment.username || '匿名用户'
                  }}</span>
                  <span class="comment-time">{{ comment.createTime }}</span>
                </div>
                <div class="comment-text">
                  <template v-if="comment.parentId">
                    <el-tag size="small" type="info" effect="plain"
                      >回复</el-tag
                    >
                  </template>
                  {{ comment.content }}
                </div>
                <div class="comment-ops">
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="startReply(comment)"
                  >
                    回复
                  </el-button>
                  <el-button
                    v-if="currentUserId && comment.userId === currentUserId"
                    link
                    type="danger"
                    size="small"
                    @click="handleDeleteComment(comment)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </div>
            <el-empty
              v-if="!commentLoading && commentList.length === 0"
              description="暂无评论，快来发表第一条吧"
            />
          </div>

          <div class="comment-pagination" v-if="commentTotal > 0">
            <el-pagination
              v-model:current-page="commentParams.current"
              v-model:page-size="commentParams.size"
              layout="prev, pager, next"
              :total="commentTotal"
              @current-change="fetchComments"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.course-detail-page {
  min-height: 100vh;
  background-color: #e7eef7;
  padding: 20px 0 50px;
}

.page-inner {
  width: 85vw;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 12px;
  font-size: 15px;
}

.course-header {
  display: flex;
  gap: 30px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.cover-box {
  width: 300px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cover-empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f2f5;
    color: #909399;
  }
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #222;
}

.course-summary {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.info-tags {
  display: flex;
  gap: 8px;
}

.info-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 13px;
  color: #666;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.join-btn {
  align-self: flex-start;
  margin-top: auto;
  min-width: 160px;
}

.course-body {
  display: flex;
  gap: 20px;
  margin-top: 20px;

  .section-panel {
    width: 300px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

    h3 {
      margin: 0 0 12px;
      font-size: 16px;
    }
  }

  .content-panel {
    flex: 1;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    min-height: 400px;
  }
}

.content-title {
  margin: 0 0 16px;
  font-size: 18px;
}

.section-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.section-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f5f7fa;
  }

  &.active {
    background: #ecf5ff;

    .section-title {
      color: #409eff;
    }
  }

  .section-index {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #f0f2f5;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
  }

  .section-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .section-title {
    font-size: 14px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .section-sub {
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 2px;
  }
}

.attachment-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
  color: #909399;
}

.rich-content {
  line-height: 1.8;
  color: #333;
  font-size: 14px;

  :deep(img) {
    max-width: 100%;
  }
}

.course-intro {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

  h3 {
    margin: 0 0 12px;
    font-size: 16px;
  }
}

.comment-area {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

  h3 {
    margin: 0 0 16px;
    font-size: 16px;
  }
}

.reply-tip {
  font-size: 13px;
  color: #409eff;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.comment-list {
  margin-top: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-body {
  flex: 1;
}

.comment-head {
  display: flex;
  gap: 12px;
  align-items: center;

  .comment-user {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .comment-time {
    font-size: 12px;
    color: #aaa;
  }
}

.comment-text {
  margin-top: 6px;
  font-size: 14px;
  color: #444;
  line-height: 1.6;
}

.comment-ops {
  margin-top: 4px;
}

.comment-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

@media (max-width: 900px) {
  .course-header {
    flex-direction: column;
  }

  .cover-box {
    width: 100%;
  }

  .course-body {
    flex-direction: column;

    .section-panel {
      width: 100%;
    }
  }
}
</style>
