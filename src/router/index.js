import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  //vite环境变量import.meta.env.BASE_URL 在vite,config配置中的base配置
  history: createWebHistory(import.meta.env.BASE_URL), // 路由模式
  routes: [
    // 首页架子-一级路由
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          component: () => import('@/views/Layout/components/layoutHome.vue')
        },
        {
          path: 'heritage',
          component: () => import('@/views/Heritage/index.vue')
        },

        {
          path: 'virtual',
          redirect: '/map'
        },
        {
          path: 'activity',
          component: () => import('@/views/Activity/index.vue')
        },
        {
          path: 'education',
          component: () => import('@/views/Education/index.vue')
        },
        {
          path: 'education/resource/:id',
          component: () => import('@/views/Education/ResourceDetail.vue')
        },
        {
          path: 'education/course/:id',
          component: () => import('@/views/Education/CourseDetail.vue')
        },
        {
          path: 'feedback',
          component: () => import('@/views/Feedback/index.vue')
        },
        {
          path: 'map',
          component: () => import('@/views/Map/mapPage.vue')
        }
      ]
    },

    // 登录-一级路由
    {
      path: '/login',
      component: () => import('@/views/Login/loginPage.vue')
    },

    // 忘记密码-一级路由
    {
      path: '/forgetpwd',
      component: () => import('@/views/ForgetPwd/index.vue')
    },

    // 个人主页-一级路由
    {
      path: '/user',
      component: () => import('@/views/User/index.vue'),
      children: [
        {
          path: '',
          component: () =>
            import('@/views/User/Useritems/PersonalProfile/PersonalProfile.vue')
        },
        {
          path: 'ChangePassword',
          component: () =>
            import('@/views/User/Useritems/ChangePassword/ChangePassword.vue')
        },
        {
          path: 'CollectionItems',
          component: () =>
            import('@/views/User/Useritems/CollectionItems/CollectionItems.vue')
        },
        {
          path: 'MyActivities',
          component: () =>
            import('@/views/User/Useritems/MyActivities/MyActivities.vue')
        },
        {
          path: 'MyLearning',
          component: () =>
            import('@/views/User/Useritems/MyLearning/MyLearning.vue')
        },
        {
          path: 'MessageNotification',
          component: () =>
            import(
              '@/views/User/Useritems/MessageNotification/MessageNotification.vue'
            )
        },
        {
          path: 'detail',
          component: () =>
            import('@/views/User/Useritems/MessageDetail/MessageDetail.vue')
        }
      ]
    },

    // 后台管理-一级路由
    {
      path: '/backmanage',
      component: () => import('@/views/BackManage/index.vue')
    },

    // 非遗详情-一级路由
    {
      path: '/heri_detail',
      component: () => import('@/views/Heritage/components/heritageDetail.vue')
    },

    // 非遗分类-一级路由
    {
      path: '/heri_category',
      component: () =>
        import('@/views/Heritage/components/heritageCategory.vue')
    },

    // 活动详情-一级路由
    {
      path: '/act_detail',
      component: () => import('@/views/Activity/components/ActivityDetail.vue')
    },

    // 活动分类-一级路由
    {
      path: '/act_category',
      component: () =>
        import('@/views/Activity/components/ActivityCategory.vue')
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // 需要登录的路径前缀
  const protectedPaths = ['/user', '/backmanage']

  const isProtected = protectedPaths.some((path) => to.path.startsWith(path))

  if (isProtected) {
    if (!userStore.token) {
      next('/login')
    } else {
      // 检查管理员路由权限
      if (to.path.startsWith('/backmanage')) {
        const role = userStore.userInfo?.role
        if (role != 1 && role != 2) {
          // 不是管理员，跳转到首页
          next('/')
        } else {
          next()
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
