<template>
  <HoverCard
    :open-delay="100"
    :close-delay="50"
  >
    <HoverCardTrigger as-child>
      <button
        class="inline-flex items-center justify-center w-4 h-4 rounded-full border border-border text-muted-foreground hover:border-foreground/40 hover:bg-muted transition-colors"
      >
        <HelpCircle class="w-2.5 h-2.5" />
      </button>
    </HoverCardTrigger>
    <HoverCardContent
      class="w-56 p-4"
      side="top"
      align="start"
    >
      <div class="flex flex-col gap-2">
        <div class="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
          <component
            :is="icon"
            class="w-3.5 h-3.5 text-muted-foreground"
          />
        </div>
        <p class="text-xs font-medium leading-none">
          {{ title }}
        </p>
        <p class="text-xs text-muted-foreground leading-relaxed">
          {{ description }}
        </p>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { HelpCircle } from 'lucide-vue-next'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'

defineProps<{
  icon: Component
  title: string
  description: string
}>()
</script>
