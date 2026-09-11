<template>
  <VueDraggable
    v-model="orderedTasks"
    class="divide-y divide-border/50"
    handle=".drag-handle-mobile"
    chosen-class="task-chosen"
    drag-class="task-dragging"
    ghost-class="task-ghost"
    @update:model-value="onReorder"
  >
    <div
      v-for="(task, index) in orderedTasks"
      :key="task.taskName + index + 'mobile'"
      class="px-4 py-3.5 transition-all duration-200 hover:bg-muted/20 active:bg-muted/30"
    >
      <div class="flex items-start gap-2.5">
        <GripVertical
          class="w-4 h-4 mt-0.5 text-muted-foreground/60 cursor-grab active:cursor-grabbing shrink-0 drag-handle-mobile"
        />
        <div class="flex-1 min-w-0">
          <div class="space-y-1.5 pb-3">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                v-if="task.milestone"
                class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-muted text-muted-foreground border border-border/60"
              >
                {{ task.milestone }}
              </span>
              <p class="text-sm font-semibold leading-tight truncate">
                {{ task.taskName }}
              </p>
            </div>
            <p
              v-if="task.description"
              class="text-xs text-muted-foreground leading-snug line-clamp-2"
            >
              {{ task.description }}
            </p>
          </div>

          <Separator class="mb-3" />

          <div class="grid grid-cols-3 gap-2 pb-3">
            <div class="flex flex-col gap-0.5">
              <span
                class="font-mono text-[10px] uppercase text-muted-foreground font-semibold"
              >Optimistic</span>
              <NumberField
                :model-value="task.optimistic"
                :min="0"
                :step="0.1"
                :format-options="task.optimistic !== null ? { minimumFractionDigits: 1 } : undefined"
                @update:model-value="emit('update', index, 'optimistic', $event)"
              >
                <NumberFieldContent>
                  <NumberFieldInput class="bg-background text-center tabular-nums text-xs h-7" />
                </NumberFieldContent>
              </NumberField>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="font-mono text-[10px] uppercase text-muted-foreground font-semibold">Most
                Likely</span>
              <NumberField
                :model-value="task.mostLikely"
                :min="0"
                :step="0.1"
                :format-options="task.mostLikely !== null ? { minimumFractionDigits: 1 } : undefined"
                @update:model-value="emit('update', index, 'mostLikely', $event)"
              >
                <NumberFieldContent>
                  <NumberFieldInput class="bg-background text-center tabular-nums text-xs h-7" />
                </NumberFieldContent>
              </NumberField>
            </div>
            <div class="flex flex-col gap-0.5">
              <span
                class="font-mono text-[10px] uppercase text-muted-foreground font-semibold"
              >Pessimistic</span>
              <NumberField
                :model-value="task.pessimistic"
                :min="0"
                :step="0.1"
                :format-options="task.pessimistic !== null ? { minimumFractionDigits: 1 } : undefined"
                @update:model-value="emit('update', index, 'pessimistic', $event)"
              >
                <NumberFieldContent>
                  <NumberFieldInput class="bg-background text-center tabular-nums text-xs h-7" />
                </NumberFieldContent>
              </NumberField>
            </div>
          </div>

          <Separator class="mb-3" />

          <div class="flex items-center gap-3">
            <div class="flex items-baseline gap-1">
              <span class="font-mono text-[9px] uppercase text-muted-foreground">Expected</span>
              <span class="text-sm font-black tabular-nums text-primary">{{ task.expectedTime.toFixed(2)
              }}</span>
              <span class="text-[10px] text-muted-foreground">hrs</span>
            </div>
            <div class="h-3 w-px bg-border/60" />
            <div class="flex items-baseline gap-1">
              <span class="font-mono text-[9px] uppercase text-muted-foreground">Variance</span>
              <span class="text-xs tabular-nums text-muted-foreground">{{ task.variance.toFixed(3)
              }}</span>
            </div>
            <div class="h-3 w-px bg-border/60" />
            <div class="flex items-baseline gap-1">
              <span class="font-mono text-[9px] uppercase text-muted-foreground">Std Dev</span>
              <span class="text-xs tabular-nums text-muted-foreground">{{
                task.standardDeviation.toFixed(3) }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-1 shrink-0">
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
    </div>
  </VueDraggable>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PERTTaskResult } from '@/types'
import { Separator } from '@/components/ui/separator'
import { NumberField, NumberFieldContent, NumberFieldInput } from '@/components/ui/number-field'
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

<style>
@media (max-width: 767px) {
  .drag-handle-mobile {
    min-width: 1.5rem;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: none;
  }
}
</style>