<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCategoryListAPI, getHeritagePageAPI } from '@/api/heritage'

const router = useRouter()
const route = useRoute()

// 顶部搜索带来的关键词（接 Layout 搜索框）
const queryTitle = ref(route.query.title || '')

// 下拉框数据
const selectValue = ref('')
const selectOptions = ref([])

// 表格数据
const tableData = ref([])
const total = ref(0)
const loading = ref(false)

// 分页参数
const pageParams = ref({
  current: 1,
  size: 10
})

// 获取类别列表
const getCategoryList = async () => {
  try {
    const res = await getCategoryListAPI()
    if (res.code === '0' || res.code === 200 || !res.code) {
      // 兼容不同返回结构
      const data = res.data || res
      selectOptions.value = data.map((item) => ({
        value: item.id,
        label: item.name
      }))
    }
  } catch (error) {
    console.error('获取类别失败', error)
  }
}

/**
 * 解析搜索关键词
 * 顶部搜索框的关键词往往是分类名（如“传统舞蹈”），而项目标题里并不含分类名，
 * 所以先按分类名匹配：命中则切换成按分类查询；没命中才按项目标题模糊查询。
 * 命中时直接返回 categoryId，避免依赖 selectValue 的赋值时序。
 */
const resolveKeyword = () => {
  const kw = (queryTitle.value || '').trim()
  if (!kw) return {}
  const hit = selectOptions.value.find((o) => o.label.includes(kw))
  if (hit) {
    selectValue.value = hit.value // 同步下拉框，让用户看到命中的分类
    return { categoryId: hit.value }
  }
  return { title: kw }
}

// 获取项目列表
const getHeritageList = async () => {
  loading.value = true
  try {
    // 必须先解析关键词：命中分类时会同步 selectValue，
    // 若放在对象字面量里展开，categoryId 会先于它求值而取到旧值。
    const keywordParam = resolveKeyword()
    const params = {
      current: pageParams.value.current,
      size: pageParams.value.size,
      categoryId: selectValue.value || undefined, // 如果为空则不传，查询所有
      status: 2, // 仅查询已发布的
      ...keywordParam
    }
    const res = await getHeritagePageAPI(params)
    if (res.code === '0' || res.code === 200 || !res.code) {
      const data = res.data || res
      tableData.value = data.records || []
      total.value = data.total || 0
    }
  } catch (error) {
    console.error('获取项目列表失败', error)
  } finally {
    loading.value = false
  }
}

// 监听筛选变化
const handleFilterChange = () => {
  // 手动选择分类后，不再受顶部搜索关键词影响
  queryTitle.value = ''
  pageParams.value.current = 1
  getHeritageList()
}

// 监听分页变化
const handlePageChange = (page) => {
  pageParams.value.current = page
  getHeritageList()
}

// 格式化时间
const formatDate = (row) => {
  if (!row.createTime) return ''
  return new Date(row.createTime).toLocaleDateString()
}

// 当前选中类别的名称
const currentCategoryName = computed(() => {
  if (!selectValue.value) return '全部项目'
  const option = selectOptions.value.find(
    (opt) => opt.value === selectValue.value
  )
  return option ? option.label : '全部项目'
})

// 跳转详情
const goToDetail = (row) => {
  router.push(`/heri_detail?id=${row.id}`)
}

onMounted(async () => {
  // 先加载分类，保证搜索关键词能匹配到分类名
  await getCategoryList()
  getHeritageList()
})

// 顶部搜索关键词变化时重新查询
watch(
  () => route.query.title,
  (newVal) => {
    queryTitle.value = newVal || ''
    pageParams.value.current = 1
    getHeritageList()
  }
)
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
        <el-table-column prop="title" label="项目名称" width="180" />
        <el-table-column prop="createTime" label="发布时间" width="130">
          <template #default="scope">
            {{ formatDate(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="summary"
          label="项目简介"
          show-overflow-tooltip
        />
        <el-table-column label="项目照片" width="170">
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
