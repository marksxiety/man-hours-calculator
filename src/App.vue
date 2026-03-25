<template>
  <Toaster
    position="top-right"
    class="z-999999"
    :toast-options="{
      style: {
        zIndex: 999999
      }
    }"
  />
  <main class="relative h-screen bg-background text-foreground overflow-hidden">
    <div
      class="grid-bg"
      aria-hidden="true"
    />
    <ScrollArea class="h-full">
      <router-view v-slot="{ Component }">
        <Transition
          name="slide-left"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </router-view>
    </ScrollArea>

    <Button
      class="fixed right-6 bottom-6 z-50 flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-110"
      @click="cycleTheme"
    >
      <component
        :is="currentThemeIcon"
        :key="appearance"
        class="h-5 w-5 animate-in zoom-in duration-300"
      />
    </Button>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { useAppearance } from '@/composables/useAppearance'
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'

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