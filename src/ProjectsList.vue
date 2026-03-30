<template>
  <div>
    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 w-full">
      <div class="mb-8">
        <Badge
          variant="outline"
          class="mb-5 font-mono text-xs tracking-widest uppercase"
        >
          Projects
        </Badge>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              class="-ml-2"
              @click="goToHome()"
            >
              <ChevronLeft class="w-4 h-4" />
            </Button>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
              Project Vault
            </h1>
          </div>
          <Button
            v-if="projectListStore.projects.length > 0"
            class="gap-2 font-mono"
            @click="createNewProject()"
          >
            <Plus class="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      <div
        v-if="projectListStore.projects.length === 0"
        class="flex flex-col items-center justify-center py-24 text-center"
      >
        <div class="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-5">
          <FolderOpen class="w-7 h-7 text-muted-foreground" />
        </div>
        <h2 class="text-lg font-semibold tracking-tight mb-2">
          No projects yet
        </h2>
        <p class="text-sm text-muted-foreground max-w-sm mb-6">
          Create your first man hours estimate to get started.
        </p>
        <Button
          class="gap-2 font-mono"
          @click="createNewProject()"
        >
          <Plus class="w-4 h-4" />
          Create Project
        </Button>
      </div>

      <template v-else>
        <div v-if="pinnedProjects.length > 0">
          <div class="flex items-center justify-between mb-4">
            <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground">
              Pinned
            </p>
          </div>

          <VueDraggable
            v-model="pinnedProjects"
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
            handle=".drag-handle"
            chosen-class="project-chosen"
            drag-class="project-dragging"
            ghost-class="project-ghost"
            @update:model-value="onPinnedReorder"
          >
            <ProjectCard
              v-for="project in pinnedProjects"
              :key="project.id"
              :project="project"
              :is-pinned="true"
              @open="openProject"
              @toggle-pin="handleTogglePin"
              @rename="openRenameDialog"
              @delete="openDeleteDialog"
            />
          </VueDraggable>
        </div>

        <div
          v-if="unpinnedProjects.length > 0"
          class="mt-4"
        >
          <div
            v-if="pinnedProjects.length > 0"
            class="flex items-center justify-between mb-4"
          >
            <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground">
              Other Projects
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProjectCard
              v-for="project in unpinnedProjects"
              :key="project.id"
              :project="project"
              :is-pinned="false"
              @open="openProject"
              @toggle-pin="handleTogglePin"
              @rename="openRenameDialog"
              @delete="openDeleteDialog"
            />
          </div>
        </div>
      </template>

      <Dialog v-model:open="showRenameDialog">
        <DialogContent class="flex flex-col gap-0 p-0 max-w-md w-[calc(100vw-2rem)] rounded-xl overflow-hidden">
          <DialogHeader class="px-5 pt-5 pb-4 border-b border-border shrink-0">
            <DialogTitle class="flex items-center gap-2 text-sm">
              <div class="w-7 h-7 rounded-md bg-muted text-primary flex items-center justify-center shrink-0">
                <Pencil class="w-3.5 h-3.5" />
              </div>
              Rename Project
            </DialogTitle>
            <DialogDescription class="text-xs mt-1">
              Enter a new name for this project.
            </DialogDescription>
          </DialogHeader>
          <div class="px-5 py-4">
            <Input
              v-model="renameForm.name"
              type="text"
              placeholder="Project name"
              @keyup.enter="confirmRename()"
            />
          </div>
          <div class="px-5 py-4 border-t border-border shrink-0 flex gap-2">
            <Button
              variant="outline"
              class="flex-1 font-mono text-xs"
              @click="showRenameDialog = false"
            >
              Cancel
            </Button>
            <Button
              class="flex-1 font-mono text-xs"
              :disabled="!renameForm.name.trim()"
              @click="confirmRename()"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog v-model:open="showDeleteDialog">
        <DialogContent class="flex flex-col gap-0 p-0 max-w-md w-[calc(100vw-2rem)] rounded-xl overflow-hidden">
          <DialogHeader class="px-5 pt-5 pb-4 border-b border-border shrink-0">
            <DialogTitle class="flex items-center gap-2 text-sm text-destructive">
              <div
                class="w-7 h-7 rounded-md bg-destructive/10 text-destructive flex items-center justify-center shrink-0"
              >
                <AlertTriangle class="w-3.5 h-3.5" />
              </div>
              Delete Project
            </DialogTitle>
            <DialogDescription class="text-xs mt-1">
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div class="px-5 py-4">
            <p class="text-sm">
              Are you sure you want to delete <strong class="text-foreground">{{ deleteTarget?.name }}</strong>? All
              tasks and estimates will be lost.
            </p>
          </div>
          <div class="px-5 py-4 border-t border-border shrink-0 flex gap-2">
            <Button
              variant="outline"
              class="flex-1 font-mono text-xs"
              @click="showDeleteDialog = false"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              class="flex-1 font-mono text-xs"
              @click="confirmDelete()"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Project } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ChevronLeft, Plus, FolderOpen, Pencil, AlertTriangle } from 'lucide-vue-next'
import { VueDraggable } from 'vue-draggable-plus'
import ProjectCard from '@/components/ProjectCard.vue'
import { useProjectListStore } from '@/stores/projectListStore'
import { toast } from 'vue-sonner'

const router = useRouter()
const projectListStore = useProjectListStore()

const showRenameDialog = ref(false)
const showDeleteDialog = ref(false)
const renameTarget = ref<Project | null>(null)
const deleteTarget = ref<Project | null>(null)

const renameForm = ref({ name: '' })

const pinnedProjects = computed(() =>
  [...projectListStore.projects].filter(p => p.pinned)
)

const unpinnedProjects = computed(() =>
  [...projectListStore.projects]
    .filter(p => !p.pinned)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
)

function onPinnedReorder(newOrder: Project[]): void {
  projectListStore.reorderPinnedProjects(newOrder)
}

function handleTogglePin(id: string): void {
  const result = projectListStore.togglePin(id)
  if (!result) {
    toast.error('Maximum of 6 pinned projects reached')
  }
}

function goToHome(): void {
  router.push('/')
}

function createNewProject(): void {
  const id = crypto.randomUUID()
  router.push(`/demo/${id}`)
}

function openProject(id: string): void {
  router.push(`/demo/${id}`)
}

function openRenameDialog(project: Project): void {
  renameTarget.value = project
  renameForm.value.name = project.name
  showRenameDialog.value = true
}

function confirmRename(): void {
  if (renameTarget.value && renameForm.value.name.trim()) {
    projectListStore.updateProject(renameTarget.value.id, { name: renameForm.value.name.trim() })
    showRenameDialog.value = false
    renameTarget.value = null
    toast.success('Project renamed successfully!')
  }
}

function openDeleteDialog(project: Project): void {
  deleteTarget.value = project
  showDeleteDialog.value = true
}

function confirmDelete(): void {
  if (deleteTarget.value) {
    projectListStore.deleteProject(deleteTarget.value.id)
    showDeleteDialog.value = false
    toast.success('Project deleted successfully!')
    deleteTarget.value = null
  }
}

onMounted(() => {
  projectListStore.loadProjects()
})
</script>

<style>
.project-chosen {
  outline: 2px solid hsl(var(--primary)) !important;
  outline-offset: -2px !important;
  background-color: hsl(var(--primary) / 0.08) !important;
}

.project-dragging {
  box-shadow: 0 8px 24px hsl(var(--primary) / 0.2) !important;
  opacity: 1 !important;
  transform: scale(1.01) !important;
}

.project-ghost {
  opacity: 0.3 !important;
  background-color: transparent !important;
}
</style>