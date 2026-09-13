<template>
  <div class="news-card" @click="handleClick">
    <div class="news-card__image">
      <el-image :src="news.coverImage" fit="cover" lazy>
        <template #placeholder>
          <div class="image-placeholder">
            <el-icon :size="32"><Picture /></el-icon>
          </div>
        </template>
        <template #error>
          <div class="image-placeholder">
            <el-icon :size="32"><Picture /></el-icon>
          </div>
        </template>
      </el-image>
    </div>
    <div class="news-card__content">
      <span class="news-card__category">{{ news.category }}</span>
      <h3 class="news-card__title">{{ news.title }}</h3>
      <p class="news-card__summary">{{ news.summary }}</p>
      <div class="news-card__meta">
        <span><el-icon><Calendar /></el-icon> {{ formatDate(news.publishTime) }}</span>
        <span><el-icon><View /></el-icon> {{ news.viewCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { NewsItem } from '@/types'

const props = defineProps<{
  news: NewsItem
}>()

const router = useRouter()

const handleClick = () => {
  router.push(`/news/${props.news.id}`)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
.news-card {
  background-color: $bg-color-white;
  border-radius: $border-radius-md;
  overflow: hidden;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;

    .news-card__title {
      color: $primary-color;
    }
  }

  &__image {
    height: 180px;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $bg-color;
      color: $text-color-placeholder;
    }
  }

  &__content {
    padding: $spacing-md;
  }

  &__category {
    display: inline-block;
    padding: 2px $spacing-sm;
    font-size: $font-size-xs;
    color: $primary-color;
    background-color: rgba($primary-color, 0.1);
    border-radius: $border-radius-sm;
    margin-bottom: $spacing-sm;
  }

  &__title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-color-primary;
    margin-bottom: $spacing-sm;
    line-height: $line-height-normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color $transition-fast;
  }

  &__summary {
    font-size: $font-size-sm;
    color: $text-color-secondary;
    line-height: $line-height-loose;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: $spacing-md;
  }

  &__meta {
    display: flex;
    gap: $spacing-md;
    font-size: $font-size-xs;
    color: $text-color-placeholder;

    span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}
</style>
