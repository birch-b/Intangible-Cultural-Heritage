<script setup>
import { ref } from 'vue'
import { submitFeedbackAPI } from '@/api/feedback'
import { ElMessage } from 'element-plus'

const feedbackType = ref(null) // 改为单选，对应后端 type 字段
const content = ref('')
const formModel = ref({
  file: null
})

// 抽屉图片预览相关逻辑
const imageUrl = ref([])

// 文件选择变化时的处理函数
const handleFileChange = (file, fileList) => {
  // 更新formModel中的file属性
  formModel.value.file = file.raw

  // 更新显示的图片列表
  imageUrl.value = fileList.map((f) => ({
    ...f,
    url: URL.createObjectURL(f.raw)
  }))
}

//删除图片事件
const handleRemove = (file) => {
  console.log(file)
  file = null
  formModel.value.file = null
  imageUrl.value = []
}

// 将文件转换为 Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

// 提交反馈
const handleSubmit = async () => {
  if (!feedbackType.value) {
    ElMessage.warning('请选择反馈类型')
    return
  }
  if (!content.value.trim()) {
    ElMessage.warning('请输入反馈内容')
    return
  }

  const images = []
  if (formModel.value.file) {
    try {
      const base64 = await fileToBase64(formModel.value.file)
      images.push(base64)
    } catch (error) {
      console.error('图片转换失败', error)
      ElMessage.error('图片上传失败')
      return
    }
  }

  // 映射类型：功能建议=2, 体验问题=3, 产品咨询=3, 其他=3
  // 后端定义：1=内容纠错 2=系统建议 3=其他
  // 这里简化映射：功能建议->2, 体验问题->3, 产品咨询->3, 其他->3
  // 实际上需要根据业务对齐，这里假设前两个是建议，后面是其他
  // 根据原页面选项：功能建议, 体验问题, 产品咨询, ...其他
  let typeInt = 3
  if (feedbackType.value === '功能建议') typeInt = 2
  else if (feedbackType.value === '体验问题')
    typeInt = 3 // 暂定
  else typeInt = 3

  try {
    await submitFeedbackAPI({
      type: typeInt,
      title: feedbackType.value, // 用类型作为标题
      content: content.value,
      images: images,
      contact: '' // 暂无联系方式输入框
    })
    ElMessage.success('反馈提交成功')
    // 重置表单
    feedbackType.value = null
    content.value = ''
    imageUrl.value = []
    formModel.value.file = null
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="container-view">
    <div class="logo">
      <img src="@/assets/image/logo1.jpg" />
      <p style="text-align: center; width: 100%">您的反馈对我们至关重要</p>
    </div>
    <div class="type">
      <p style="width: 100%">反馈类型</p>
      <div class="checkbox">
        <el-radio-group v-model="feedbackType">
          <el-radio label="功能建议" size="large" border>功能建议</el-radio>
          <el-radio label="体验问题" size="large" border>体验问题</el-radio>
          <el-radio label="产品咨询" size="large" border>产品咨询</el-radio>
          <el-radio label="其他" size="large" border>...其他</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="content">
      <p style="width: 100%; margin-bottom: 1vh">反馈内容</p>
      <el-input
        v-model="content"
        type="textarea"
        resize="none"
        :autosize="{ minRows: 10, maxRows: 10 }"
        placeholder="请详细描述您的问题或建议..."
      />
    </div>
    <div class="image">
      <p style="width: 100%; margin-bottom: 1vh">上传图片</p>
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        accept=".jpg,.png,.jpeg,.bmp"
        :file-list="imageUrl"
        :on-change="handleFileChange"
        :on-remove="handleRemove"
        :limit="1"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
    </div>
    <el-button type="primary" size="large" @click="handleSubmit"
      >提交反馈</el-button
    >
    <div class="info">
      <p style="width: 100%; text-align: center">感谢您的宝贵意见</p>
      <p style="width: 100%; text-align: center">
        我们会认真对待每一条反馈，并持续改进产品体验
      </p>
    </div>
  </div>
</template>

<style scope lang="scss">
.container-view {
  width: 50%;
  height: 100%;
  margin: 0 auto;
  // background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
  justify-content: space-around;

  .logo {
    width: 30%;
    height: 11%;
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
    justify-content: space-around;
    // background-color: pink;

    img {
      width: 20%;
      height: 60%;
      display: block;
      margin: 0 auto;
    }
  }

  .type {
    width: 100%;
    height: 10%;
    // background-color: pink;

    .checkbox {
      width: 80%;
      height: 50%;
      padding-top: 1%;
      display: flex;
      flex-wrap: wrap;
      align-content: space-around;
      justify-content: space-around;
      // background-color: pink;

      .el-checkbox {
        width: 15%;
        height: 100%;
        text-align: center;
        // border-radius: 10px;
        // background-color: #f3f4f6;
      }
    }
  }

  .content {
    width: 100%;
    height: 30%;
    // background-color: pink;
  }

  .image {
    width: 100%;
    height: 25%;
    // background-color: pink;
  }

  .info {
    width: 100%;
    height: 8%;
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
    justify-content: space-around;
    // background-color: pink;
  }
}
</style>
