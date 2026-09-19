import type {
  CommentCreateParams,
  CommentError,
  CommentErrorCode,
  CommentItem,
  CommentTargetType
} from '@/types'
import { validateCommentInput } from '@/utils/comment'

/**
 * 门户网站为纯前端项目，暂无后端服务。
 * 评论数据通过 localStorage 持久化，并模拟网络请求延迟/失败，
 * 后续接入真实后端时仅需将本文件替换为 request.get/post/delete 调用，
 * stores/comments.ts 与组件层无需改动。
 */
const STORAGE_KEY = 'portal_comments'
const VISITOR_KEY = 'portal_visitor_id'
const NICKNAME_KEY = 'portal_comment_nickname'

// 模拟接口耗时
const MOCK_LATENCY = 300
// 模拟偶发提交失败（约 10%），用于演示“提交失败可重试且保留内容”
const MOCK_FAILURE_RATE = 0.1

// ==================== 访客身份 ====================
export const getVisitorId = (): string => {
  let visitorId = localStorage.getItem(VISITOR_KEY)
  if (!visitorId) {
    visitorId = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(VISITOR_KEY, visitorId)
  }
  return visitorId
}

export const getLastNickname = (): string => {
  return localStorage.getItem(NICKNAME_KEY) || ''
}

export const saveLastNickname = (nickname: string): void => {
  localStorage.setItem(NICKNAME_KEY, nickname)
}

// ==================== 存储读写 ====================
const readAll = (): CommentItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CommentItem[]) : []
  } catch {
    return []
  }
}

const writeAll = (comments: CommentItem[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
}

// ==================== 工具函数 ====================
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const buildCommentError = (
  code: CommentErrorCode,
  message: string
): CommentError => {
  const error = new Error(message) as CommentError
  error.code = code
  error.name = 'CommentError'
  return error
}

const generateId = (): string => {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

// ==================== 评论接口 ====================
export const commentsApi = {
  // 获取某篇内容下的全部评论（按时间倒序）
  async getList(targetType: CommentTargetType, targetId: number): Promise<CommentItem[]> {
    await delay(MOCK_LATENCY)
    if (!navigator.onLine) {
      throw buildCommentError('NETWORK_ERROR', '网络连接不可用，请检查网络后重试')
    }

    return readAll()
      .filter((item) => item.targetType === targetType && item.targetId === targetId)
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
  },

  // 发表评论
  async create(params: CommentCreateParams): Promise<CommentItem> {
    // 先做表单校验
    const validation = validateCommentInput(params.nickname, params.content)
    if (!validation.valid && validation.code && validation.message) {
      throw buildCommentError(validation.code, validation.message)
    }

    const nickname = params.nickname.trim()
    const content = params.content.trim()

    // 与自己在同一篇内容下已发表的评论完全重复时拦截
    const duplicated = readAll().some(
      (item) =>
        item.targetType === params.targetType &&
        item.targetId === params.targetId &&
        item.nickname === nickname &&
        item.content === content
    )
    if (duplicated) {
      throw buildCommentError(
        'DUPLICATE_CONTENT',
        '评论内容与您刚发表过的内容完全相同，请勿重复发布'
      )
    }

    // 模拟网络请求
    await delay(MOCK_LATENCY)
    if (!navigator.onLine) {
      throw buildCommentError('NETWORK_ERROR', '网络连接不可用，请检查网络后重试')
    }
    if (Math.random() < MOCK_FAILURE_RATE) {
      throw buildCommentError(
        'NETWORK_ERROR',
        '评论提交失败，可能是网络波动，请稍后重试（已保留您填写的内容）'
      )
    }

    const comment: CommentItem = {
      id: generateId(),
      targetType: params.targetType,
      targetId: params.targetId,
      nickname,
      content,
      createTime: new Date().toISOString(),
      visitorId: getVisitorId()
    }

    const comments = readAll()
    comments.push(comment)
    writeAll(comments)
    saveLastNickname(nickname)

    return comment
  },

  // 删除自己的评论
  async remove(commentId: string): Promise<void> {
    await delay(MOCK_LATENCY)
    if (!navigator.onLine) {
      throw buildCommentError('NETWORK_ERROR', '网络连接不可用，请检查网络后重试')
    }

    const comments = readAll()
    const target = comments.find((item) => item.id === commentId)
    if (!target) return
    if (target.visitorId !== getVisitorId()) {
      throw buildCommentError('NETWORK_ERROR', '只能删除自己发表的评论')
    }

    writeAll(comments.filter((item) => item.id !== commentId))
  },

  // 读取全部评论（列表页同步条数用，本地读取不走网络）
  getAllSync(): CommentItem[] {
    return readAll()
  }
}
