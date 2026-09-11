<template>
  <div>
    <div
      class="flex items-center gap-3 px-4 py-2.5 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground"
    >
      <div class="w-4 shrink-0" />
      <div class="w-28 shrink-0">
        Milestone
      </div>
      <div class="flex-1 min-w-0">
        Task / Description
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <div class="w-14 text-center">
          O
        </div>
        <div class="w-14 text-center">
          M
        </div>
        <div class="w-14 text-center">
          P
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0 tabular-nums">
        <div class="w-16 text-center">
          Expected
        </div>
        <div class="w-14 text-center">
          Std Dev
        </div>
        <div class="w-14 text-center">
          Variance
        </div>
      </div>
      <div class="w-16 shrink-0 text-center">
        Actions
      </div>
    </div>

    <VueDraggable
      v-model="orderedTasks"
      class="divide-y divide-border/50"
      handle=".drag-handle"
      chosen-class="task-chosen"
      drag-class="task-dragging"
      ghost-class="task-ghost"
      @update:model-value="onReorder"
    >
      <div
        v-for="(task, index) in orderedTasks"
        :key="task.taskName + index"
        class="group flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-muted/30"
      >
        <GripVertical
          class="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing shrink-0 drag-handle"
        />

        <div class="w-28 shrink-0">
          <p class="text-xs font-medium uppercase truncate">
            {{ task.milestone || '—' }}
          </p>
        </div>

        <div class="flex-1 min-w-0">
          <HoverCard
            :open-delay="100"
            :close-delay="50"
          >
            <HoverCardTrigger as-child>
              <div class="cursor-pointer space-y-0.5">
                <p class="text-sm font-medium truncate leading-tight">
                  {{ task.taskName }}
                </p>
                <p class="text-xs text-muted-foreground truncate leading-snug">
                  {{ task.description || 'No description' }}
                </p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              class="w-72 max-w-72 p-4"
              side="top"
              align="start"
            >
              <div class="space-y-2">
                <p class="text-sm font-semibold leading-tight">
                  {{ task.taskName }}
                </p>
                <Separator />
                <p class="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {{ task.description || 'No description provided' }}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <div class="w-14">
            <NumberField
              :model-value="task.optimistic"
              :min="0"
              :step="0.1"
              :format-options="task.optimistic !== null ? { minimumFractionDigits: 1 } : undefined"
              @update:model-value="emit('update', index, 'optimistic', $event)"
            >
              <NumberFieldContent>
                <NumberFieldInput class="bg-background text-center tabular-nums h-7 text-xs px-1" />
              </NumberFieldContent>
            </NumberField>
          </div>
          <div class="w-14">
            <NumberField
              :model-value="task.mostLikely"
              :min="0"
              :step="0.1"
              :format-options="task.mostLikely !== null ? { minimumFractionDigits: 1 } : undefined"
              @update:model-value="emit('update', index, 'mostLikely', $event)"
            >
              <NumberFieldContent>
                <NumberFieldInput class="bg-background text-center tabular-nums h-7 text-xs px-1" />
              </NumberFieldContent>
            </NumberField>
          </div>
          <div class="w-14">
            <NumberField
              :model-value="task.pessimistic"
              :min="0"
              :step="0.1"
              :format-options="task.pessimistic !== null ? { minimumFractionDigits: 1 } : undefined"
              @update:model-value="emit('update', index, 'pessimistic', $event)"
            >
              <NumberFieldContent>
                <NumberFieldInput class="bg-background text-center tabular-nums h-7 text-xs px-1" />
              </NumberFieldContent>
            </NumberField>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0 text-xs tabular-nums">
          <div class="w-16 text-center font-bold text-primary">
            {{ task.expectedTime.toFixed(2) }}
          </div>
          <div class="w-14 text-center">
            {{ task.standardDeviation.toFixed(3) }}
          </div>
          <div class="w-14 text-center">
            {{ task.variance.toFixed(3) }}
          </div>
        </div>

        <div class="flex items-center justify-center gap-1 shrink-0 w-16">
          <button
            class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            @click="emit('edit', index)"
          >
            <Pencil class="w-3.5 h-3.5" />
          </button>
          <button
            class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            @click="emit('delete', index)"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PERTTaskResult } from '@/types'
import { Separator } from '@/components/ui/separator'
import { NumberField, NumberFieldContent, NumberFieldInput } from '@/components/ui/number-field'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { Pencil, X, GripVertical } from 'lucide-vue-next'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps<{
  tasks: PERTTaskResult[]
}>()

const emit = defineEmits<{
  update: [index: number, field: 'optimistic' | 'mostLikely' | 'pessimistic', value: number | null]
  edit: [index: number]
  delete: [index: number]
  reorder: [tasks: PERTTaskResult[]]
}>()

const orderedTasks = ref<PERTTaskResult[]>([])

watch(
  () => props.tasks,
  (tasks) => {
    orderedTasks.value = [...tasks]
  },
  { immediate: true },
)

function onReorder(newOrder: PERTTaskResult[]): void {
  orderedTasks.value = newOrder
  emit('reorder', newOrder)
}
</script>