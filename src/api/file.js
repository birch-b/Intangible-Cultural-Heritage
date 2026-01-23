import request from '@/utils/request'

// 上传文件
export const uploadFileAPI = (files, onUploadProgress) => {
  const formData = new FormData()
  // files 是一个数组
  files.forEach((file) => {
    formData.append('files', file)
  })
  return request({
    url: '/admin/v1/file/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  })
}
