<template>
  <main class="relative h-screen bg-background text-foreground overflow-hidden">
    <div class="grid-bg" aria-hidden="true" />
    <ScrollArea class="h-full">
      <router-view />
    </ScrollArea>

    <Button
      class="fixed right-6 bottom-6 z-50 flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-110"
      @click="cycleTheme">
      <component :is="currentThemeIcon" :key="appearance" class="h-5 w-5 animate-in zoom-in duration-300" />
    </Button>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { useAppearance } from '@/composables/useAppearance'

const themeOrder = ['light', 'dark', 'system'] as const

const { appearance, updateAppearance } = useAppearance()

const currentThemeIcon = computed(() => {
  const iconMap: Record<string, typeof Sun> = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  }
  return iconMap[appearance.value] || Monitor
})

function cycleTheme(): void {
  const currentIndex = themeOrder.indexOf(appearance.value)
  const nextIndex = (currentIndex + 1) % themeOrder.length
  updateAppearance(themeOrder[nextIndex])
}
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
