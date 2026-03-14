<template>
  <main class="relative h-screen bg-background text-foreground overflow-hidden">
    <div class="grid-bg" aria-hidden="true" />
    <ScrollArea class="h-full">
      <router-view />
    </ScrollArea>
  </main>
</template>

<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'
</script>

<style scoped>
.grid-bg {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(hsl(var(--border)) 1px, transparent 1px),
    linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}
</style>