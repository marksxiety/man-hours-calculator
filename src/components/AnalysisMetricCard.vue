<template>
  <div :class="containerClass">
    <div :class="['font-mono text-[10px] tracking-widest uppercase', highlighted ? 'text-primary' : 'text-muted-foreground']">
      {{ label }}
    </div>
    <div :class="['tabular-nums mt-1', highlighted ? 'text-2xl font-black text-primary' : 'text-xl font-bold']">
      {{ value }}
    </div>
    <div :class="['mt-1 text-[10px] leading-tight', highlighted ? 'text-primary/70 italic' : 'text-muted-foreground']">
      {{ subtitle }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: string
  subtitle: string
  highlighted?: boolean
}>()

const containerClass = computed(() =>
  props.highlighted
    ? 'rounded-lg border border-primary/30 bg-primary/10 p-3 shadow-sm'
    : 'rounded-lg border border-border/50 bg-muted/50 p-3',
)
</script>
