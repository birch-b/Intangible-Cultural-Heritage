import request from '@/utils/request'

/**
 * 获取轮播图列表
 * @param {string} type HOME | HERITAGE
 */
export const getBannerListAPI = async (type = 'HOME') => {
  const res = await request({
    url: '/admin/v1/banner/list',
    method: 'get',
    params: { type }
  })

  let list = []

  if (Array.isArray(res)) {
    list = res
  } else if (res && Array.isArray(res.data)) {
    list = res.data
  } else if (res && Array.isArray(res.list)) {
    list = res.list
  } else if (res && typeof res.data === 'object' && res.data !== null) {
    list = [res.data]
  }

  return list.map((item) => ({
    ...item,
    sort: item.sortOrder,
    status: item.status === 1 ? '启用' : '禁用'
  }))
}

/**
 * 分页查询轮播图 (用于后台管理)
 * @param {Object} params { current, size, type }
 */
export const pageBannerAPI = async (params) => {
  const res = await request({
    url: '/admin/v1/banner/page',
    method: 'get',
    params
  })

  if (res.data && res.data.records) {
    res.data.records = res.data.records.map((item) => ({
      ...item,
      sort: item.sortOrder,
      status: item.status === 1 ? '启用' : '禁用'
    }))
  }
  return res.data || res
}

/**
 * 保存轮播图 (新增或更新)
 * @param {Object} banner 轮播图对象
 * @param {string} type HOME | HERITAGE
 */
export const saveBannerAPI = async (banner, type = 'HOME') => {
  const isUpdate = !!banner.id
  const data = {
    id: banner.id,
    imageUrl: banner.imageUrl,
    sortOrder: banner.sort,
    status: banner.status === '启用' ? 1 : 0,
    type: type
  }

  return request({
    url: '/admin/v1/banner',
    method: isUpdate ? 'put' : 'post',
    data
  })
}

/**
 * 删除轮播图
 * @param {number} id
 */
export const deleteBannerAPI = async (id) => {
  return request({
    url: `/admin/v1/banner/${id}`,
    method: 'delete'
  })
}
