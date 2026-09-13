import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NewsItem } from '@/types'
import { newsApi } from '@/api/news'

export const useNewsStore = defineStore('news', () => {
  const newsList = ref<NewsItem[]>([])
  const currentNews = ref<NewsItem | null>(null)
  const loading = ref(false)
  const total = ref(0)

  const fetchNewsList = async (page = 1, pageSize = 10) => {
    loading.value = true
    try {
      const res = await newsApi.getList({ page, pageSize })
      newsList.value = res.data.list
      total.value = res.data.total
    } catch (error) {
      console.error('获取新闻列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchNewsDetail = async (id: number) => {
    loading.value = true
    try {
      const res = await newsApi.getDetail(id)
      currentNews.value = res.data
    } catch (error) {
      console.error('获取新闻详情失败:', error)
    } finally {
      loading.value = false
    }
  }

  const clearCurrentNews = () => {
    currentNews.value = null
  }

  return {
    newsList,
    currentNews,
    loading,
    total,
    fetchNewsList,
    fetchNewsDetail,
    clearCurrentNews
  }
})
