/**
 * 格式化时间字符串
 * @param {string|Date} time - 时间字符串或Date对象
 * @param {string} format - 格式（目前仅支持默认 'YYYY-MM-DD HH:mm:ss'）
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (time) => {
  if (!time) return ''

  const date = new Date(time)
  if (isNaN(date.getTime())) return time // 如果解析失败，返回原字符串

  const pad = (n) => n.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
