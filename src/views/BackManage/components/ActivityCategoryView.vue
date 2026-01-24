<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>活动分类说明</span>
        <div class="header-actions">
          <!-- 纯展示页面，无需操作按钮 -->
        </div>
      </div>
    </template>

    <!-- 分类列表 (纯展示) -->
    <el-table :data="categoryList" stripe style="width: 100%">
      <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
      <el-table-column prop="name" label="分类名称" width="180">
        <template #default="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

// 计算表格序号
const indexMethod = (index) => {
  return index + 1
}

// 静态分类数据 (与后端 Enum 对应)
const categoryList = ref([
  {
    id: 1,
    name: '展示推广',
    description: '以展示非遗项目和成果为主的公开活动，重在视觉传播、项目亮相与作品展览。'
  },
  {
    id: 2,
    name: '表演活动',
    description: '以现场演出、技艺展示、项目汇演为核心的非遗现场活动。'
  },
  {
    id: 3,
    name: '交流融合',
    description: '强调交流合作、文化互访、跨领域融合等活动，促进非遗交流、创新与联动。'
  },
  {
    id: 4,
    name: '教育体验',
    description: '以教育普及、体验活动、青年培养为重点，促进非遗知识传播与参与。'
  },
  {
    id: 5,
    name: '市集消费',
    description: '以非遗产品展销、购物节、线上线下商业结合的活动形式。'
  },
  {
    id: 6,
    name: '学术交流',
    description: '以研讨、论坛、理念交流为核心的非遗保护发展会议或主题活动。'
  }
])
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
