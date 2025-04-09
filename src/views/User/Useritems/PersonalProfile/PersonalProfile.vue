<script setup>
import { reactive } from 'vue'

const formLabelAlign = reactive({
  password: '',
  password1: '',
  changepassword: ''
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
          <div>
            <el-avatar :size="80" :src="circleUrl" />
          </div>
          <div class="role">
            <p>角色</p>
            <p>管理员</p>
          </div>
          <div class="collect">
            <p>收藏项目</p>
            <p>18</p>
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
              prop="password"
              style="width: 15vw"
              :label-position="itemLabelPosition"
            >
              <el-input
                v-model="formLabelAlign.password"
                type="password"
                show-password
                size="large"
              />
            </el-form-item>
            <el-form-item
              class="line"
              label="性别"
              prop="password1"
              :label-position="itemLabelPosition"
            >
              <el-select
                v-model="formLabelAlign.changepassword"
                style="width: 10vw"
              >
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
            <el-form-item
              class="line"
              label="手机号"
              prop="changepassword"
              :label-position="itemLabelPosition"
            >
              <el-input
                v-model="formLabelAlign.changepassword"
                style="width: 20vw"
                size="large"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item
              class="line"
              label="个人简介"
              prop="changepassword"
              :label-position="itemLabelPosition"
            >
              <el-input
                v-model="formLabelAlign.changepassword"
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
