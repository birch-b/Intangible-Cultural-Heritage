<script setup>
import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { updateUserInfoAPI } from '@/api/user'
import { uploadFileAPI } from '@/api/file'
import { getHeritageCollectionPageAPI } from '@/api/heritage'
import { ElMessage } from 'element-plus'
import { Camera } from '@element-plus/icons-vue'

const userStore = useUserStore()
const formRef = reactive(null)
const collectCount = ref(0)

const formLabelAlign = reactive({
  username: '',
  gender: '',
  phone: '',
  profile: '',
  avatar: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
}

const getCollectCount = async () => {
  try {
    const res = await getHeritageCollectionPageAPI({ current: 1, size: 1 })
    if (res.code === '0') {
      collectCount.value = parseInt(res.data.total) || 0
    }
  } catch {
    collectCount.value = 0
  }
}

// 初始化表单数据
const initForm = () => {
  if (userStore.userInfo) {
    formLabelAlign.username = userStore.userInfo.username || ''
    formLabelAlign.gender = userStore.userInfo.gender
    formLabelAlign.phone = userStore.userInfo.phone || ''
    formLabelAlign.profile = userStore.userInfo.profile || ''
    formLabelAlign.avatar = userStore.userInfo.avatar || ''
  }
}

// 监听 userInfo 变化，确保数据同步
watch(() => userStore.userInfo, initForm, { deep: true, immediate: true })

// 角色显示转换
const roleName = computed(() => {
  const roleMap = {
    0: '普通用户',
    1: '管理员',
    2: '超级管理员'
  }
  return roleMap[userStore.userInfo?.role] || '未知角色'
})

// 头像
const circleUrl = computed(
  () =>
    formLabelAlign.avatar ||
    userStore.userInfo?.avatar ||
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
)

// 头像上传前的校验
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像必须是 JPG 或 PNG 格式!')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

// 自定义头像上传
const uploadAvatar = async ({ file }) => {
  try {
    const res = await uploadFileAPI([file])
    if (res.code === '0' && res.data) {
      const urls = res.data.split(',')
      formLabelAlign.avatar = urls[0]
      ElMessage.success('头像上传成功，请点击"修改"按钮保存')
    } else {
      ElMessage.error(res.message || '头像上传失败')
    }
  } catch {
    ElMessage.error('头像上传异常')
  }
}

const handleSubmit = async () => {
  try {
    const currentUsername =
      formLabelAlign.username || userStore.userInfo?.username
    if (!currentUsername) {
      ElMessage.error('用户信息异常，无法修改')
      return
    }

    const updateData = {
      username: currentUsername,
      gender: formLabelAlign.gender,
      phone: formLabelAlign.phone,
      profile: formLabelAlign.profile,
      avatar: formLabelAlign.avatar
    }

    await updateUserInfoAPI(updateData)
    ElMessage.success('修改成功')
    await userStore.getUserInfo()
  } catch {
    ElMessage.error('修改失败')
  }
}

onMounted(() => {
  initForm()
  getCollectCount()
})
</script>

<!-- 个人资料-->
<template>
  <div class="CollectionItems">
    <el-container>
      <el-header height="10vh">
        <div class="topic">
          <h2><i class="iconfont icon-gerenziliao"></i>个人资料</h2>
        </div>
      </el-header>
      <el-main>
        <div class="show">
          <div class="avatar-container">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="uploadAvatar"
              :before-upload="beforeAvatarUpload"
            >
              <el-avatar :size="80" :src="circleUrl" />
              <div class="avatar-mask">
                <el-icon><Camera /></el-icon>
                <span>更换头像</span>
              </div>
            </el-upload>
          </div>
          <div class="role">
            <p>角色</p>
            <p>{{ roleName }}</p>
          </div>
          <div class="collect">
            <p>收藏项目</p>
            <p>{{ collectCount }}</p>
          </div>
        </div>
        <div class="form">
          <el-form
            ref="formRef"
            label-position="top"
            label-width="auto"
            :model="formLabelAlign"
            :rules="rules"
            style="max-width: 600px"
          >
            <el-form-item
              class="line"
              label="用户名"
              prop="username"
              style="width: 15vw"
            >
              <el-input
                v-model="formLabelAlign.username"
                size="large"
                disabled
              />
            </el-form-item>
            <el-form-item class="line" label="性别" prop="gender">
              <el-select
                v-model="formLabelAlign.gender"
                style="width: 10vw"
                placeholder="请选择性别"
              >
                <el-option label="男" :value="1" />
                <el-option label="女" :value="2" />
                <el-option label="未知" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item class="line" label="手机号" prop="phone">
              <el-input
                v-model="formLabelAlign.phone"
                style="width: 20vw"
                size="large"
              />
            </el-form-item>
            <el-form-item class="line" label="个人简介" prop="profile">
              <el-input
                v-model="formLabelAlign.profile"
                type="textarea"
                rows="10"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-main>
      <el-footer>
        <el-button
          color="rgb(170, 62, 62)"
          plain
          @click="handleSubmit"
          style="width: 10vw; height: 4vh"
          >修改</el-button
        >
      </el-footer>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/var.scss' as *;

.avatar-container {
  position: relative;
  cursor: pointer;

  .avatar-uploader {
    display: inline-block;
  }

  .avatar-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none; /* 让点击事件穿透到 el-upload */

    span {
      font-size: 12px;
      margin-top: 2px;
    }
  }

  &:hover .avatar-mask {
    opacity: 1;
  }
}

:deep(.el-textarea__inner) {
  resize: none;
}
.el-header {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.topic {
  width: 80vw;
  // background-color: blue;
  h2 {
    border-bottom: 5px solid $logintextColor;
    i {
      padding-left: 1vw;
      font-size: 25px;
      margin-right: 1vw;
    }
    color: $logintextColor;
    font-size: 25px;
    padding-bottom: 1vh;
  }
}

.el-main {
  display: flex;
  flex-direction: column;
  padding-left: 5vw;
  // background-color: blue;
  .show {
    display: flex;
    justify-content: space-between;
    width: 60vw;
    .role,
    .collect {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    p {
      font-size: 16px;
      margin-bottom: 2vh;
      font-weight: 700;
    }
  }
  .form {
    margin-top: 5vh;
  }
}

.el-footer {
  display: flex;
  justify-content: center;
  .el-button {
    width: 10vw;
  }
}
</style>
