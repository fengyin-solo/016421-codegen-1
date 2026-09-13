<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="hero-gradient"></div>
        <div class="hero-grid"></div>
        <div class="hero-glow"></div>
      </div>
      
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>全新升级 · 更强大的数字化解决方案</span>
        </div>
        
        <h1 class="hero-title">
          构建未来
          <span class="gradient-text">数字体验</span>
        </h1>
        
        <p class="hero-desc">
          我们专注于企业数字化转型，提供从战略规划到技术落地的全方位服务，
          助力企业在数字时代保持领先优势。
        </p>
        
        <div class="hero-actions">
          <el-button class="btn-primary-lg" size="large" round @click="router.push('/contact')">
            免费咨询
            <el-icon><Right /></el-icon>
          </el-button>
          <el-button class="btn-secondary-lg" size="large" round @click="router.push('/products')">
            了解服务
          </el-button>
        </div>
        
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">500+</span>
            <span class="stat-label">服务客户</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">98%</span>
            <span class="stat-label">客户满意度</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">7×24</span>
            <span class="stat-label">技术支持</span>
          </div>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="visual-main">
          <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=400&fit=crop" alt="团队协作" class="visual-image" />
        </div>
        <div class="visual-card card-1">
          <div class="card-icon"><el-icon :size="24"><TrendCharts /></el-icon></div>
          <div class="card-info">
            <span class="card-label">业务增长</span>
            <span class="card-value">+127%</span>
          </div>
        </div>
        <div class="visual-card card-2">
          <div class="card-icon"><el-icon :size="24"><User /></el-icon></div>
          <div class="card-info">
            <span class="card-label">活跃用户</span>
            <span class="card-value">2.4M</span>
          </div>
        </div>
        <div class="visual-card card-3">
          <div class="card-icon"><el-icon :size="24"><Checked /></el-icon></div>
          <div class="card-info">
            <span class="card-label">项目完成</span>
            <span class="card-value">1,200+</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 品牌展示 -->
    <section class="brands-section">
      <p class="brands-label">受到行业领先企业的信赖</p>
      <div class="brands-grid">
        <div v-for="i in 6" :key="i" class="brand-item">
          <svg width="120" height="40" viewBox="0 0 120 40">
            <rect x="10" y="12" width="100" height="16" rx="4" fill="#e2e8f0"/>
            <text x="60" y="24" text-anchor="middle" fill="#94a3b8" font-size="12" font-weight="600">BRAND {{ i }}</text>
          </svg>
        </div>
      </div>
    </section>

    <!-- 服务特色 -->
    <section class="features-section">
      <div class="section-header">
        <span class="section-header__badge">
          <el-icon><Star /></el-icon> 核心优势
        </span>
        <h2 class="section-header__title">为什么选择我们</h2>
        <p class="section-header__desc">
          我们提供端到端的数字化解决方案，从战略咨询到技术实施，全程陪伴您的数字化转型之旅
        </p>
      </div>
      
      <div class="features-grid">
        <div v-for="(feature, index) in features" :key="index" class="feature-card">
          <div class="feature-icon" :style="{ background: feature.gradient }">
            <span class="icon-emoji">{{ feature.icon }}</span>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <a class="feature-link" @click="handleNotImplemented">
            了解更多 <el-icon><Right /></el-icon>
          </a>
        </div>
      </div>
    </section>

    <!-- 产品服务 -->
    <section class="products-section">
      <div class="section-header">
        <span class="section-header__badge">
          <el-icon><Box /></el-icon> 产品服务
        </span>
        <h2 class="section-header__title">全方位数字化解决方案</h2>
        <p class="section-header__desc">
          覆盖企业数字化转型的各个环节，提供定制化的产品与服务
        </p>
      </div>
      
      <div class="products-grid">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="product-card"
          @click="router.push('/products')"
        >
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
            <div class="product-overlay">
              <el-button type="primary" round>查看详情</el-button>
            </div>
          </div>
          <div class="product-content">
            <span class="product-category">{{ product.category }}</span>
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <div class="product-tags">
              <el-tag v-for="tag in product.features.slice(0, 3)" :key="tag" size="small" effect="plain">
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 新闻动态 -->
    <section class="news-section">
      <div class="news-header">
        <div>
          <span class="section-header__badge">
            <el-icon><Document /></el-icon> 新闻动态
          </span>
          <h2>最新资讯</h2>
        </div>
        <el-button class="view-all-btn" text @click="router.push('/news')">
          查看全部 <el-icon><Right /></el-icon>
        </el-button>
      </div>
      
      <div class="news-grid">
        <div 
          v-for="news in latestNews" 
          :key="news.id" 
          class="news-card"
          @click="router.push(`/news/${news.id}`)"
        >
          <div class="news-image">
            <img :src="news.coverImage" :alt="news.title" />
          </div>
          <div class="news-content">
            <div class="news-meta">
              <span class="news-category">{{ news.category }}</span>
              <span class="news-date">{{ formatDate(news.publishTime) }}</span>
            </div>
            <h3>{{ news.title }}</h3>
            <p>{{ news.summary }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据统计 -->
    <section class="stats-section">
      <div class="stats-content">
        <h2>用数据说话</h2>
        <p>我们的成绩是客户信任的最好证明</p>
        <div class="stats-grid">
          <div v-for="stat in statsData" :key="stat.label" class="stat-card">
            <span class="stat-number">{{ stat.value }}</span>
            <span class="stat-text">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { NewsItem, ProductItem } from '@/types'

const router = useRouter()

const handleNotImplemented = () => {
  ElMessage.info('功能开发中，敬请期待')
}

const features = ref([
  {
    icon: '💻',
    title: '技术领先',
    description: '采用最新技术栈，确保系统高性能、高可用、易扩展',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
  },
  {
    icon: '🛡️',
    title: '安全可靠',
    description: '企业级安全防护，多重数据备份，保障业务稳定运行',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)'
  },
  {
    icon: '⚡',
    title: '快速交付',
    description: '敏捷开发流程，高效项目管理，确保按时高质量交付',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
  },
  {
    icon: '🎧',
    title: '专业服务',
    description: '7×24小时技术支持，专属客户经理，全程贴心服务',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)'
  }
])

