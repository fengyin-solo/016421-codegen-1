import { request } from './request'
import type { ApiResponse, CaseItem, ConsultationForm, PageParams, PageResult } from '@/types'

export const casesApi = {
  getList(params: PageParams & { industry?: string }): Promise<ApiResponse<PageResult<CaseItem>>> {
    return request.get('/cases/list', { params })
  },

  getDetail(id: number): Promise<ApiResponse<CaseItem>> {
    return request.get(`/cases/${id}`)
  },

  submitConsultation(data: ConsultationForm): Promise<ApiResponse<null>> {
    return request.post('/cases/consultation', data)
  }
}
