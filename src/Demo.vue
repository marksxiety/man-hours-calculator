<template>
  <div>
    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 w-full">
      <!-- Header -->
      <div class="mb-8">
        <Badge
          variant="outline"
          class="mb-5 font-mono text-xs tracking-widest uppercase"
        >
          PERT Analysis
        </Badge>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              class="-ml-2"
              title="Projects"
              @click="goToProjects()"
            >
              <ChevronLeft class="w-4 h-4" />
            </Button>
            <h1
              v-if="!isEditingTitle"
              class="text-2xl sm:text-3xl font-bold tracking-tight truncate max-w-50 sm:max-w-2xl cursor-pointer hover:text-primary/80 transition-colors"
              title="Click to rename"
              @click="startEditingTitle()"
            >
              {{ currentProjectName }}
            </h1>
            <input
              v-else
              ref="titleInputRef"
              v-model="titleDraft"
              class="text-2xl sm:text-3xl font-bold tracking-tight bg-transparent border-none outline-none max-w-50 sm:max-w-none w-full"
              @keyup.enter="confirmTitleEdit()"
              @keyup.escape="cancelTitleEdit()"
              @blur="confirmTitleEdit()"
            >
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              title="Info"
              @click="showInfoDialog = true"
            >
              <Info class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
        <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div class="mb-4">
            <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
              Input
            </p>
            <h2 class="text-base font-semibold tracking-tight">
              Add New Task
            </h2>
            <p class="text-xs text-muted-foreground mt-0.5">
              Add tasks with three-point estimates. The model updates automatically.
            </p>
          </div>

          <div class="space-y-4">
            <div class="grid gap-2">
              <div class="flex items-center justify-between">
                <Label
                  for="milestone"
                  class="text-xs font-medium"
                >Milestone</Label>
                <div class="flex items-center gap-2">
                  <Checkbox
                    id="retainMilestone"
                    :model-value="projectStore.retainMilestone"
                    @update:model-value="projectStore.retainMilestone = !!$event"
                  />
                  <Label
                    for="retainMilestone"
                    class="text-[10px] text-muted-foreground cursor-pointer"
                  >Retain</Label>
                </div>
              </div>
              <Input
                id="milestone"
                v-model="newTaskForm.milestone"
                type="text"
                placeholder="e.g. Planning"
              />
            </div>

            <div class="grid gap-2">
              <Label
                for="taskName"
                class="text-xs font-medium"
              >Task Name</Label>
              <Input
                id="taskName"
                v-model="newTaskForm.taskName"
                type="text"
                placeholder="e.g. API Integration"
              />
            </div>

            <div class="grid gap-2">
              <Label
                for="description"
                class="text-xs font-medium"
              >Description (Optional)</Label>
              <Textarea
                id="description"
                v-model="newTaskForm.description"
                placeholder="Add additional details about this task..."
                class="resize-none min-h-16 max-h-24"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="flex flex-col gap-2 w-full">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <Label class="font-mono text-[10px] uppercase text-muted-foreground">Optimistic (O)</Label>
                    <HelpTooltip
                      :icon="Star"
                      title="Best case scenario (in hours)"
                      description="Minimum hours if everything goes perfectly. Accepts decimals (e.g. 1.5). Should be less than or equal to Most Likely. Used as the lower bound in the PERT formula."
                    />
                  </div>
                </div>
                <NumberField
                  v-model="newTaskForm.optimistic"
                  :min="0"
                  :step="0.1"
                  :format-options="newTaskForm.optimistic !== null ? { minimumFractionDigits: 1 } : undefined"
                  class="w-full"
                >
                  <NumberFieldContent class="w-full">
                    <NumberFieldInput class="w-full" />
                  </NumberFieldContent>
                </NumberField>
              </div>

              <div class="flex flex-col gap-2 w-full">
                <div class="flex items-center gap-1.5">
                  <Label class="font-mono text-[10px] uppercase text-muted-foreground">Most Likely (M)</Label>
                  <HelpTooltip
                    :icon="Target"
                    title="Realistic estimate (in hours)"
                    description="Most probable hours to complete the task. Accepts decimals (e.g. 2.5). Should sit between Optimistic and Pessimistic. Weighted 4× in the PERT expected value."
                  />
                </div>
                <NumberField
                  v-model="newTaskForm.mostLikely"
                  :min="0"
                  :step="0.1"
                  :format-options="newTaskForm.mostLikely !== null ? { minimumFractionDigits: 1 } : undefined"
                  class="w-full"
                >
                  <NumberFieldContent class="w-full">
                    <NumberFieldInput class="w-full" />
                  </NumberFieldContent>
                </NumberField>
              </div>

              <div class="flex flex-col gap-2 w-full">
                <div class="flex items-center gap-1.5">
                  <Label class="font-mono text-[10px] uppercase text-muted-foreground">Pessimistic (P)</Label>
                  <HelpTooltip
                    :icon="AlertTriangle"
                    title="Worst case scenario (in hours)"
                    description="Maximum realistic hours if problems arise. Accepts decimals (e.g. 4). Should be greater than or equal to Most Likely — avoid extreme outliers. Upper bound in the PERT formula."
                  />
                </div>
                <NumberField
                  v-model="newTaskForm.pessimistic"
                  :min="0"
                  :step="0.1"
                  :format-options="newTaskForm.pessimistic !== null ? { minimumFractionDigits: 1 } : undefined"
                  class="w-full"
                >
                  <NumberFieldContent class="w-full">
                    <NumberFieldInput class="w-full" />
                  </NumberFieldContent>
                </NumberField>
              </div>
            </div>

            <p
              v-if="estimateValidation.issues.length > 0"
              class="text-[11px] text-destructive"
            >
              {{ estimateValidation.issues.map(estimateIssueMessage).join(' ') }}
            </p>

            <Button
              :disabled="!canAdd"
              class="w-full font-mono gap-2"
              @click="addTask()"
            >
              <Plus class="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </div>

        <div class="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
          <div class="mb-4">
            <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
              Analysis
            </p>
            <h2 class="text-base font-semibold tracking-tight">
              Project Probability
            </h2>
            <p class="text-xs text-muted-foreground mt-0.5">
              Statistical confidence analysis
            </p>
          </div>

          <div class="grid flex-1 gap-4">
            <div class="grid gap-2">
              <div class="flex items-center gap-1.5">
                <Label
                  for="targetDuration"
                  class="text-xs font-medium"
                >
                  Desired Completion Time (D)
                </Label>
                <HelpTooltip
                  :icon="CalendarClock"
                  title="Target deadline (total project hours)"
                  description="Your desired completion time for the whole project, in total hours (not a calendar date). Accepts decimals. Used to calculate the Z-score and on-time probability against the summed PERT estimate."
                />
              </div>
              <NumberField
                :model-value="projectStore.targetDuration"
                :min="0"
                :step="0.1"
                :format-options="projectStore.targetDuration !== null ? { minimumFractionDigits: 1 } : undefined"
                @update:model-value="projectStore.setTargetDuration($event)"
              >
                <NumberFieldContent>
                  <NumberFieldInput class="bg-background" />
                </NumberFieldContent>
              </NumberField>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <AnalysisMetricCard
                label="Total Expected"
                :value="projectStore.pertAnalysis.totalExpectedTime.toFixed(2)"
                subtitle="Sum of expected durations"
              />
              <AnalysisMetricCard
                label="Total Variance"
                :value="projectStore.pertAnalysis.totalVariance.toFixed(3)"
                subtitle="Higher = less confident"
              />
              <AnalysisMetricCard
                label="Z-Score"
                :value="projectStore.pertAnalysis.zScore.toFixed(3)"
                subtitle="(Target − Expected) / Std Dev"
              />
              <AnalysisMetricCard
                label="On-Time Probability"
                :value="`${projectStore.pertAnalysis.probability.toFixed(1)}%`"
                subtitle="Based on Z-score lookup"
                highlighted
              />
            </div>
          </div>
        </div>

        <Separator class="col-span-1 lg:col-span-2" />

        <div class="col-span-1 lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground">
              Task Breakdown
            </p>
            <div class="flex gap-2">
              <Popover v-model:open="popoverOpen">
                <PopoverTrigger
                  :disabled="projectStore.taskList.length === 0 || exportingFormat !== null"
                  as-child
                >
                  <Button
                    variant="outline"
                    size="sm"
                    class="gap-1.5 font-mono text-xs"
                  >
                    <template v-if="exportingFormat !== null">
                      <Loader2 class="w-3.5 h-3.5 animate-spin" />
                    </template>
                    <template v-else>
                      <Download class="w-3.5 h-3.5" />
                    </template>
                    <span class="hidden xs:inline">Export</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  class="w-40 p-1"
                >
                  <Button
                    variant="ghost"
                    class="w-full justify-start gap-2 text-xs font-normal"
                    :disabled="projectStore.targetDuration === null || exportingFormat !== null"
                    @click="exportToExcel()"
                  >
                    <template v-if="exportingFormat === 'excel'">
                      <Loader2 class="w-3.5 h-3.5 animate-spin" />
                    </template>
                    <template v-else>
                      <FileSpreadsheet class="w-3.5 h-3.5" />
                    </template>
                    Excel
                  </Button>
                  <Button
                    variant="ghost"
                    class="w-full justify-start gap-2 text-xs font-normal"
                    :disabled="projectStore.targetDuration === null || exportingFormat !== null"
                    @click="exportToJsonFile()"
                  >
                    <template v-if="exportingFormat === 'json'">
                      <Loader2 class="w-3.5 h-3.5 animate-spin" />
                    </template>
                    <template v-else>
                      <FileJson class="w-3.5 h-3.5" />
                    </template>
                    JSON
                  </Button>
                </PopoverContent>
              </Popover>
              <Button
                size="sm"
                class="gap-1.5 font-mono text-xs"
                :disabled="projectStore.taskList.length === 0"
                @click="openResetDialog()"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span class="hidden xs:inline">Reset</span>
              </Button>
            </div>
          </div>

          <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div
              v-if="projectStore.taskList.length === 0"
              class="py-16 text-center text-muted-foreground text-sm"
            >
              No tasks added yet. Start by adding a task above.
            </div>

            <template v-else>
              <div class="hidden md:block">
                <TaskTable
                  :tasks="projectStore.taskList"
                  @update="handleTaskUpdate"
                  @edit="openEditDialog"
                  @delete="openDeleteDialog"
                  @reorder="handleReorderTasks"
                />
              </div>

              <div class="md:hidden">
                <TaskListMobile
                  :tasks="projectStore.taskList"
                  @update="handleTaskUpdate"
                  @edit="openEditDialog"
                  @delete="openDeleteDialog"
                  @reorder="handleReorderTasks"
                />
              </div>
            </template>
          </div>
        </div>
      </div>

      <InfoDialog v-model="showInfoDialog" />

      <EditTaskDialog
        v-model:open="showEditDialog"
        :initial-task="editingTaskIndex !== null ? projectStore.taskList[editingTaskIndex] : null"
        @save="handleEditSave"
      />

      <ConfirmDialog
        v-model="showDeleteDialog"
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        confirm-label="Delete"
        checkbox-id="dontShowDeleteWarning"
        :show-checkbox="true"
        :suppress-warning="projectStore.deleteWarning"
        @confirm="confirmDeleteTask()"
        @update:suppress-warning="projectStore.deleteWarning = !$event"
      />

      <ConfirmDialog
        v-model="showResetDialog"
        title="Reset All Tasks"
        message="Are you sure you want to reset all tasks? All data will be permanently cleared."
        confirm-label="Reset"
        checkbox-id="dontShowResetWarning"
        :show-checkbox="true"
        :suppress-warning="projectStore.resetWarning"
        @confirm="confirmReset()"
        @update:suppress-warning="projectStore.resetWarning = !$event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { exportToExcel as exportWorkbook } from '@/utils/excel'
