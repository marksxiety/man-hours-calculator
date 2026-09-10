<template>
  <div
    class="fixed left-4 bottom-4 z-50 select-none rounded-full border border-border/60 bg-background/80 backdrop-blur px-2.5 py-1 font-mono text-[10px] text-muted-foreground shadow-sm"
    title="App version"
  >
    v{{ APP_VERSION }}
  </div>
</template>

<script setup lang="ts">
import { APP_VERSION } from '@/utils/appVersion'
</script>