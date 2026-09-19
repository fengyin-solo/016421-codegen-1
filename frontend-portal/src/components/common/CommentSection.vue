<template>
  <section class="comment-section">
    <!-- 评论区头部 -->
    <div class="comment-header">
      <h3>
        <el-icon><ChatDotRound /></el-icon>
        评论互动
        <span class="comment-count">{{ comments.length }} 条评论</span>
      </h3>
      <p class="comment-subtitle">欢迎留下您的看法，与大家一起交流讨论</p>
    </div>

    <!-- 发表评论 -->
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      class="comment-form"
      @submit.prevent
    >
      <el-form-item prop="nickname">
        <el-input
          v-model="form.nickname"
          placeholder="您的昵称"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="3"
          placeholder="写下您的评论...（5-200字）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <div class="form-footer">
        <span class="form-tip">文明发言，理性讨论</span>
        <el-button type="primary" round :loading="submitting" @click="handleSubmit">
          {{ submitting ? '提交中...' : '发表评论' }}
        </el-button>
      </div>
    </el-form>

    <!-- 评论列表 -->
    <div v-if="comments.length > 0" class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-avatar" :style="{ background: avatarColor(comment.nickname) }">
          {{ comment.nickname.charAt(0) }}
        </div>
        <div class="comment-main">
          <div class="comment-meta">
            <span class="comment-nickname">{{ comment.nickname }}</span>
            <span v-if="commentStore.isOwnComment(comment)" class="own-badge">我</span>
            <span class="comment-time">{{ formatRelativeTime(comment.createTime, now) }}</span>
            <el-button
              v-if="commentStore.isOwnComment(comment)"
              class="delete-btn"
              text
              type="danger"
              size="small"
              @click="handleDelete(comment.id)"
            >
              删除
            </el-button>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </div>
    </div>
    <div v-else class="comment-empty">
      <el-icon :size="40"><ChatLineSquare /></el-icon>
      <p>暂无评论，来抢沙发~</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useCommentStore, COMMENT_ERROR } from '@/stores/comment'
import { formatRelativeTime } from '@/utils/time'
import type { CommentTargetType, CommentForm } from '@/types'

const props = defineProps<{
  targetType: CommentTargetType
  targetId: number
}>()

const commentStore = useCommentStore()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive<CommentForm>({
  nickname: '',
  content: ''
})

// 校验规则：哪一项不合格就在对应表单项下提示
const formRules: FormRules = {
  nickname: [
    { required: true, whitespace: true, message: '请填写昵称', trigger: 'blur' },
    { max: 20, message: '昵称不能超过 20 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, whitespace: true, message: '请填写评论内容', trigger: 'blur' },
    { min: 5, message: '评论内容太短，至少输入 5 个字符', trigger: 'blur' },
    { max: 200, message: '评论内容超出长度上限，最多 200 个字符', trigger: 'blur' }
  ]
}

// 当前内容下的评论（按时间倒序）
const comments = computed(() =>
  commentStore.getCommentsByTarget(props.targetType, props.targetId)
)

// 相对时间定时刷新
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
  }, 30 * 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

// 头像颜色按昵称散列，同一昵称颜色固定
const avatarPalette = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
const avatarColor = (nickname: string) => {
  let hash = 0
  for (const ch of nickname) {
    hash = (hash * 31 + (ch.codePointAt(0) || 0)) >>> 0
  }
  return avatarPalette[hash % avatarPalette.length]
}

const handleSubmit = async () => {
  if (!formRef.value || submitting.value) return

  // 校验不通过时阻止提交，具体哪一项不合格由表单项提示
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    await commentStore.addComment(props.targetType, props.targetId, form.nickname, form.content)
    ElMessage.success('评论发表成功')
    // 发表成功：清空内容，保留昵称方便继续评论
    form.content = ''
    formRef.value.clearValidate()
  } catch (error: any) {
    if (error?.message === COMMENT_ERROR.DUPLICATE) {
      ElMessage.warning('您刚发表过完全相同的评论，请勿重复提交')
    } else {
      // 提交失败：提示可重试，已填内容保留不清空
      ElMessage.error('评论提交失败，请稍后重试')
    }
  } finally {
    submitting.value = false
  }
}

const handleDelete = (id: string) => {
  try {
    commentStore.removeComment(id)
    ElMessage.success('评论已删除')
  } catch {
    ElMessage.error('删除失败，请稍后重试')
  }
}
</script>

<style lang="scss" scoped>
.comment-section {
  background: white;
  border-radius: $border-radius-xl;
  padding: $spacing-xl;
  box-shadow: $shadow-md;
}

// ==================== 头部 ====================
.comment-header {
  margin-bottom: $spacing-lg;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border-color-light;

  h3 {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-xl;
    color: $text-color-primary;

    .el-icon {
      color: $primary-color;
    }

    .comment-count {
      font-size: $font-size-sm;
      font-weight: 500;
      color: $text-color-secondary;
      padding: 2px $spacing-sm;
      background: rgba($primary-color, 0.1);
      border-radius: $border-radius-full;
    }
  }

  .comment-subtitle {
    margin-top: $spacing-xs;
    font-size: $font-size-sm;
    color: $text-color-secondary;
  }
}

// ==================== 发表表单 ====================
.comment-form {
  margin-bottom: $spacing-xl;

  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner) {
    border-radius: $border-radius-md;
  }

  .form-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .form-tip {
      font-size: $font-size-xs;
      color: $text-color-placeholder;
    }
  }
}

// ==================== 评论列表 ====================
.comment-list {
  display: flex;
  flex-direction: column;
}

.comment-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md 0;
  border-bottom: 1px solid $border-color-light;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.comment-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-round;
  color: white;
  font-size: $font-size-md;
  font-weight: 600;
}

.comment-main {
  flex: 1;
  min-width: 0;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-xs;

  .comment-nickname {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-color-primary;
  }

  .own-badge {
    padding: 0 6px;
    font-size: $font-size-xs;
    line-height: 18px;
    color: white;
    background: $gradient-primary;
    border-radius: $border-radius-sm;
  }

  .comment-time {
    font-size: $font-size-xs;
    color: $text-color-secondary;
  }

  .delete-btn {
    margin-left: auto;
  }
}

.comment-content {
  font-size: $font-size-sm;
  color: $text-color-regular;
  line-height: $line-height-loose;
  word-break: break-word;
  white-space: pre-wrap;
}

// ==================== 空状态 ====================
.comment-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-xl 0;
  color: $text-color-placeholder;
  font-size: $font-size-sm;
}

// ==================== 响应式 ====================
@media (max-width: $breakpoint-md) {
  .comment-section {
    padding: $spacing-lg;
  }
}
</style>
