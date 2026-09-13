<template>
  <div class="product-card">
    <div class="product-card__image">
      <el-image :src="product.image" fit="cover" lazy>
        <template #placeholder>
          <div class="image-placeholder">
            <el-icon :size="40"><Box /></el-icon>
          </div>
        </template>
        <template #error>
          <div class="image-placeholder">
            <el-icon :size="40"><Box /></el-icon>
          </div>
        </template>
      </el-image>
    </div>
    <div class="product-card__content">
      <h3 class="product-card__name">{{ product.name }}</h3>
      <p class="product-card__desc">{{ product.description }}</p>
      <div class="product-card__features">
        <el-tag 
          v-for="(feature, index) in product.features.slice(0, 3)" 
          :key="index"
          size="small"
          type="info"
        >
          {{ feature }}
        </el-tag>
      </div>
      <el-button type="primary" plain size="small" class="product-card__btn">
        了解更多
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductItem } from '@/types'

defineProps<{
  product: ProductItem
}>()
</script>

<style lang="scss" scoped>
.product-card {
  background-color: $bg-color-white;
  border-radius: $border-radius-md;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
  }

  &__image {
    height: 200px;
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
    padding: $spacing-lg;
  }

  &__name {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color-primary;
    margin-bottom: $spacing-sm;
  }

  &__desc {
    font-size: $font-size-sm;
    color: $text-color-secondary;
    line-height: $line-height-loose;
    margin-bottom: $spacing-md;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__features {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
    margin-bottom: $spacing-md;
  }

  &__btn {
    width: 100%;
  }
}
</style>
