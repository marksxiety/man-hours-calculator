<template>
  <div
    class="group flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-muted/30 cursor-pointer"
    @click="emit('open', project.id)"
  >
    <GripVertical
      v-if="draggable"
      class="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing shrink-0 drag-handle"
    />

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1.5 min-w-0">
        <p class="text-sm font-medium truncate leading-tight">
          {{ project.name }}
        </p>
        <Pin
          v-if="isPinned"
          class="w-3 h-3 text-primary shrink-0"
        />
      </div>
      <p class="text-xs text-muted-foreground md:hidden">
        {{ formattedDate }}
      </p>
    </div>

    <div class="hidden md:block w-24 shrink-0 text-xs tabular-nums text-muted-foreground">
      {{ formattedDate }}
    </div>
    <div class="hidden md:block w-14 shrink-0 text-center text-sm tabular-nums">
      {{ project.state.tasks.length }}
    </div>
    <div class="hidden md:block w-16 shrink-0 text-center text-sm font-bold tabular-nums text-primary">
      {{ totalExpected }}
    </div>
    <div class="hidden md:block w-14 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
      {{ targetLabel }}
    </div>
    <div class="hidden md:block w-16 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
      <template v-if="project.state.tasks.length > 0 && project.state.targetDuration !== null">
        {{ onTimeProbability }}%
      </template>
      <template v-else>
        —
      </template>
    </div>

    <div class="flex items-center justify-center gap-1 shrink-0 w-16">
      <button
        class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        :title="isPinned ? 'Unpin' : 'Pin'"
        @click.stop="emit('togglePin', project.id)"
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
        @click.stop="emit('rename', project)"
      >
        <Pencil class="w-3.5 h-3.5" />
      </button>
      <button
        class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        title="Delete"
        @click.stop="emit('delete', project)"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'
import { Pencil, X, Pin, PinOff, GripVertical } from 'lucide-vue-next'
import { useProjectStats } from '@/composables/useProjectStats'

const props = withDefaults(defineProps<{
  project: Project
  isPinned: boolean
  draggable?: boolean
}>(), {
  draggable: false,
})

const emit = defineEmits<{
  open: [id: string]
  togglePin: [id: string]
  rename: [project: Project]
  delete: [project: Project]
}>()

const { formattedDate, totalExpected, onTimeProbability } = useProjectStats(props.project)

const targetLabel = computed(() =>
  props.project.state.targetDuration === null
    ? '—'
    : `${props.project.state.targetDuration}h`,
)
</script>
