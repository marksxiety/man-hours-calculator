<template>
  <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
    <div
      class="hidden md:flex items-center gap-3 px-4 py-2.5 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground"
    >
      <div class="w-4 shrink-0" />
      <div class="flex-1 min-w-0">
        Name
      </div>
      <div class="w-24 shrink-0">
        Updated
      </div>
      <div class="w-14 text-center shrink-0">
        Tasks
      </div>
      <div class="w-16 text-center shrink-0">
        Hours
      </div>
      <div class="w-14 text-center shrink-0">
        Target
      </div>
      <div class="w-16 text-center shrink-0">
        On-time
      </div>
      <div class="w-16 shrink-0 text-center">
        Actions
      </div>
    </div>

    <VueDraggable
      v-if="draggable"
      v-model="orderedProjects"
      class="divide-y divide-border/50"
      handle=".drag-handle"
      chosen-class="project-row-chosen"
      drag-class="project-row-dragging"
      ghost-class="project-row-ghost"
      @update:model-value="onReorder"
    >
      <ProjectRow
        v-for="project in orderedProjects"
        :key="project.id"
        :project="project"
        :is-pinned="true"
        draggable
        @open="emit('open', $event)"
        @toggle-pin="emit('togglePin', $event)"
        @rename="emit('rename', $event)"
        @duplicate="emit('duplicate', $event)"
        @delete="emit('delete', $event)"
      />
    </VueDraggable>

    <div
      v-else
      class="divide-y divide-border/50"
    >
      <ProjectRow
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :is-pinned="false"
        @open="emit('open', $event)"
        @toggle-pin="emit('togglePin', $event)"
        @rename="emit('rename', $event)"
        @duplicate="emit('duplicate', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Project } from '@/types'
import { VueDraggable } from 'vue-draggable-plus'
import ProjectRow from '@/components/ProjectRow.vue'

const props = withDefaults(defineProps<{
  projects: Project[]
  draggable?: boolean
}>(), {
  draggable: false,
})

const emit = defineEmits<{
  open: [id: string]
  togglePin: [id: string]
  rename: [project: Project]
  duplicate: [project: Project]
  delete: [project: Project]
  reorder: [projects: Project[]]
}>()

const orderedProjects = ref<Project[]>([])

watch(
  () => props.projects,
  (projects) => {
    orderedProjects.value = [...projects]
  },
  { immediate: true },
)

function onReorder(newOrder: Project[]): void {
  orderedProjects.value = newOrder
  emit('reorder', newOrder)
}
</script>