import { exportToJson } from '@/utils/json'
import { useRouter, useRoute } from 'vue-router'
import type { NewTask, PERTTaskResult } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { NumberField, NumberFieldContent, NumberFieldInput } from '@/components/ui/number-field'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import HelpTooltip from '@/components/HelpTooltip.vue'
import AnalysisMetricCard from '@/components/AnalysisMetricCard.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import InfoDialog from '@/components/InfoDialog.vue'
import TaskTable from '@/components/TaskTable.vue'
import TaskListMobile from '@/components/TaskListMobile.vue'
import EditTaskDialog from '@/components/EditTaskDialog.vue'
import { ChevronLeft, Download, RotateCcw, Info, Plus, Star, Target, AlertTriangle, CalendarClock, FileSpreadsheet, FileJson, Loader2 } from 'lucide-vue-next'
import { useProjectStore } from '@/stores/projectStore'
import { useProjectListStore } from '@/stores/projectListStore'
import { validateEstimateOrder, estimateIssueMessage } from '@/utils/validateEstimates'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const projectListStore = useProjectListStore()

const showInfoDialog = ref(false)
const showEditDialog = ref(false)
const editingTaskIndex = ref<number | null>(null)
const showDeleteDialog = ref(false)
const showResetDialog = ref(false)
const deleteTaskIndex = ref<number | null>(null)

