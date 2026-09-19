import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  CommentCreateParams,
  CommentItem,
  CommentTargetType
} from '@/types'
import { commentsApi, getVisitorId } from '@/api/comment'

/**
 * 评论 store：全站评论的唯一数据源。
 * - 初始化时从 localStorage 同步读取，保证刷新/返回列表后条数立即可见；
 * - 列表卡片与详情页共用同一份 comments 数据，条数天然一致；
 * - 发表/删除成功后更新内存数据，列表与详情同步刷新。
 */
export const useCommentsStore = defineStore('comments', () => {
  const comments = ref<CommentItem[]>(commentsApi.getAllSync())
  const loadingMap = ref<Record<string, boolean>>({})
  const loadedMap = ref<Record<string, boolean>>({})
  const currentVisitorId = ref(getVisitorId())

  const buildKey = (targetType: CommentTargetType, targetId: number) =>
    `${targetType}-${targetId}`

  const matchTarget = (item: CommentItem, type: CommentTargetType, id: number) =>
    item.targetType === type && item.targetId === id

  // 从本地存储重新同步（跨标签页变更时使用）
  const syncFromStorage = () => {
    comments.value = commentsApi.getAllSync()
  }

  // 某篇内容的评论条数 —— 列表卡片与详情标题均取自这里
  const countOf = (targetType: CommentTargetType, targetId: number) =>
    comments.value.filter((item) => matchTarget(item, targetType, targetId)).length

  // 某篇内容的评论（按时间倒序）
  const listOf = (targetType: CommentTargetType, targetId: number) =>
    comments.value
      .filter((item) => matchTarget(item, targetType, targetId))
      .sort(
        (a, b) =>
          new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      )

  const isLoading = (targetType: CommentTargetType, targetId: number) =>
    !!loadingMap.value[buildKey(targetType, targetId)]

  // 加载某篇内容的评论
  const fetchComments = async (
    targetType: CommentTargetType,
    targetId: number,
    force = false
  ) => {
    const key = buildKey(targetType, targetId)
    if (loadedMap.value[key] && !force) return

    loadingMap.value[key] = true
    try {
      const list = await commentsApi.getList(targetType, targetId)
      // 以接口返回为准，替换该篇内容下的评论
      const others = comments.value.filter(
        (item) => !matchTarget(item, targetType, targetId)
      )
      comments.value = [...others, ...list]
      loadedMap.value[key] = true
    } finally {
      loadingMap.value[key] = false
    }
  }

  // 发表评论，失败时向上抛出（组件负责提示与保留内容）
  const addComment = async (params: CommentCreateParams): Promise<CommentItem> => {
    const created = await commentsApi.create(params)
    comments.value = [...comments.value, created]
    return created
  }

  // 删除自己的评论
  const removeComment = async (commentId: string) => {
    await commentsApi.remove(commentId)
    comments.value = comments.value.filter((item) => item.id !== commentId)
  }

  // 判断评论是否为当前访客本人发表
  const isOwner = (comment: CommentItem) => comment.visitorId === currentVisitorId.value

  // 其他标签页中评论发生变化时同步数据
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key && event.key.startsWith('portal_')) {
        syncFromStorage()
      }
    })
  }

  return {
    comments,
    currentVisitorId,
    syncFromStorage,
    countOf,
    listOf,
    isLoading,
    fetchComments,
    addComment,
    removeComment,
    isOwner
  }
})
