<script setup>
import { ref } from 'vue'
const checked1 = ref(false)
const checked2 = ref(false)
const textarea1 = ref('')
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
        <el-checkbox v-model="checked1" label="功能建议" size="large" />
        <el-checkbox v-model="checked2" label="体验问题" size="large" />
        <el-checkbox v-model="checked2" label="产品咨询" size="large" />
        <el-checkbox v-model="checked2" label="...其他" size="large" />
      </div>
    </div>
    <div class="content">
      <p style="width: 100%; margin-bottom: 1vh">反馈内容</p>
      <el-input
        v-model="textarea1"
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
    <el-button type="primary" size="large">提交反馈</el-button>
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
