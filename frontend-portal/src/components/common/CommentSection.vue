<template>
  <section class="comment-section">
    <!-- 标题与条数 -->
    <div class="comment-header">
      <h3 class="comment-title">
        <el-icon><ChatDotRound /></el-icon>
        评论互动
      </h3>
      <span class="comment-count">共 {{ commentList.length }} 条</span>
    </div>

    <!-- 发表评论表单 -->
    <div class="comment-form">
      <el-input
        v-model="nickname"
        class="nickname-input"
        placeholder="请输入您的昵称"
        :maxlength="NICKNAME_MAX_LENGTH"
        :class="{ 'is-error': !!nicknameError }"
        @blur="validateNickname"
        @input="nicknameError = ''"
      >
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
      <p v-if="nicknameError" class="field-error">
        <el-icon><WarningFilled /></el-icon>
        {{ nicknameError }}
      </p>

      <el-input
        v-model="content"
        type="textarea"
        :rows="4"
        resize="none"
        :maxlength="CONTENT_MAX_LENGTH * 2"
        placeholder="说点什么吧……（至少 2 个字符，最多 500 个字符）"
        :class="{ 'is-error': !!contentError }"
        @blur="validateContent"
        @input="handleContentInput"
      />
      <div class="form-bottom">
        <p v-if="contentError" class="field-error field-error--flex">
          <el-icon><WarningFilled /></el-icon>
          {{ contentError }}
        </p>
        <span
          v-else
          class="char-counter"
          :class="{ over: content.length > CONTENT_MAX_LENGTH }"
        >
          {{ content.length }}/{{ CONTENT_MAX_LENGTH }}
        </span>
        <el-button
          type="primary"
          class="submit-btn"
          :loading="submitting"
          @click="handleSubmit"
        >
          {{ submitting ? '发布中...' : '发表评论' }}
        </el-button>
      </div>

      <!-- 提交失败：可重试且保留已填内容 -->
      <transition name="fade">
        <div v-if="submitError" class="submit-error">
          <el-icon><CircleCloseFilled /></el-icon>
          <span class="submit-error__msg">{{ submitError }}</span>
          <el-button type="danger" link :disabled="submitting" @click="handleSubmit">
            点击重试
          </el-button>
        </div>
      </transition>
    </div>

    <!-- 评论列表（按时间倒序） -->
    <div v-loading="loading" class="comment-list">
      <el-empty v-if="!loading && commentList.length === 0" description="还没有评论，快来抢沙发吧～" />

      <transition-group v-else name="comment" tag="div" class="comment-items">
        <div v-for="comment in commentList" :key="comment.id" class="comment-item">
          <div class="comment-avatar" :style="{ background: avatarColor(comment.nickname) }">
            {{ comment.nickname.charAt(0).toUpperCase() }}
          </div>
          <div class="comment-body">
            <div class="comment-meta">
              <span class="comment-nickname">{{ comment.nickname }}</span>
              <el-tag v-if="isOwner(comment)" size="small" type="primary" effect="light" round>
                本人
              </el-tag>
              <span class="comment-time">{{ formatRelativeTime(comment.createTime, nowTick) }}</span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
            <div v-if="isOwner(comment)" class="comment-actions">
              <el-popconfirm
                title="确定删除这条评论吗？"
                confirm-button-text="删除"
                cancel-button-text="取消"
                :confirm-button-loading="deletingId === comment.id"
                @confirm="handleDelete(comment)"
              >
                <template #reference>
                  <el-button link type="danger" size="small" :disabled="deletingId !== ''">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { CommentError, CommentItem, CommentTargetType } from '@/types'
import { useCommentsStore } from '@/stores/comments'
import { getLastNickname } from '@/api/comment'
import {
  CONTENT_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  formatRelativeTime
} from '@/utils/comment'

const props = defineProps<{
  targetType: CommentTargetType
  targetId: number
}>()

const commentsStore = useCommentsStore()

const nickname = ref(getLastNickname())
const content = ref('')
const nicknameError = ref('')
const contentError = ref('')
const submitError = ref('')
const submitting = ref(false)
const deletingId = ref('')

// 每 30 秒刷新一次相对时间
let timer: ReturnType<typeof setInterval> | undefined
const nowTick = ref(Date.now())

const commentList = computed<CommentItem[]>(() =>
  commentsStore.listOf(props.targetType, props.targetId)
)

const loading = computed(() => commentsStore.isLoading(props.targetType, props.targetId))

const isOwner = (comment: CommentItem) => commentsStore.isOwner(comment)

// 昵称单项校验，明确提示是昵称不合格
const checkNickname = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return '昵称为空，请填写昵称后再发表'
  if (trimmed.length > NICKNAME_MAX_LENGTH) {
    return `昵称超出长度上限，最多 ${NICKNAME_MAX_LENGTH} 个字符`
  }
  return ''
}

// 内容单项校验，明确提示是内容不合格
const checkContent = (value: string): string => {
  const trimmed = value.trim()
  if (trimmed.length < 2) return '内容太短，至少需要 2 个字符'
  if (trimmed.length > CONTENT_MAX_LENGTH) {
    return `内容超出长度上限，最多 ${CONTENT_MAX_LENGTH} 个字符`
  }
  return ''
}

const validateNickname = (): boolean => {
  nicknameError.value = checkNickname(nickname.value)
  return !nicknameError.value
}

