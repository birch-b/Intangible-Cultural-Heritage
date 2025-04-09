<template>
  <el-card class="box-card">
    <div class="info-grid">
      <div class="info-column">
        <div class="info-row">
          <span class="info-label">账号：</span>
          <span>{{ userInfo.account }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">姓名：</span>
          <span>{{ userInfo.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">角色：</span>
          <el-tag effect="light">{{ userInfo.role }}</el-tag>
        </div>
      </div>
      <div class="info-column">
        <div class="info-row">
          <span class="info-label">电话号码：</span>
          <span>{{ userInfo.phone }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">创建时间：</span>
          <span>{{ userInfo.createTime }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">最后登录：</span>
          <span>{{ userInfo.lastLogin }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
// 接收userInfo作为props
defineProps({
  userInfo: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.box-card {
  margin-top: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 16px;
}

.info-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
}

.info-label {
  width: 6rem;
  color: #4b5563;
}
</style>
