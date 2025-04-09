<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref } from 'vue'

// 下拉框数据
const selectValue = ref('')
const selectOptions = ref([
  {
    value: '歌剧',
    label: '歌剧'
  },
  {
    value: '戏曲',
    label: '戏曲'
  }
])

// 模拟表格数据
const tableData = ref([
  {
    itemName: '粤剧',
    date: '明朝',
    introduce:
      '粤剧是流行于广东、广西及港澳地区的重要传统戏剧形式，‌常被称为“广府戏”或“广东大戏”。',
    itemImg: ''
    // itemImg: new URL('@/assets/itemImg.jpg', import.meta.url).href
  },
  {
    itemName: '粤剧',
    date: '明朝',
    introduce:
      '粤剧是流行于广东、广西及港澳地区的重要传统戏剧形式，‌常被称为“广府戏”或“广东大戏”。',
    itemImg: ''
  },
  {
    itemName: '粤剧',
    date: '明朝',
    introduce:
      '粤剧是流行于广东、广西及港澳地区的重要传统戏剧形式，‌常被称为“广府戏”或“广东大戏”。',
    itemImg: ''
  },
  {
    itemName: '粤剧',
    date: '明朝',
    introduce:
      '粤剧是流行于广东、广西及港澳地区的重要传统戏剧形式，‌常被称为“广府戏”或“广东大戏”。',
    itemImg: ''
  },
  {
    itemName: '粤剧',
    date: '明朝',
    introduce:
      '粤剧是流行于广东、广西及港澳地区的重要传统戏剧形式，‌常被称为“广府戏”或“广东大戏”。',
    itemImg: ''
  }
])
</script>

<template>
  <div class="container">
    <!-- 顶部面包屑 -->
    <div class="tab">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/heritage' }">
          非遗展示
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/heri_category' }">
          全部分类
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 选择框及标题 -->
    <div class="select-title">
      <el-select v-model="selectValue" placeholder="请选择分类" size="medium">
        <el-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span class="title">戏曲歌剧</span>
    </div>
    <!-- 主体表格 -->
    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="itemName" label="项目名称" width="130" />
        <el-table-column prop="date" label="项目时代" width="130" />
        <el-table-column
          prop="introduce"
          label="项目简介"
          width=""
          show-overflow-tooltip
        />
        <el-table-column prop="itemImg" label="项目照片" width="170" />
        <el-table-column width="80">转发</el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="50" />
    </div>
  </div>
</template>

<style scope lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: #88393c;

  .tab {
    width: 100%;
    height: 8vh;
    position: relative;
    background-color: rgba(0, 0, 0, 0.15);

    .el-breadcrumb {
      margin: 3vh 5vw;
      font-size: larger;
      z-index: 10;

      .el-breadcrumb__inner.is-link {
        color: #ddcbcb;
      }
    }
  }

  .select-title {
    width: 100%;
    height: 8vh;

    .el-select {
      width: 13vw;
      font-size: 5px;
      margin: 2vh 5vw;
      border-radius: 5px;
      background-color: #d8cfd0;
    }

    .title {
      color: #d8cfd0;
      margin-left: 25vw;
      font-size: 3vh;
      font-weight: 600;
    }
  }

  .table {
    width: 90%;
    height: 40vh;
    border-radius: 5px;
    // background-color: #d8cfd0;

    .el-table {
      padding: 0 5px;
      border-radius: 5px;

      .el-table__row {
        height: 65px;
      }

      .el-table-column {
        height: 6vh;
      }
    }
  }

  .pagination {
    width: 11%;

    .el-pagination {
      font-size: larger;
      z-index: 10;
    }
  }
}
</style>