const currentProjectId = ref<string | null>(null)
const isNewProject = ref(false)

const exportingFormat = ref<'excel' | 'json' | null>(null)
const popoverOpen = ref(false)
const isEditingTitle = ref(false)
const titleDraft = ref('')
const titleInputRef = ref<HTMLInputElement | null>(null)

const saveForm = reactive({ name: '' })

function generateDefaultName(): string {
  return projectListStore.suggestDefaultName()
}

const newTaskForm = reactive<NewTask>({
  taskName: '',
  milestone: '',
  description: '',
  optimistic: null,
  mostLikely: null,
  pessimistic: null,
})

const estimateValidation = computed(() =>
  validateEstimateOrder(newTaskForm.optimistic, newTaskForm.mostLikely, newTaskForm.pessimistic),
)

const canAdd = computed(() =>
  newTaskForm.taskName.trim().length > 0 &&
  newTaskForm.optimistic !== null &&
  newTaskForm.mostLikely !== null &&
  newTaskForm.pessimistic !== null &&
  estimateValidation.value.valid,
)

function resetTaskForm(): void {
  newTaskForm.taskName = ''
  newTaskForm.description = ''
  if (!projectStore.retainMilestone) newTaskForm.milestone = ''
  newTaskForm.optimistic = null
  newTaskForm.mostLikely = null
  newTaskForm.pessimistic = null
}

