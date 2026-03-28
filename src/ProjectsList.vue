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
              Man Hours History
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

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div
          v-for="project in sortedProjects"
          :key="project.id"
          class="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md cursor-pointer"
          @click="openProject(project.id)"
        >
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="min-w-0 flex-1">
              <h3 class="text-sm font-semibold truncate leading-tight">
                {{ project.name }}
              </h3>
              <p class="text-[10px] text-muted-foreground font-mono mt-1">
                {{ formatDate(project.updatedAt) }}
              </p>
            </div>
            <div class="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                @click.stop="openRenameDialog(project)"
              >
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button
                class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                @click.stop="openDeleteDialog(project)"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-baseline gap-1.5">
              <span class="text-lg font-bold tabular-nums text-primary">
                {{ getTotalExpected(project) }}
              </span>
              <span class="text-[10px] text-muted-foreground">hrs</span>
            </div>
            <div class="h-4 w-px bg-border/60" />
            <div class="flex items-baseline gap-1.5">
              <span class="text-sm font-medium tabular-nums">
                {{ project.state.tasks.length }}
              </span>
              <span class="text-[10px] text-muted-foreground">tasks</span>
            </div>
          </div>

          <div class="mt-3 flex items-center gap-2">
            <Badge
              v-if="project.state.tasks.length > 0"
              variant="secondary"
              class="font-mono text-[10px]"
            >
              {{ (calculateProbability(
                project.state.tasks.length === 0 || project.state.targetDuration === null
                  ? 0
                  : calculateZScore(
                    project.state.targetDuration,
                    calculateTotalExpectedTime(project.state.tasks),
                    calculateTotalVariance(project.state.tasks)
                  )
              ) * 100).toFixed(1) }}% probability
            </Badge>
            <Badge
              v-if="project.state.targetDuration !== null"
              variant="outline"
              class="font-mono text-[10px]"
            >
              D: {{ project.state.targetDuration }}h
            </Badge>
          </div>
        </div>
      </div>

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
              <div class="w-7 h-7 rounded-md bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
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
              Are you sure you want to delete <strong class="text-foreground">{{ deleteTarget?.name }}</strong>? All tasks and estimates will be lost.
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
import { ChevronLeft, Plus, FolderOpen, Pencil, X, AlertTriangle } from 'lucide-vue-next'
import { useProjectListStore } from '@/stores/projectListStore'
import { calculateTotalExpectedTime, calculateTotalVariance } from '@/utils/calculateTotals'
import { calculateZScore } from '@/utils/calculateZScore'
import { calculateProbability } from '@/utils/calculateProbability'
import { toast } from 'vue-sonner'

const router = useRouter()
const projectListStore = useProjectListStore()

const showRenameDialog = ref(false)
const showDeleteDialog = ref(false)
const renameTarget = ref<Project | null>(null)
const deleteTarget = ref<Project | null>(null)

const renameForm = ref({ name: '' })

const sortedProjects = computed(() =>
  [...projectListStore.projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
)

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const DD = String(date.getDate()).padStart(2, '0')
  const YY = String(date.getFullYear()).slice(2)
  const HH = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${MM}-${DD}-${YY} ${HH}:${mm}`
}

function getTotalExpected(project: Project): string {
  if (project.state.tasks.length === 0) return '0.00'
  return calculateTotalExpectedTime(project.state.tasks).toFixed(2)
}

function goToHome(): void {
  router.push('/')
}

function createNewProject(): void {
  router.push('/demo/new')
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
