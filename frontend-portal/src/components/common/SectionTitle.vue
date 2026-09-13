<template>
  <div class="section-title">
    <h2 class="section-title__main">{{ title }}</h2>
    <p v-if="subtitle" class="section-title__sub">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<style lang="scss" scoped>
.section-title {
  text-align: center;
  margin-bottom: $spacing-xl;

  &__main {
    font-size: $font-size-xxl;
    font-weight: 600;
    color: $text-color-primary;
    margin-bottom: $spacing-sm;
  }

  &__sub {
    font-size: $font-size-sm;
    color: $text-color-secondary;
  }
}
</style>
