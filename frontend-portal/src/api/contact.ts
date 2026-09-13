import { request } from './request'
import type { ApiResponse, ContactForm } from '@/types'

export const contactApi = {
  // 提交联系表单
  submit(data: ContactForm): Promise<ApiResponse<null>> {
    return request.post('/contact/submit', data)
  }
}
