import { getHeritagePageAPI } from './heritage'
import { getMediaPageAPI } from './heritageMedia'

/**
 * 获取“非遗视听”板块的非遗项目列表
 * 限制返回 6 条数据用于首页展示
 */
export const getProjectList = () => {
  return getHeritagePageAPI({
    current: 1,
    size: 6,
    status: 2 // 2=已发布
  })
}

/**
 * 获取指定项目的资源列表
 * @param {string|number} projectId 项目ID
 */
export const getProjectResources = (projectId) => {
  return getMediaPageAPI({
    current: 1,
    size: 100, // 获取较多资源
    itemId: projectId
  })
}

/**
 * 获取“媒体关注”列表
 * sourceType: 1
 */
export const getNewsList = () => {
  return getMediaPageAPI({
    current: 1,
    size: 6,
    sourceType: 1
  })
}

/**
 * 获取“文化讲堂”列表
 * sourceType: 2
 */
export const getLectureList = () => {
  return getMediaPageAPI({
    current: 1,
    size: 6,
    sourceType: 2
  })
}