function startEditingTitle(): void {
  titleDraft.value = saveForm.name
  isEditingTitle.value = true
  nextTick(() => {
    const input = titleInputRef.value
    if (input) {
      input.focus()
      input.select()
    }
  })
}

function confirmTitleEdit(): void {
  if (!isEditingTitle.value) return
  const trimmed = titleDraft.value.trim()
  if (trimmed && trimmed !== saveForm.name) {
    saveForm.name = trimmed
    confirmSave()
  }
  isEditingTitle.value = false
}

function cancelTitleEdit(): void {
  isEditingTitle.value = false
}

const currentProjectName = computed(() => {
  if (isNewProject.value) return saveForm.name || generateDefaultName()
  const project = projectListStore.getProjectById(currentProjectId.value!)
  return project?.name ?? 'Man Hours Estimator'
})

function addTask(): void {
  if (!canAdd.value) {
    const missing: string[] = []
    if (newTaskForm.optimistic === null) missing.push('Optimistic (O)')
    if (newTaskForm.mostLikely === null) missing.push('Most Likely (M)')
    if (newTaskForm.pessimistic === null) missing.push('Pessimistic (P)')
    if (missing.length > 0) {
      toast.error(`Please fill in all fields: ${missing.join(', ')}`)
    } else {
      toast.error(estimateValidation.value.issues.map(estimateIssueMessage).join(' '))
    }
    return
  }
  projectStore.addTask(newTaskForm)
  resetTaskForm()
  toast.success('Task added successfully!')
}

function handleTaskUpdate(index: number, field: 'optimistic' | 'mostLikely' | 'pessimistic', value: number | null): void {
  projectStore.updateTask(index, field, value)
}

function handleReorderTasks(newOrder: PERTTaskResult[]): void {
  projectStore.taskList.splice(0, projectStore.taskList.length, ...newOrder)
}

function openEditDialog(index: number): void {
  editingTaskIndex.value = index
  showEditDialog.value = true
}

function handleEditSave(updates: {
  taskName: string
  milestone: string
  description: string
  optimistic: number | null
  mostLikely: number | null
  pessimistic: number | null
}): void {
  if (editingTaskIndex.value !== null) {
    projectStore.editTask(editingTaskIndex.value, updates)
    showEditDialog.value = false
    editingTaskIndex.value = null
    toast.success('Task updated successfully!')
  }
}

