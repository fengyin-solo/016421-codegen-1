<template>
  <div class="news-detail-page">
    <!-- 文章头部 -->
    <header class="article-hero">
      <div class="hero-content">
        <span class="article-category">{{ newsDetail.category }}</span>
        <h1>{{ newsDetail.title }}</h1>
        <div class="article-meta">
          <span><el-icon><User /></el-icon> {{ newsDetail.author }}</span>
          <span><el-icon><Calendar /></el-icon> {{ formatDate(newsDetail.publishTime) }}</span>
          <span><el-icon><View /></el-icon> {{ newsDetail.viewCount }} 阅读</span>
        </div>
      </div>
    </header>

    <div class="detail-container">
      <!-- 返回按钮 -->
      <div class="back-nav">
        <el-button text @click="router.back()">
          <el-icon><ArrowLeft /></el-icon> 返回列表
        </el-button>
      </div>

      <div class="content-wrapper">
        <!-- 文章主体 -->
        <article class="article-main">
          <div class="article-cover">
            <img :src="newsDetail.coverImage" :alt="newsDetail.title" />
          </div>

          <div class="article-body">
            <p class="lead">{{ newsDetail.summary }}</p>
            <p>
              这是一篇关于{{ newsDetail.category }}的详细报道。在当今快速发展的时代，
              我们需要不断学习和适应新的变化。本文将从多个角度深入分析相关话题，
              为读者提供有价值的参考信息。
            </p>
            <h2>背景介绍</h2>
            <p>
              随着技术的不断进步，行业正在经历前所未有的变革。企业需要积极拥抱变化，
              才能在激烈的市场竞争中保持领先地位。我们公司一直致力于技术创新，
              为客户提供最优质的产品和服务。
            </p>
            <h2>核心观点</h2>
            <p>
              本次事件的核心在于创新与实践的结合。只有将理论与实际相结合，
              才能真正实现价值创造。我们相信，通过持续的努力和投入，
              一定能够取得更大的成就。
            </p>
            <h2>未来展望</h2>
            <p>
              展望未来，我们充满信心。在全体员工的共同努力下，
              公司将继续保持高速发展，为客户创造更多价值，
              为社会做出更大贡献。
            </p>
          </div>

          <footer class="article-footer">
            <div class="article-tags">
              <span class="tags-label">标签：</span>
              <el-tag v-for="tag in ['行业动态', '技术创新', '企业发展']" :key="tag" size="small" effect="plain">
                {{ tag }}
              </el-tag>
            </div>
            <div class="article-share">
              <span>分享：</span>
              <a @click="handleNotImplemented"><el-icon :size="18"><Share /></el-icon></a>
              <a @click="handleNotImplemented"><el-icon :size="18"><ChatDotRound /></el-icon></a>
            </div>
          </footer>
        </article>

        <!-- 侧边栏 -->
        <aside class="article-sidebar">
          <div class="sidebar-card">
            <h3>相关推荐</h3>
            <div class="related-list">
              <div 
                v-for="item in relatedNews" 
                :key="item.id" 
                class="related-item"
                @click="router.push(`/news/${item.id}`)"
              >
                <img :src="item.coverImage" :alt="item.title" />
                <div class="related-info">
                  <h4>{{ item.title }}</h4>
                  <span>{{ formatDate(item.publishTime) }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { NewsItem } from '@/types'

const router = useRouter()
const route = useRoute()

const handleNotImplemented = () => {
  ElMessage.info('功能开发中，敬请期待')
}

const newsDetail = ref<NewsItem>({
  id: 1,
  title: '公司荣获2024年度最佳创新企业奖',
  summary: '在刚刚结束的行业峰会上，我公司凭借卓越的创新能力和优质的产品服务，荣获年度最佳创新企业奖。这是对我们团队辛勤付出的最好肯定，也是对未来发展的巨大鼓励。',
  content: '',
  coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
  category: '公司新闻',
  author: '管理员',
  viewCount: 1256,
  publishTime: '2024-03-15',
  createTime: '2024-03-15',
  updateTime: '2024-03-15'
})

const relatedNews = ref<NewsItem[]>([
  {
    id: 2,
    title: '新产品发布会圆满成功',
    summary: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=150&fit=crop',
    category: '产品动态',
    author: '管理员',
    viewCount: 892,
    publishTime: '2024-03-10',
    createTime: '2024-03-10',
    updateTime: '2024-03-10'
  },
  {
    id: 3,
    title: '行业发展趋势分析报告发布',
    summary: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=200&h=150&fit=crop',
    category: '行业资讯',
    author: '管理员',
    viewCount: 654,
    publishTime: '2024-03-05',
    createTime: '2024-03-05',
    updateTime: '2024-03-05'
  },
  {
    id: 4,
    title: 'Vue 3 组合式 API 最佳实践',
    summary: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=150&fit=crop',
    category: '技术分享',
    author: '技术团队',
    viewCount: 2341,
    publishTime: '2024-03-01',
    createTime: '2024-03-01',
    updateTime: '2024-03-01'
  }
])

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  console.log('News ID:', route.params.id)
})
</script>

