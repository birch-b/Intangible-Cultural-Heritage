/**
 * 非遗活动分类枚举
 * 与后端活动 type 字段（Integer 枚举）保持一致，type 值不可随意变更。
 * 活动分类由后端枚举统一定义，不提供前台增删改。
 */
export const ACTIVITY_TYPES = [
  {
    value: 1,
    label: '展示推广',
    description:
      '以展示非遗项目和成果为主的公开活动，重在视觉传播、项目亮相与作品展览。'
  },
  {
    value: 2,
    label: '表演活动',
    description: '以现场演出、技艺展示、项目汇演为核心的非遗现场活动。'
  },
  {
    value: 3,
    label: '交流融合',
    description:
      '强调交流合作、文化互访、跨领域融合等活动，促进非遗交流、创新与联动。'
  },
  {
    value: 4,
    label: '教育体验',
    description:
      '以教育普及、体验活动、青年培养为重点，促进非遗知识传播与参与。'
  },
  {
    value: 5,
    label: '市集消费',
    description: '以非遗产品展销、购物节、线上线下商业结合的活动形式。'
  },
  {
    value: 6,
    label: '学术交流',
    description: '以研讨、论坛、理念交流为核心的非遗保护发展会议或主题活动。'
  }
]

/**
 * 根据分类值获取分类名称
 * @param {number} value - 活动分类 type 值
 * @returns {string} 分类名称，未知时返回 '未知'
 */
export const getActivityTypeLabel = (value) => {
  const type = ACTIVITY_TYPES.find((t) => t.value === Number(value))
  return type ? type.label : '未知'
}
