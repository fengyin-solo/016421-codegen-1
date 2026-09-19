import type { CommentErrorCode } from '@/types'

// ==================== 评论校验规则 ====================
export const NICKNAME_MAX_LENGTH = 20
export const CONTENT_MIN_LENGTH = 2
export const CONTENT_MAX_LENGTH = 500

export interface ValidationResult {
  valid: boolean
  code?: CommentErrorCode
  message?: string
}

// 校验昵称与内容，返回具体是哪一项不合格
export const validateCommentInput = (
  nickname: string,
  content: string
): ValidationResult => {
  const trimmedNickname = nickname.trim()
  const trimmedContent = content.trim()

  if (!trimmedNickname) {
    return {
      valid: false,
      code: 'EMPTY_NICKNAME',
      message: '昵称为空，请填写昵称后再发表'
    }
  }

  if (trimmedNickname.length > NICKNAME_MAX_LENGTH) {
    return {
      valid: false,
      code: 'NICKNAME_TOO_LONG',
      message: `昵称超出长度上限，最多 ${NICKNAME_MAX_LENGTH} 个字符`
    }
  }

  if (trimmedContent.length < CONTENT_MIN_LENGTH) {
    return {
      valid: false,
      code: 'CONTENT_TOO_SHORT',
      message: `内容太短，至少需要 ${CONTENT_MIN_LENGTH} 个字符`
    }
  }

  if (trimmedContent.length > CONTENT_MAX_LENGTH) {
    return {
      valid: false,
      code: 'CONTENT_TOO_LONG',
      message: `内容超出长度上限，最多 ${CONTENT_MAX_LENGTH} 个字符`
    }
  }

  return { valid: true }
}

// ==================== 相对时间 ====================
// now 可传入外部的响应式时间戳，便于定时自动刷新
export const formatRelativeTime = (
  time: string | number | Date,
  now: number = Date.now()
): string => {
  const target = new Date(time).getTime()
  const diff = now - target

  // 兼容客户端时间轻微倒流
  if (diff < 0) return '刚刚'

  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return '刚刚'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}分钟前`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months}个月前`

  const years = Math.floor(months / 12)
  return `${years}年前`
}
