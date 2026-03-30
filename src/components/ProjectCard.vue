<template>
  <div
    :class="[
      'group rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer p-4',
      isPinned
        ? 'border-primary/40 bg-primary/5 hover:border-primary/50'
        : 'border-border bg-card hover:border-primary/30',
    ]"
    @click="$emit('open', project.id)"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2 min-w-0 flex-1">
        <GripVertical
          v-if="isPinned"
          class="w-4 h-4 mt-0.5 text-muted-foreground cursor-grab active:cursor-grabbing shrink-0 drag-handle"
        />
        <div class="min-w-0 flex-1">
          <h3 class="text-sm font-semibold truncate leading-tight">
            {{ project.name }}
          </h3>
          <p class="text-[11px] text-muted-foreground font-mono mt-0.5">
            {{ formattedDate }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          :title="isPinned ? 'Unpin' : 'Pin'"
          @click.stop="$emit('togglePin', project.id)"
        >
          <PinOff
            v-if="isPinned"
            class="w-3.5 h-3.5"
          />
          <Pin
            v-else
            class="w-3.5 h-3.5"
          />
        </button>
        <button
          class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Rename"
          @click.stop="$emit('rename', project)"
        >
          <Pencil class="w-3.5 h-3.5" />
        </button>
        <button
          class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Delete"
          @click.stop="$emit('delete', project)"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <div :class="['border-t border-border/50 mt-3 pt-3', isPinned && 'pl-6']">
      <div class="flex items-baseline gap-1.5 flex-wrap">
        <span class="text-xl font-bold tabular-nums font-mono text-primary">{{ totalExpected }}</span>
        <span class="text-[11px] text-muted-foreground font-mono">hrs</span>

        <span class="text-[11px] text-muted-foreground font-mono mx-1">|</span>

        <span class="text-xl font-bold tabular-nums font-mono text-foreground">{{ project.state.tasks.length }}</span>
        <span class="text-[11px] text-muted-foreground font-mono">tasks</span>

        <template v-if="project.state.targetDuration !== null">
          <span class="text-[11px] text-muted-foreground font-mono mx-1">|</span>
          <span class="text-[11px] text-muted-foreground font-mono">D: {{ project.state.targetDuration }}h</span>
        </template>
      </div>

      <p
        v-if="project.state.tasks.length > 0 && project.state.targetDuration !== null"
        class="text-[11px] text-muted-foreground font-mono mt-2"
      >
        {{ onTimeProbability }}% on-time probability
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'
import { Pencil, X, Pin, PinOff, GripVertical } from 'lucide-vue-next'
import { calculateTotalExpectedTime, calculateTotalVariance } from '@/utils/calculateTotals'
import { calculateZScore } from '@/utils/calculateZScore'
import { calculateProbability } from '@/utils/calculateProbability'

const props = defineProps<{
  project: Project
  isPinned: boolean
}>()

defineEmits<{
  open: [id: string]
  togglePin: [id: string]
  rename: [project: Project]
  delete: [project: Project]
}>()

const formattedDate = computed(() => {
  const date = new Date(props.project.updatedAt)
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const DD = String(date.getDate()).padStart(2, '0')
  const YY = String(date.getFullYear()).slice(2)
  const HH = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${MM}-${DD}-${YY} ${HH}:${mm}`
})

const totalExpected = computed(() => {
  if (props.project.state.tasks.length === 0) return '0.00'
  return calculateTotalExpectedTime(props.project.state.tasks).toFixed(2)
})

const onTimeProbability = computed(() => {
  const { tasks, targetDuration } = props.project.state
  if (tasks.length === 0 || targetDuration === null) return '0.0'
  const totalExp = calculateTotalExpectedTime(tasks)
  const totalVar = calculateTotalVariance(tasks)
  const z = calculateZScore(targetDuration, totalExp, totalVar)
  return (calculateProbability(z) * 100).toFixed(1)
})
</script>
