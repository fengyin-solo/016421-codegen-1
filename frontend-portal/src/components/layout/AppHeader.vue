<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <div class="header-container">
      <div class="logo" @click="router.push('/')">
        <div class="logo-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#logo-gradient)"/>
            <path d="M10 16L14 12L18 16L22 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 20L14 16L18 20L22 16" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
            <defs>
              <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                <stop stop-color="#6366f1"/>
                <stop offset="1" stop-color="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="logo-text">Portal</span>
      </div>
      
      <nav class="nav-menu hidden-mobile">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.name }}
        </router-link>
      </nav>

      <div class="header-actions">
        <el-button class="contact-btn" type="primary" round @click="router.push('/contact')">
          开始咨询
          <el-icon class="btn-arrow"><Right /></el-icon>
        </el-button>
        <div class="mobile-menu-btn hidden-desktop" @click="toggleMobileMenu">
          <span :class="{ open: mobileMenuVisible }"></span>
        </div>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <transition name="slide-fade">
      <div v-if="mobileMenuVisible" class="mobile-menu hidden-desktop">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="mobile-nav-item"
          @click="mobileMenuVisible = false"
        >
          {{ item.name }}
          <el-icon><Right /></el-icon>
        </router-link>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { NavItem } from '@/types'

const router = useRouter()
const route = useRoute()

const mobileMenuVisible = ref(false)
const isScrolled = ref(false)

const navItems: NavItem[] = [
  { name: '首页', path: '/' },
  { name: '关于我们', path: '/about' },
  { name: '新闻动态', path: '/news' },
  { name: '产品服务', path: '/products' },
  { name: '服务案例', path: '/cases' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all $transition-normal;
  
  &.scrolled {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 $spacing-lg;
  height: $header-height;
}

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  cursor: pointer;
  
  &-text {
    font-size: $font-size-xl;
    font-weight: 700;
    background: $gradient-text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.nav-menu {
  display: flex;
  gap: $spacing-xs;
}

.nav-item {
  position: relative;
  padding: $spacing-sm $spacing-md;
  font-size: $font-size-sm;
  font-weight: 500;
  color: $text-color-regular;
  border-radius: $border-radius-full;
  transition: all $transition-fast;

  &:hover {
    color: $text-color-primary;
    background: $bg-color-light;
  }

  &.active {
    color: $primary-color;
    background: rgba($primary-color, 0.1);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.contact-btn {
  background: $gradient-primary;
  border: none;
  font-weight: 600;
  
  .btn-arrow {
    margin-left: 4px;
    transition: transform $transition-fast;
  }
  
  &:hover .btn-arrow {
    transform: translateX(4px);
  }
}

.mobile-menu-btn {
  width: 24px;
  height: 20px;
  position: relative;
  cursor: pointer;
  
  span,
  span::before,
  span::after {
    position: absolute;
    width: 100%;
    height: 2px;
    background: $text-color-primary;
    border-radius: 2px;
    transition: all $transition-fast;
  }
  
  span {
    top: 50%;
    transform: translateY(-50%);
    
    &::before {
      content: '';
      top: -7px;
    }
    
    &::after {
      content: '';
      top: 7px;
    }
    
    &.open {
      background: transparent;
      
      &::before {
        top: 0;
        transform: rotate(45deg);
      }
      
      &::after {
        top: 0;
        transform: rotate(-45deg);
      }
    }
  }
}

.mobile-menu {
  position: absolute;
  top: $header-height;
  left: 0;
  right: 0;
  background: $bg-color-white;
  border-bottom: 1px solid $border-color-light;
  padding: $spacing-md;
  box-shadow: $shadow-lg;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-color-primary;
  border-radius: $border-radius-md;
  
  &:hover {
    background: $bg-color-light;
    color: $primary-color;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all $transition-normal;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
