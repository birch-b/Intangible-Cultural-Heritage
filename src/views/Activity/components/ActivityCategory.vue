<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { pageActivity } from '@/api/heritageActivity'
import { ACTIVITY_TYPES } from '@/constants/activityType'

const router = useRouter()

// 下拉框数据（活动分类为后端固定枚举，统一维护于 src/constants/activityType.js）
const selectValue = ref('')
const selectOptions = ref(ACTIVITY_TYPES)

// 表格数据
const tableData = ref([])
const total = ref(0)
const loading = ref(false)

// 分页参数
const pageParams = ref({
  current: 1,
  size: 10
})

// 获取活动列表
const getActivityList = async () => {
  loading.value = true
  try {
    const params = {
      current: pageParams.value.current,
      size: pageParams.value.size,
      type: selectValue.value || undefined, // 如果为空则不传，查询所有
      status: 1 // 仅查询已发布的 (后端状态：1已发布)
    }
    const res = await pageActivity(params)
    if (res.code === '0' || res.code === 200 || !res.code) {
      const data = res.data || res
      tableData.value = data.records || []
      total.value = data.total || 0
    }
  } catch (error) {
    console.error('获取活动列表失败', error)
  } finally {
    loading.value = false
  }
}

// 监听筛选变化
const handleFilterChange = () => {
  pageParams.value.current = 1
  getActivityList()
}

// 监听分页变化
const handlePageChange = (page) => {
  pageParams.value.current = page
  getActivityList()
}

// 当前选中类别的名称
const currentCategoryName = computed(() => {
  if (!selectValue.value) return '全部活动'
  const option = selectOptions.value.find(
    (opt) => opt.value === selectValue.value
  )
  return option ? option.label : '全部活动'
})

// 跳转详情
const goToDetail = (row) => {
  router.push(`/act_detail?id=${row.id}`)
}

onMounted(() => {
  getActivityList()
})
</script>

<template>
  <div class="container">
    <!-- 顶部面包屑 -->
    <div class="tab">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/activity' }">
          活动资讯
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/act_category' }">
          全部活动
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 选择框及标题 -->
    <div class="select-title">
      <el-select
        v-model="selectValue"
        placeholder="请选择分类"
        size="large"
        clearable
        @change="handleFilterChange"
      >
        <el-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span class="title">{{ currentCategoryName }}</span>
    </div>
    <!-- 主体表格 -->
    <div class="table">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        @row-click="goToDetail"
      >
        <el-table-column
          prop="title"
          label="活动名称"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="activityTime"
          label="活动时间"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="location"
          label="活动地点"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="description"
          label="活动摘要"
          show-overflow-tooltip
        />
        <el-table-column label="封面图" width="170">
          <template #default="scope">
            <el-image
              v-if="scope.row.coverImage"
              style="width: 100px; height: 60px"
              :src="scope.row.coverImage"
              fit="cover"
              preview-teleported
              :preview-src-list="[scope.row.coverImage]"
              @click.stop
            />
          </template>
        </el-table-column>
        <el-table-column width="80" label="操作">
          <template #default="scope">
            <el-button link type="primary" @click.stop="goToDetail(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="pageParams.current"
        :page-size="pageParams.size"
        @current-change="handlePageChange"
      />
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
  background-color: #88393c; // 调整背景色以匹配活动页面风格，原为 #88393c (红色系)

  .tab {
    width: 100%;
    height: 8vh;
    position: relative;
    background-color: rgba(0, 0, 0, 0.05);

    .el-breadcrumb {
      margin: 3vh 5vw;
      font-size: larger;
      z-index: 10;

      .el-breadcrumb__inner.is-link {
        color: #ddcbcb; // 调整文字颜色
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
      // background-color: #fff;
    }

    .title {
      color: #333;
      margin-left: 25vw;
      font-size: 3vh;
      font-weight: 600;
    }
  }

  .table {
    width: 90%;
    height: 60vh; // 增加高度
    border-radius: 5px;

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
    width: 100%; // 居中
    display: flex;
    justify-content: center;
    margin-bottom: 5vh;

    .el-pagination {
      font-size: larger;
      z-index: 10;
    }
  }
}
</style>
