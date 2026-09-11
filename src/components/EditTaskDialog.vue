<template>
  <Dialog
    :open="open"
    @update:open="emit('update:open', $event)"
  >
    <DialogContent class="flex flex-col gap-0 p-0 max-w-md w-[calc(100vw-2rem)] rounded-xl overflow-hidden">
      <DialogHeader class="px-5 pt-5 pb-4 border-b border-border shrink-0">
        <DialogTitle class="flex items-center gap-2 text-sm">
          <div class="w-7 h-7 rounded-md bg-muted text-primary flex items-center justify-center shrink-0">
            <Pencil class="w-3.5 h-3.5" />
          </div>
          Edit Task
        </DialogTitle>
        <DialogDescription class="text-xs mt-1">
          Update task details. You can edit estimates directly in the table.
        </DialogDescription>
      </DialogHeader>

      <div class="px-5 py-4 space-y-4">
        <div class="grid gap-2">
          <Label
            for="edit-milestone"
            class="text-xs font-medium"
          >Milestone</Label>
          <Input
            id="edit-milestone"
            v-model="editTaskForm.milestone"
            type="text"
            placeholder="e.g. Planning"
          />
        </div>
        <div class="grid gap-2">
          <Label
            for="edit-taskName"
            class="text-xs font-medium"
          >Task Name</Label>
          <Input
            id="edit-taskName"
            v-model="editTaskForm.taskName"
            type="text"
            placeholder="e.g. API Integration"
          />
        </div>
        <div class="grid gap-2">
          <Label
            for="edit-description"
            class="text-xs font-medium"
          >Description (Optional)</Label>
          <Textarea
            id="edit-description"
            v-model="editTaskForm.description"
            placeholder="Add additional details about this task..."
            class="resize-none min-h-16 max-h-24"
          />
        </div>
        <Separator />
        <div class="space-y-3">
          <p class="text-xs font-medium">
            Estimates
          </p>
          <div class="grid grid-cols-3 gap-3">
            <div class="grid gap-2">
              <Label class="font-mono text-[10px] uppercase text-muted-foreground">Optimistic (O)</Label>
              <NumberField
                v-model="editTaskForm.optimistic"
                :min="0"
                :step="0.1"
                :format-options="editTaskForm.optimistic !== null ? { minimumFractionDigits: 1 } : undefined"
              >
                <NumberFieldContent>
                  <NumberFieldInput />
                </NumberFieldContent>
              </NumberField>
            </div>
            <div class="grid gap-2">
              <Label class="font-mono text-[10px] uppercase text-muted-foreground">Most Likely (M)</Label>
              <NumberField
                v-model="editTaskForm.mostLikely"
                :min="0"
                :step="0.1"
                :format-options="editTaskForm.mostLikely !== null ? { minimumFractionDigits: 1 } : undefined"
              >
                <NumberFieldContent>
                  <NumberFieldInput />
                </NumberFieldContent>
              </NumberField>
            </div>
            <div class="grid gap-2">
              <Label class="font-mono text-[10px] uppercase text-muted-foreground">Pessimistic (P)</Label>
              <NumberField
                v-model="editTaskForm.pessimistic"
                :min="0"
                :step="0.1"
                :format-options="editTaskForm.pessimistic !== null ? { minimumFractionDigits: 1 } : undefined"
              >
                <NumberFieldContent>
                  <NumberFieldInput />
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
        </div>
      </div>

      <div class="px-5 py-4 border-t border-border shrink-0 flex gap-2">
        <Button
          variant="outline"
          class="flex-1 font-mono text-xs"
          @click="emit('update:open', false)"
        >
          Cancel
        </Button>
        <Button
          class="flex-1 font-mono text-xs"
          :disabled="!canSave"
          @click="save()"
        >
          Save Changes
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import type { PERTTaskResult } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { NumberField, NumberFieldContent, NumberFieldInput } from '@/components/ui/number-field'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Pencil } from 'lucide-vue-next'
import { validateEstimateOrder, estimateIssueMessage } from '@/utils/validateEstimates'

const props = defineProps<{
  open: boolean
  initialTask: PERTTaskResult | null
}>()

const emit = defineEmits<{
  save: [updates: {
    taskName: string
    milestone: string
    description: string
    optimistic: number | null
    mostLikely: number | null
    pessimistic: number | null
  }]
  'update:open': [value: boolean]
}>()

const editTaskForm = reactive({
  taskName: '',
  milestone: '',
  description: '',
  optimistic: null as number | null,
  mostLikely: null as number | null,
  pessimistic: null as number | null,
})

watch(
  () => props.open,
  (open) => {
    if (open && props.initialTask) {
      editTaskForm.taskName = props.initialTask.taskName
      editTaskForm.milestone = props.initialTask.milestone
      editTaskForm.description = props.initialTask.description
      editTaskForm.optimistic = props.initialTask.optimistic
      editTaskForm.mostLikely = props.initialTask.mostLikely
      editTaskForm.pessimistic = props.initialTask.pessimistic
    }
  },
)

const estimateValidation = computed(() =>
  validateEstimateOrder(editTaskForm.optimistic, editTaskForm.mostLikely, editTaskForm.pessimistic),
)

const canSave = computed(() =>
  editTaskForm.taskName.trim().length > 0 &&
  editTaskForm.optimistic !== null &&
  editTaskForm.mostLikely !== null &&
  editTaskForm.pessimistic !== null &&
  estimateValidation.value.valid,
)

function save(): void {
  if (!canSave.value) return
  emit('save', {
    taskName: editTaskForm.taskName,
    milestone: editTaskForm.milestone,
    description: editTaskForm.description,
    optimistic: editTaskForm.optimistic,
    mostLikely: editTaskForm.mostLikely,
    pessimistic: editTaskForm.pessimistic,
  })
}
</script>