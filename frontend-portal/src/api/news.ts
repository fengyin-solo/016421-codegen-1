import { request } from './request'
import type { ApiResponse, PageParams, PageResult, NewsItem } from '@/types'

export const newsApi = {
  // 获取新闻列表
  getList(params: PageParams): Promise<ApiResponse<PageResult<NewsItem>>> {
    return request.get('/news/list', { params })
  },

  // 获取新闻详情
  getDetail(id: number): Promise<ApiResponse<NewsItem>> {
    return request.get(`/news/${id}`)
  },

  // 获取推荐新闻
  getRecommend(limit = 5): Promise<ApiResponse<NewsItem[]>> {
    return request.get('/news/recommend', { params: { limit } })
  }
}