function openDeleteDialog(index: number): void {
  if (projectStore.deleteWarning) {
    deleteTaskIndex.value = index
    showDeleteDialog.value = true
  } else {
    projectStore.removeTask(index)
    toast.success('Task deleted successfully!')
  }
}

function confirmDeleteTask(): void {
  if (deleteTaskIndex.value !== null) {
    projectStore.removeTask(deleteTaskIndex.value)
    showDeleteDialog.value = false
    deleteTaskIndex.value = null
    toast.success('Task deleted successfully!')
  }
}

function openResetDialog(): void {
  if (projectStore.resetWarning) {
    showResetDialog.value = true
  } else {
    projectStore.resetAll()
    toast.success('All tasks reset successfully!')
  }
}

function confirmReset(): void {
  projectStore.resetAll()
  showResetDialog.value = false
  toast.success('All tasks reset successfully!')
}

function goToProjects(): void {
  router.push('/projects')
}

function confirmSave(): void {
  if (!saveForm.name.trim()) return
  const name = saveForm.name.trim()
  const state = projectStore.exportState()

  if (isNewProject.value) {
    if (projectListStore.hasProject(currentProjectId.value!)) {
      projectListStore.updateProject(currentProjectId.value!, { name, state })
    } else {
      projectListStore.createProjectWithId(currentProjectId.value!, name, state)
    }
    isNewProject.value = false
    toast.success('Project saved successfully!')
  } else {
    projectListStore.updateProject(currentProjectId.value!, { name, state })
    toast.success('Project updated successfully!')
  }
}

async function exportToExcel(): Promise<void> {
  if (projectStore.targetDuration === null) {
    toast.error('Please add a Desired Completion Time (D) before exporting')
    return
  }
  exportingFormat.value = 'excel'
  try {
    await exportWorkbook({
      projectName: saveForm.name.trim(),
      tasks: projectStore.taskList,
      analysis: projectStore.pertAnalysis,
      targetDuration: projectStore.targetDuration,
    })
  } finally {
    exportingFormat.value = null
  }
}

async function exportToJsonFile(): Promise<void> {
  if (projectStore.targetDuration === null) {
    toast.error('Please add a Desired Completion Time (D) before exporting')
    return
  }
  exportingFormat.value = 'json'
  try {
    await exportToJson({
      projectName: saveForm.name.trim(),
      tasks: projectStore.taskList,
      analysis: projectStore.pertAnalysis,
      targetDuration: projectStore.targetDuration,
    })
  } finally {
    exportingFormat.value = null
  }
}

onMounted(() => {
  projectListStore.loadProjects()
  const id = route.params.id as string

  const project = projectListStore.getProjectById(id)
  if (project) {
    currentProjectId.value = id
    isNewProject.value = false
    saveForm.name = project.name
    projectStore.loadFromProject(project.state)
  } else {
    currentProjectId.value = id
    isNewProject.value = true
    saveForm.name = generateDefaultName()
    projectStore.resetAll()
    nextTick(() => startEditingTitle())
  }
})

watch(() => projectStore.taskList, () => {
  if (!currentProjectId.value || projectStore.taskList.length === 0) return
  const state = projectStore.exportState()
  if (projectListStore.hasProject(currentProjectId.value)) {
    projectListStore.updateProject(currentProjectId.value, { state })
  } else {
    projectListStore.createProjectWithId(currentProjectId.value, saveForm.name, state)
    isNewProject.value = false
  }
}, { deep: true })

watch(() => projectStore.targetDuration, () => {
  if (!currentProjectId.value || projectStore.taskList.length === 0) return
  const state = projectStore.exportState()
  if (projectListStore.hasProject(currentProjectId.value)) {
    projectListStore.updateProject(currentProjectId.value, { state })
  } else {
    projectListStore.createProjectWithId(currentProjectId.value, saveForm.name, state)
    isNewProject.value = false
  }
})
</script>

<style>
.task-chosen {
  outline: 2px solid hsl(var(--primary)) !important;
  outline-offset: -2px !important;
  background-color: hsl(var(--primary) / 0.08) !important;
}

.task-dragging {
  box-shadow: 0 8px 24px hsl(var(--primary) / 0.2) !important;
  opacity: 1 !important;
  transform: scale(1.01) !important;
}

.task-ghost {
  opacity: 0.3 !important;
  background-color: transparent !important;
}

@media (min-width: 400px) {
  .xs\:inline {
    display: inline;
  }
}
</style>