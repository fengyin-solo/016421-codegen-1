import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CommentItem, CommentTargetType } from '@/types'

const STORAGE_KEY = 'portal_comments'
const VISITOR_KEY = 'portal_visitor_id'

// 评论操作的错误码，供界面区分提示文案
export const COMMENT_ERROR = {
  DUPLICATE: 'COMMENT_DUPLICATE',
  SAVE_FAILED: 'COMMENT_SAVE_FAILED'
} as const

// 生成（或读取）访客标识，用于识别"自己发表的评论"，刷新后保持不变
const initVisitorKey = (): string => {
  try {
    let key = localStorage.getItem(VISITOR_KEY)
    if (!key) {
      key = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
      localStorage.setItem(VISITOR_KEY, key)
    }
    return key
  } catch {
    return `v_temp_${Math.random().toString(36).slice(2, 10)}`
  }
}

// 首次访问时的演示评论（归属其他访客，不可删除）
const buildSeedComments = (): CommentItem[] => {
  const now = Date.now()
  return [
    {
      id: 'seed-news-1-2',
      targetType: 'news',
      targetId: 1,
      nickname: '行业观察者',
      content: '恭喜获奖！持续创新确实是企业保持领先的核心动力。',
      createTime: now - 8 * 60 * 1000,
      ownerKey: 'seed'
    },
    {
      id: 'seed-news-1-1',
      targetType: 'news',
      targetId: 1,
      nickname: '技术宅小明',
      content: '实至名归，之前合作过他们的项目，团队专业度很高。',
      createTime: now - 3 * 60 * 60 * 1000,
      ownerKey: 'seed'
    },
    {
      id: 'seed-news-2-1',
      targetType: 'news',
      targetId: 2,
      nickname: '产品经理Lily',
      content: '体验了一下新平台，流程比之前顺畅很多，期待后续迭代。',
      createTime: now - 26 * 60 * 60 * 1000,
      ownerKey: 'seed'
    },
    {
      id: 'seed-case-1-1',
      targetType: 'case',
      targetId: 1,
      nickname: '金融从业者',
      content: '数字化转型确实是大趋势，这个案例的数据很亮眼。',
      createTime: now - 2 * 60 * 60 * 1000,
      ownerKey: 'seed'
    },
    {
      id: 'seed-case-1-2',
      targetType: 'case',
      targetId: 1,
      nickname: '路过的架构师',
      content: '亿级并发还能保持99.99%可用性，架构设计值得学习。',
      createTime: now - 2 * 24 * 60 * 60 * 1000,
      ownerKey: 'seed'
    }
  ]
}

const loadComments = (): CommentItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (error) {
    console.error('读取评论数据失败:', error)
  }
  // 首次访问：写入演示数据
  const seeds = buildSeedComments()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds))
  } catch (error) {
    console.error('写入评论数据失败:', error)
  }
  return seeds
}

export const useCommentStore = defineStore('comment', () => {
  const visitorKey = ref(initVisitorKey())
  const comments = ref<CommentItem[]>(loadComments())

  // 持久化；失败时抛出错误，由调用方提示重试
  const persist = (list: CommentItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch (error) {
      console.error('保存评论数据失败:', error)
      throw new Error(COMMENT_ERROR.SAVE_FAILED)
    }
  }

  // 某篇内容下的评论，按时间倒序
  const getCommentsByTarget = (targetType: CommentTargetType, targetId: number): CommentItem[] => {
    return comments.value
      .filter(item => item.targetType === targetType && item.targetId === targetId)
      .sort((a, b) => b.createTime - a.createTime)
  }

  // 某篇内容下的评论条数（列表卡片与详情共用，保证一致）
  const getCommentCount = (targetType: CommentTargetType, targetId: number): number => {
    return comments.value.filter(
      item => item.targetType === targetType && item.targetId === targetId
    ).length
  }

  const isOwnComment = (comment: CommentItem): boolean => {
    return comment.ownerKey === visitorKey.value
  }

  // 发表评论：与刚发过的内容完全重复时拦截；持久化失败时回滚并抛错
  const addComment = async (
    targetType: CommentTargetType,
    targetId: number,
    nickname: string,
    content: string
  ): Promise<CommentItem> => {
    const trimmedNickname = nickname.trim()
    const trimmedContent = content.trim()

    const lastOwn = comments.value
      .filter(
        item =>
          item.targetType === targetType &&
          item.targetId === targetId &&
          item.ownerKey === visitorKey.value
      )
      .sort((a, b) => b.createTime - a.createTime)[0]

    if (lastOwn && lastOwn.nickname === trimmedNickname && lastOwn.content === trimmedContent) {
      throw new Error(COMMENT_ERROR.DUPLICATE)
    }

    // 模拟提交耗时，便于展示加载状态
    await new Promise(resolve => setTimeout(resolve, 300))

    const comment: CommentItem = {
      id: `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      targetType,
      targetId,
      nickname: trimmedNickname,
      content: trimmedContent,
      createTime: Date.now(),
      ownerKey: visitorKey.value
    }

    const next = [comment, ...comments.value]
    persist(next) // 失败会抛错，此时不更新内存状态
    comments.value = next
    return comment
  }

  // 删除评论：仅允许删除自己发表的
  const removeComment = (id: string): void => {
    const target = comments.value.find(item => item.id === id)
    if (!target || !isOwnComment(target)) {
      throw new Error(COMMENT_ERROR.SAVE_FAILED)
    }
    const next = comments.value.filter(item => item.id !== id)
    persist(next)
    comments.value = next
  }

  return {
    comments,
    visitorKey,
    getCommentsByTarget,
    getCommentCount,
    isOwnComment,
    addComment,
    removeComment
  }
})
