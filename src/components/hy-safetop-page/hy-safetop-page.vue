<script lang="ts" setup>
import { safeAreaInsets } from '@/utils/systemInfo'
</script>

<template>
  <view class="ty-safetop-page flex flex-col" :style="{ marginTop: `${safeAreaInsets?.top}px` }">
    <slot />
  </view>
</template>
