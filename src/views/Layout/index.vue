<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { pageNotice } from '@/api/notice.js'

// 搜索框绑定值
const search_text = ref('')

const hasUnread = ref(false)
let timer = null

const checkUnread = async () => {
  try {
    const res = await pageNotice({ page: 1, pageSize: 1, readStatus: 0 })
    // console.log('Check Unread Response:', res) // Debug log
    // 兼容多种返回结构，优先判断 records 是否有数据
    if (res.data) {
      const { total, records } = res.data
      // 如果 total 大于 0，或者 records 数组非空，都视为有未读消息
      if ((total && total > 0) || (records && records.length > 0)) {
        hasUnread.value = true
      } else {
        hasUnread.value = false
      }
    } else {
      // 防御性编程：如果 res 本身就是 data (某些 request 封装会直接返回 data)
      if (
        (res.total && res.total > 0) ||
        (res.records && res.records.length > 0)
      ) {
        hasUnread.value = true
      } else {
        hasUnread.value = false
      }
    }
  } catch (e) {
    console.error('Check notice failed', e)
  }
}

onMounted(() => {
  checkUnread()
  timer = setInterval(checkUnread, 30000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div class="logo-layout">
          <h1>粤韵</h1>
        </div>
        <div class="tab-layout">
          <el-menu
            mode="horizontal"
            background-color="#852326"
            text-color="#fff"
            active-text-color="#fff"
            router
            :default-active="$route.path"
          >
            <el-menu-item index="/home">
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/heritage">
              <span>非遗展示</span>
            </el-menu-item>
            <el-menu-item index="/map">
              <span>3D虚拟展厅</span>
            </el-menu-item>
            <el-menu-item index="/activity">
              <span>活动资讯</span>
            </el-menu-item>
            <el-menu-item index="/education">
              <span>教育培训</span>
            </el-menu-item>
            <el-menu-item index="/feedback">
              <span>用户反馈</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="search-avatar">
          <div class="search-container">
            <el-input
              v-model="search_text"
              placeholder="搜索非遗文化"
              class="search-input"
            >
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </div>
          <div class="avatar" @click="$router.push('/user')">
            <el-badge :is-dot="hasUnread" class="badge-item">
              <el-icon>
                <UserFilled />
              </el-icon>
            </el-badge>
          </div>
        </div>
      </el-header>
      <!-- 二级路由展示区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 底部区域 -->
      <el-footer>
        <div class="footer-content">
          <!-- 关于我们 -->
          <div class="about-us">
            <h3>关于我们</h3>
            <p>
              广东非遗文化传承平台致力于传承和弘扬广东非物质文化遗产，连接传统和现代，推动文化创新发展。
            </p>
          </div>

          <!-- 联系方式 -->
          <div class="contact-info">
            <h3>联系方式</h3>
            <ul>
              <li>广州市海珠区仲恺路501号</li>
              <li>18948512759</li>
              <li>1660275788@qq.com</li>
            </ul>
          </div>

          <!-- 快速链接 -->
          <div class="quick-link">
            <h3>快速链接</h3>
            <ul>
              <li><a href="#">非遗名录</a></li>
              <li><a href="#">政策法规</a></li>
              <li><a href="#">学术研究</a></li>
              <li><a href="#">合作伙伴</a></li>
            </ul>
          </div>

          <!-- 关注我们 -->
          <div class="follow-us">
            <h3>关注我们</h3>
          </div>
        </div>
        <div class="footer-power">
          <span>@2025 广东非遗文化数字平台 版权所有</span>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.common-layout {
  background-color: #852326;
  width: 100vw;

  .el-header {
    position: relative;
    height: 10vh;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    --el-header-padding: 0;

    .logo-layout {
      width: 8%;
      border-radius: 50%;
      margin-left: 4%;
      margin-top: 25px;

      h1 {
        width: 4vw;
        color: rgb(90, 19, 49);
        // 花式字体
        font-family: 'Brush Script MT', cursive;
        font-size: 2vw;
      }
    }

    .tab-layout {
      width: 39%;
      overflow: hidden;
      // background-color: green;
    }

    .search-avatar {
      width: 31%;
      margin-left: 20%;
      // background-color: blue;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .search-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        font-size: 15%;
      }

      .search-input {
        :deep(.el-input__wrapper) {
          border-radius: 20px;
          padding-left: 4%;
        }
      }

      .avatar {
        width: 9.5%;
        height: 50%;
        border-radius: 50%;
        font-size: 2vw;
        text-align: center;
        border: 2px solid #484848;
        background-color: #715757;

        // 鼠标悬停效果
        :hover {
          cursor: pointer;
          color: #797070;
        }
      }
    }
  }

  .el-main {
    width: 100%;
    background-color: #a93d3d;
    box-sizing: border-box;
    --el-main-padding: 0;
  }

  .el-footer {
    height: 37vh;
    background-color: #a93d3d;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    color: #9ca3af;
    font-size: 110%;
    // padding: 0 10vw;

    .footer-content {
      width: 90%;
      height: 75%;
      // max-width: ;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      // background-color: pink;
      padding: 3% 0;
      padding-right: 12%;

      h3 {
        margin-bottom: 4%;
        color: #fff;
      }

      ul {
        line-height: 200%;
      }

      a {
        color: #9ca3af;
      }

      a:hover {
        color: #fff;
      }

      .about-us {
        width: 25%;
      }

      .contact-info {
        width: 20%;
        margin-left: -10%;
      }

      .quick-link {
        width: 10%;
        margin-left: -10%;
      }

      .follow-us {
        width: 15%;
      }
    }

    .footer-power {
      width: 90%;
      height: 24%;
      border-top: 2px solid #7d3e45;
      // background-color: #fff;
      text-align: center;
      padding: 1.5%;
    }
  }
}

.el-menu--horizontal {
  --el-menu-horizontal-height: 105%;
}
</style>