const products = ref<ProductItem[]>([
  {
    id: 1,
    name: '企业官网建设',
    description: '专业的企业官网设计与开发，打造品牌数字形象',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    features: ['响应式设计', 'SEO优化', '后台管理'],
    category: '网站建设'
  },
  {
    id: 2,
    name: '电商平台开发',
    description: '全功能电商解决方案，助力线上业务快速增长',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    features: ['多端适配', '支付集成', '数据分析'],
    category: '电商服务'
  },
  {
    id: 3,
    name: '移动应用开发',
    description: '原生与跨平台应用开发，覆盖iOS和Android',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    features: ['原生开发', '跨平台', '性能优化'],
    category: '移动开发'
  }
])

const latestNews = ref<NewsItem[]>([
  {
    id: 1,
    title: '公司荣获2024年度最佳创新企业奖',
    summary: '在刚刚结束的行业峰会上，我公司凭借卓越的创新能力荣获年度最佳创新企业奖。',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
    category: '公司新闻',
    author: '管理员',
    viewCount: 1256,
    publishTime: '2024-03-15',
    createTime: '2024-03-15',
    updateTime: '2024-03-15'
  },
  {
    id: 2,
    title: '新一代数字化平台正式发布',
    summary: '我公司全新研发的数字化平台正式上线，为企业提供更强大的数字化能力。',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
    category: '产品动态',
    author: '管理员',
    viewCount: 892,
    publishTime: '2024-03-10',
    createTime: '2024-03-10',
    updateTime: '2024-03-10'
  },
  {
    id: 3,
    title: '2024数字化转型趋势报告发布',
    summary: '我公司研究院发布最新行业报告，深入解读数字化转型的未来趋势。',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop',
    category: '行业资讯',
    author: '管理员',
    viewCount: 654,
    publishTime: '2024-03-05',
    createTime: '2024-03-05',
    updateTime: '2024-03-05'
  }
])

const statsData = ref([
  { value: '500+', label: '服务客户' },
  { value: '1200+', label: '完成项目' },
  { value: '98%', label: '客户满意度' },
  { value: '50+', label: '专业团队' }
])

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style lang="scss" scoped>
.home-page {
  overflow: hidden;
}

// ==================== Hero 区域 ====================
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: calc($header-height + $spacing-3xl) $spacing-lg $spacing-4xl;
  max-width: $container-max-width;
  margin: 0 auto;
}