const validateContent = (): boolean => {
  contentError.value = checkContent(content.value)
  return !contentError.value
}

const handleContentInput = () => {
  contentError.value = ''
  submitError.value = ''
  if (content.value.length > CONTENT_MAX_LENGTH) {
    contentError.value = `内容超出长度上限，最多 ${CONTENT_MAX_LENGTH} 个字符`
  }
}

const loadComments = async () => {
  try {
    await commentsStore.fetchComments(props.targetType, props.targetId, true)
  } catch {
    // 读取失败不阻塞页面，本地数据仍可用于展示
    ElMessage.error('评论加载失败，请刷新页面重试')
  }
}

const handleSubmit = async () => {
  submitError.value = ''

  // 完整校验，逐项标明是昵称还是内容不合格
  nicknameError.value = checkNickname(nickname.value)
  contentError.value = checkContent(content.value)
  if (nicknameError.value || contentError.value) {
    ElMessage.warning(nicknameError.value || contentError.value)
    return
  }

  submitting.value = true
  try {
    await commentsStore.addComment({
      targetType: props.targetType,
      targetId: props.targetId,
      nickname: nickname.value.trim(),
      content: content.value.trim()
    })
    ElMessage.success('评论发表成功')
    content.value = ''
    contentError.value = ''
    nowTick.value = Date.now()
  } catch (error) {
    const commentError = error as CommentError
    if (commentError.code === 'DUPLICATE_CONTENT') {
      // 完全重复：拦住并说明原因，已填内容保留
      contentError.value = commentError.message
      ElMessage.warning(commentError.message)
    } else {
      // 提交失败：给出可重试提示，表单内容保留
      submitError.value = commentError.message || '评论提交失败，请稍后重试'
    }
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (comment: CommentItem) => {
  deletingId.value = comment.id
  try {
    await commentsStore.removeComment(comment.id)
    ElMessage.success('评论已删除')
  } catch {
    ElMessage.error('删除失败，请稍后重试')
  } finally {
    deletingId.value = ''
  }
}

// 根据昵称生成稳定的头像底色
const avatarColors = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #ec4899, #f43f5e)',
  'linear-gradient(135deg, #0ea5e9, #6366f1)',
  'linear-gradient(135deg, #10b981, #0ea5e9)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)'
]
const avatarColor = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

watch(
  () => props.targetId,
  () => {
    submitError.value = ''
    contentError.value = ''
    nicknameError.value = ''
    loadComments()
  }
)

onMounted(() => {
  loadComments()
  timer = setInterval(() => {
    nowTick.value = Date.now()
  }, 30000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.comment-section {
  background: white;
  border-radius: $border-radius-xl;
  padding: $spacing-xl;
  box-shadow: $shadow-md;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border-color-light;

  .comment-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color-primary;

    .el-icon {
      color: $primary-color;
    }
  }

  .comment-count {
    font-size: $font-size-sm;
    color: $text-color-secondary;
  }
}

// ==================== 表单 ====================
.comment-form {
  background: $bg-color-light;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-xl;

  .nickname-input {
    margin-bottom: $spacing-sm;
  }

  :deep(.el-textarea__inner) {
    border-radius: $border-radius-md;
  }

  .is-error :deep(.el-input__wrapper),
  .is-error :deep(.el-textarea__inner) {
    box-shadow: 0 0 0 1px $error-color inset;
  }
}

.field-error {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: $spacing-xs 0 0;
  font-size: $font-size-xs;
  color: $error-color;

  &--flex {
    flex: 1;
  }
}

.form-bottom {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-top: $spacing-sm;

  .char-counter {
    flex: 1;
    text-align: right;
    font-size: $font-size-xs;
    color: $text-color-secondary;

    &.over {
      color: $error-color;
      font-weight: 600;
    }
  }
}

.submit-btn {
  min-width: 112px;
  background: $gradient-primary;
  border: none;
  border-radius: $border-radius-md;
}

.submit-error {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-top: $spacing-md;
  padding: $spacing-sm $spacing-md;
  background: rgba($error-color, 0.08);
  border: 1px solid rgba($error-color, 0.25);
  border-radius: $border-radius-md;
  font-size: $font-size-sm;
  color: $error-color;

  .submit-error__msg {
    flex: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-fast;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// ==================== 列表 ====================
.comment-list {
  min-height: 80px;
}

.comment-items {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.comment-item {
  display: flex;
  gap: $spacing-md;
}

.comment-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: $border-radius-round;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: $font-size-md;
  font-weight: 600;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: 4px;

  .comment-nickname {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-color-primary;
  }

  .comment-time {
    font-size: $font-size-xs;
    color: $text-color-secondary;
  }
}

.comment-content {
  font-size: $font-size-sm;
  color: $text-color-regular;
  line-height: $line-height-loose;
  word-break: break-word;
  white-space: pre-wrap;
}

.comment-actions {
  margin-top: 2px;
}

// 列表进出动画
.comment-enter-active {
  transition: all 0.3s ease;
}

.comment-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: $breakpoint-md) {
  .comment-section {
    padding: $spacing-lg;
  }

  .form-bottom {
    flex-wrap: wrap;

    .char-counter,
    .field-error--flex {
      flex: 1 0 auto;
      width: 100%;
      text-align: left;
      order: 2;
    }

    .submit-btn {
      order: 1;
    }
  }
}
</style>