<style lang="scss" scoped>
.news-detail-page {
  padding-top: $header-height;
  background: $bg-color-light;
  min-height: 100vh;
}

// ==================== 文章头部 ====================
.article-hero {
  background: $bg-color-dark;
  padding: $spacing-3xl $spacing-lg;
  text-align: center;
  
  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .article-category {
    display: inline-block;
    padding: $spacing-xs $spacing-md;
    background: rgba($primary-color, 0.2);
    color: $primary-color-light;
    font-size: $font-size-sm;
    font-weight: 600;
    border-radius: $border-radius-full;
    margin-bottom: $spacing-md;
  }
  
  h1 {
    font-size: $font-size-3xl;
    color: white;
    line-height: 1.4;
    margin-bottom: $spacing-lg;
  }
  
  .article-meta {
    display: flex;
    justify-content: center;
    gap: $spacing-lg;
    font-size: $font-size-sm;
    color: rgba(255, 255, 255, 0.7);
    
    span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

// ==================== 内容区域 ====================
.detail-container {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: $spacing-xl $spacing-lg;
}

.back-nav {
  margin-bottom: $spacing-lg;
  
  .el-button {
    color: $text-color-secondary;
    
    &:hover {
      color: $primary-color;
    }
  }
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: $spacing-xl;
  align-items: start;
}

// ==================== 文章主体 ====================
.article-main {
  background: white;
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: $shadow-md;
}

.article-cover {
  width: 100%;
  height: 400px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.article-body {
  padding: $spacing-xl;
  
  .lead {
    font-size: $font-size-lg;
    color: $text-color-primary;
    font-weight: 500;
    line-height: $line-height-loose;
    margin-bottom: $spacing-xl;
    padding-bottom: $spacing-lg;
    border-bottom: 1px solid $border-color-light;
  }
  
  p {
    font-size: $font-size-md;
    color: $text-color-regular;
    line-height: 1.8;
    margin-bottom: $spacing-lg;
  }
  
  h2 {
    font-size: $font-size-xl;
    color: $text-color-primary;
    margin: $spacing-xl 0 $spacing-md;
    padding-left: $spacing-md;
    border-left: 4px solid $primary-color;
  }
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg $spacing-xl;
  background: $bg-color-light;
  border-top: 1px solid $border-color-light;
  
  .article-tags {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    .tags-label {
      font-size: $font-size-sm;
      color: $text-color-secondary;
    }
  }
  
  .article-share {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-sm;
    color: $text-color-secondary;
    
    a {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: $border-radius-md;
      color: $text-color-secondary;
      cursor: pointer;
      transition: all $transition-fast;
      
      &:hover {
        background: $primary-color;
        color: white;
      }
    }
  }
}

// ==================== 侧边栏 ====================
.article-sidebar {
  position: sticky;
  top: calc($header-height + $spacing-xl);
}

.sidebar-card {
  background: white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
  
  h3 {
    font-size: $font-size-lg;
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-sm;
    border-bottom: 2px solid $primary-color;
    display: inline-block;
  }
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.related-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-sm;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  
  &:hover {
    background: $bg-color-light;
    
    h4 {
      color: $primary-color;
    }
  }
  
  img {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: $border-radius-sm;
    flex-shrink: 0;
  }
  
  .related-info {
    flex: 1;
    min-width: 0;
    
    h4 {
      font-size: $font-size-sm;
      font-weight: 500;
      margin-bottom: $spacing-xs;
      transition: color $transition-fast;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    span {
      font-size: $font-size-xs;
      color: $text-color-secondary;
    }
  }
}

// ==================== 响应式 ====================
@media (max-width: $breakpoint-lg) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .article-sidebar {
    position: static;
  }
}

@media (max-width: $breakpoint-md) {
  .article-hero h1 {
    font-size: $font-size-xxl;
  }
  
  .article-cover {
    height: 250px;
  }
  
  .article-footer {
    flex-direction: column;
    gap: $spacing-md;
    align-items: flex-start;
  }
}
</style>