.hero-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  
  .hero-gradient {
    position: absolute;
    top: -50%;
    right: -20%;
    width: 80%;
    height: 150%;
    background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  }
  
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  }
  
  .hero-glow {
    position: absolute;
    top: 20%;
    left: 10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
    filter: blur(40px);
  }
}

.hero-content {
  flex: 1;
  max-width: 640px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background: rgba($primary-color, 0.1);
  border: 1px solid rgba($primary-color, 0.2);
  border-radius: $border-radius-full;
  font-size: $font-size-sm;
  color: $primary-color;
  margin-bottom: $spacing-lg;
  
  .badge-dot {
    width: 8px;
    height: 8px;
    background: $primary-color;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero-title {
  font-size: clamp(40px, 8vw, $font-size-hero);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: $spacing-lg;
  
  .gradient-text {
    display: block;
    background: $gradient-text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.hero-desc {
  font-size: $font-size-lg;
  color: $text-color-secondary;
  line-height: $line-height-loose;
  margin-bottom: $spacing-xl;
}

.hero-actions {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-3xl;
  
  .btn-primary-lg {
    background: $gradient-primary;
    border: none;
    font-weight: 600;
    padding: $spacing-md $spacing-xl;
    color: white !important;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
    }
    
    .el-icon {
      color: white;
    }
  }
  
  .btn-secondary-lg {
    background: white;
    border: 1px solid $border-color;
    color: $text-color-primary;
    font-weight: 600;
    padding: $spacing-md $spacing-xl;
    
    &:hover {
      border-color: $primary-color;
      color: $primary-color;
    }
  }
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: $spacing-xl;
  
  .stat-item {
    display: flex;
    flex-direction: column;
    
    .stat-value {
      font-size: $font-size-xxl;
      font-weight: 700;
      color: $text-color-primary;
    }
    
    .stat-label {
      font-size: $font-size-sm;
      color: $text-color-secondary;
    }
  }
  
  .stat-divider {
    width: 1px;
    height: 40px;
    background: $border-color;
  }
}

.hero-visual {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 500px;
  height: 450px;
  
  .visual-main {
    position: relative;
    width: 100%;
    height: 350px;
    border-radius: $border-radius-xl;
    overflow: hidden;
    box-shadow: $shadow-2xl;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
      z-index: 1;
    }
    
    .visual-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .visual-card {
    position: absolute;
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md $spacing-lg;
    background: white;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-xl;
    animation: float 6s ease-in-out infinite;
    
    .card-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $gradient-primary;
      border-radius: $border-radius-md;
      color: white;
    }
    
    .card-info {
      display: flex;
      flex-direction: column;
      
      .card-label {
        font-size: $font-size-xs;
        color: $text-color-secondary;
      }
      
      .card-value {
        font-size: $font-size-xl;
        font-weight: 700;
        color: $text-color-primary;
      }
    }
    
    &.card-1 {
      top: -20px;
      right: 20px;
      animation-delay: 0s;
    }
    
    &.card-2 {
      top: 50%;
      left: -60px;
      transform: translateY(-50%);
      animation-delay: 2s;
    }
    
    &.card-3 {
      bottom: 20px;
      right: 40px;
      animation-delay: 4s;
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

// ==================== 品牌展示 ====================
.brands-section {
  padding: $spacing-3xl $spacing-lg;
  background: $bg-color-light;
  text-align: center;
  
  .brands-label {
    font-size: $font-size-sm;
    color: $text-color-secondary;
    margin-bottom: $spacing-xl;
  }
  
  .brands-grid {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: $spacing-3xl;
    max-width: $container-max-width;
    margin: 0 auto;
    opacity: 0.6;
  }
}

// ==================== 服务特色 ====================
.features-section {
  padding: $spacing-4xl $spacing-lg;
  max-width: $container-max-width;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-lg;
}

.feature-card {
  padding: $spacing-xl;
  background: white;
  border: 1px solid $border-color-light;
  border-radius: $border-radius-lg;
  transition: all $transition-normal;
  
  &:hover {
    border-color: transparent;
    box-shadow: $shadow-xl;
    transform: translateY(-4px);
  }
  
  .feature-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius-md;
    color: white;
    margin-bottom: $spacing-lg;
    
    .icon-emoji {
      font-size: 28px;
    }
  }
  
  h3 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-sm;
  }
  
  p {
    font-size: $font-size-sm;
    color: $text-color-secondary;
    line-height: $line-height-loose;
    margin-bottom: $spacing-md;
  }
  
  .feature-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: $font-size-sm;
    font-weight: 600;
    color: $primary-color;
    
    .el-icon {
      transition: transform $transition-fast;
    }
    
    &:hover .el-icon {
      transform: translateX(4px);
    }
  }
}

// ==================== 产品服务 ====================
.products-section {
  padding: $spacing-4xl $spacing-lg;
  background: $bg-color-light;
  
  .section-header, .products-grid {
    max-width: $container-max-width;
    margin: 0 auto;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: $spacing-lg;
}

.product-card {
  background: white;
  border-radius: $border-radius-lg;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-normal;
  
  &:hover {
    box-shadow: $shadow-xl;
    transform: translateY(-4px);
    
    .product-overlay {
      opacity: 1;
    }
    
    .product-image img {
      transform: scale(1.05);
    }
  }
  
  .product-image {
    position: relative;
    height: 220px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform $transition-slow;
    }
    
    .product-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity $transition-normal;
    }
  }
  
  .product-content {
    padding: $spacing-lg;
    
    .product-category {
      font-size: $font-size-xs;
      font-weight: 600;
      color: $primary-color;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    h3 {
      font-size: $font-size-xl;
      margin: $spacing-sm 0;
    }
    
    p {
      font-size: $font-size-sm;
      color: $text-color-secondary;
      line-height: $line-height-loose;
      margin-bottom: $spacing-md;
    }
    
    .product-tags {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-xs;
    }
  }
}

// ==================== 新闻动态 ====================
.news-section {
  padding: $spacing-4xl $spacing-lg;
  max-width: $container-max-width;
  margin: 0 auto;
}

.news-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: $spacing-xl;
  
  h2 {
    font-size: $font-size-3xl;
    margin-top: $spacing-sm;
  }
  
  .view-all-btn {
    font-weight: 600;
    color: $primary-color;
  }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: $spacing-lg;
}

.news-card {
  background: white;
  border: 1px solid $border-color-light;
  border-radius: $border-radius-lg;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-normal;
  
  &:hover {
    border-color: transparent;
    box-shadow: $shadow-xl;
    
    .news-image img {
      transform: scale(1.05);
    }
    
    h3 {
      color: $primary-color;
    }
  }
  
  .news-image {
    height: 200px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform $transition-slow;
    }
  }
  
  .news-content {
    padding: $spacing-lg;
    
    .news-meta {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      margin-bottom: $spacing-sm;
      
      .news-category {
        font-size: $font-size-xs;
        font-weight: 600;
        color: $primary-color;
        padding: 2px $spacing-sm;
        background: rgba($primary-color, 0.1);
        border-radius: $border-radius-sm;
      }
      
      .news-date {
        font-size: $font-size-xs;
        color: $text-color-secondary;
      }
    }
    
    h3 {
      font-size: $font-size-lg;
      margin-bottom: $spacing-sm;
      transition: color $transition-fast;
    }
    
    p {
      font-size: $font-size-sm;
      color: $text-color-secondary;
      line-height: $line-height-loose;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

// ==================== 数据统计 ====================
.stats-section {
  padding: $spacing-4xl $spacing-lg;
  background: $bg-color-dark;
}

.stats-content {
  max-width: $container-max-width;
  margin: 0 auto;
  text-align: center;
  
  h2 {
    font-size: $font-size-4xl;
    color: white;
    margin-bottom: $spacing-sm;
  }
  
  > p {
    font-size: $font-size-lg;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: $spacing-3xl;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-lg;
}

.stat-card {
  padding: $spacing-xl;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: $border-radius-lg;
  
  .stat-number {
    display: block;
    font-size: $font-size-5xl;
    font-weight: 800;
    background: $gradient-text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: $spacing-sm;
  }
  
  .stat-text {
    font-size: $font-size-md;
    color: rgba(255, 255, 255, 0.6);
  }
}

// ==================== 响应式 ====================
@media (max-width: $breakpoint-lg) {
  .hero-visual {
    display: none;
  }
  
  .hero-content {
    max-width: 100%;
    text-align: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
}

@media (max-width: $breakpoint-md) {
  .hero-actions {
    flex-direction: column;
    
    .el-button {
      width: 100%;
    }
  }
  
  .hero-stats {
    flex-wrap: wrap;
    gap: $spacing-lg;
    
    .stat-divider {
      display: none;
    }
  }
  
  .news-header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-md;
  }
}
</style>
