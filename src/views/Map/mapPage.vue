<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHeritagePageAPI } from '@/api/heritage'

const router = useRouter()
const mapUrl = `${import.meta.env.BASE_URL}3d.html`
const iframeRef = ref(null)

const handleMessage = (event) => {
  if (event.data && event.data.action === 'navigateTo') {
    router.push(event.data.path)
  }
  if (event.data && event.data.action === 'requestHeritageData') {
    sendHeritageData()
  }
}

const sendHeritageData = async () => {
  try {
    const res = await getHeritagePageAPI({
      current: 1,
      size: 100,
      status: 2
    })

    let heritageData = {
      珠三角地区: [],
      粤东地区: [],
      粤西地区: [],
      粤北地区: []
    }

    if (res.code === '0' && res.data && res.data.records) {
      const records = res.data.records

      records.forEach((item) => {
        const region = determineRegion(item.region)
        if (region && heritageData[region]) {
          const mediaImages = (item.mediaList || [])
            .filter((m) => m.mediaType === 1)
            .map((m) => m.url)
          const secondImage =
            mediaImages.length >= 2
              ? mediaImages[1]
              : mediaImages[0] || item.coverImage

          heritageData[region].push({
            id: item.id,
            name: item.title,
            city: item.region || '',
            type: item.categoryName || '非遗项目',
            image: secondImage || '',
            description: item.summary || item.content || '暂无介绍'
          })
        }
      })
    }

    if (iframeRef.value) {
      iframeRef.value.contentWindow.postMessage(
        {
          action: 'receiveHeritageData',
          data: heritageData
        },
        '*'
      )
    }
  } catch (error) {
    console.error('获取非遗数据失败', error)
    if (iframeRef.value) {
      iframeRef.value.contentWindow.postMessage(
        {
          action: 'receiveHeritageData',
          data: null
        },
        '*'
      )
    }
  }
}

const determineRegion = (regionName) => {
  if (!regionName) return null

  const regionDefinitions = {
    'pearl-delta': {
      cities: [
        '广州市',
        '深圳市',
        '珠海市',
        '佛山市',
        '中山市',
        '东莞市',
        '惠州市',
        '江门市',
        '肇庆市'
      ],
      keywords: [
        '广州',
        '深圳',
        '珠海',
        '佛山',
        '中山',
        '东莞',
        '惠州',
        '江门',
        '肇庆',
        '珠三角',
        '珠江'
      ]
    },
    east: {
      cities: ['汕头市', '潮州市', '揭阳市', '汕尾市'],
      keywords: ['汕头', '潮州', '揭阳', '汕尾', '粤东']
    },
    west: {
      cities: ['湛江市', '茂名市', '阳江市'],
      keywords: ['湛江', '茂名', '阳江', '粤西']
    },
    north: {
      cities: ['韶关市', '清远市', '梅州市', '河源市', '云浮市'],
      keywords: ['韶关', '清远', '梅州', '河源', '云浮', '粤北', '客家']
    }
  }

  for (const key of Object.keys(regionDefinitions)) {
    const region = regionDefinitions[key]
    if (
      region.cities.some((city) => regionName.includes(city)) ||
      region.keywords.some((keyword) => regionName.includes(keyword))
    ) {
      if (key === 'pearl-delta') return '珠三角地区'
      if (key === 'east') return '粤东地区'
      if (key === 'west') return '粤西地区'
      if (key === 'north') return '粤北地区'
    }
  }

  return null
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="fullscreen-container">
    <iframe ref="iframeRef" :src="mapUrl" class="fullscreen-iframe"> </iframe>
  </div>
</template>

<style scoped lang="scss">
/* 设置容器充满整个页面 */
.fullscreen-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 隐藏滚动条 */
}

/* 设置 iframe 充满容器 */
.fullscreen-iframe {
  width: 100%;
  height: 100%;
  border: none; /* 去掉 iframe 的边框 */
  margin: 0;
  padding: 0;
}
</style>
