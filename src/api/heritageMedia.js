import http from '@/utils/request'

/**
 * 分页查询非遗多媒体资源
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页
 * @param {number} params.size - 每页条数
 * @param {number} [params.itemId] - 关联的非遗项目ID
 * @param {number} [params.mediaType] - 资源类型：1=图片 2=视频 3=音频
 * @param {number} [params.sourceType] - 资源来源类型：0=基础资源 1=媒体关注 2=文化讲堂
 * @param {string} [params.keyword] - 标题/描述搜索关键词
 */
export const getMediaPageAPI = (params) => {
  return http({
    url: '/admin/v1/heritage-media/page',
    method: 'GET',
    params
  })
}

/**
 * 新增非遗多媒体资源
 * @param {Object} data
 * @param {number} data.itemId - 关联的非遗项目ID
 * @param {number} data.mediaType - 资源类型：1=图片 2=视频 3=音频
 * @param {string} data.url - 资源地址
 * @param {number} data.isMain - 是否主图：0=否 1=是
 * @param {number} data.sourceType - 资源来源类型：0=基础资源 1=媒体关注 2=文化讲堂
 * @param {string} [data.title] - 标题
 * @param {string} [data.description] - 描述
 */
export const addMediaAPI = (data) => {
  return http({
    url: '/admin/v1/heritage-media',
    method: 'POST',
    data
  })
}

/**
 * 修改非遗多媒体资源
 * @param {Object} data
 * @param {number} data.id - 资源ID (必填)
 * @param {number} [data.itemId] - 关联的非遗项目ID
 * @param {number} [data.mediaType] - 资源类型：1=图片 2=视频 3=音频
 * @param {string} [data.url] - 资源地址
 * @param {number} [data.isMain] - 是否主图：0=否 1=是
 * @param {number} [data.sourceType] - 资源来源类型：0=基础资源 1=媒体关注 2=文化讲堂
 * @param {string} [data.title] - 标题
 * @param {string} [data.description] - 描述
 */
export const updateMediaAPI = (data) => {
  return http({
    url: '/admin/v1/heritage-media',
    method: 'PUT',
    data
  })
}

/**
 * 删除非遗多媒体资源
 * @param {number} id - 资源ID
 */
export const deleteMediaAPI = (id) => {
  return http({
    url: `/admin/v1/heritage-media/${id}`,
    method: 'DELETE'
  })
}
