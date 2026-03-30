<template>
  <Dialog v-model:open="modelOpen">
    <DialogContent class="flex flex-col gap-0 p-0 max-w-md w-[calc(100vw-2rem)] rounded-xl overflow-hidden">
      <DialogHeader class="px-5 pt-5 pb-4 border-b border-border shrink-0">
        <DialogTitle class="flex items-center gap-2 text-sm text-destructive">
          <div class="w-7 h-7 rounded-md bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <AlertTriangle class="w-3.5 h-3.5" />
          </div>
          {{ title }}
        </DialogTitle>
        <DialogDescription class="text-xs mt-1">
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <div class="px-5 py-4 space-y-4">
        <p class="text-sm">
          {{ message }}
        </p>
        <div
          v-if="showCheckbox"
          class="flex items-center gap-3 pt-2"
        >
          <Checkbox
            :id="checkboxId"
            :model-value="!suppressWarning"
            @update:model-value="$emit('update:suppressWarning', !$event)"
          />
          <Label
            :for="checkboxId"
            class="text-xs text-muted-foreground cursor-pointer"
          >
            Don't show this warning again
          </Label>
        </div>
      </div>
      <div class="px-5 py-4 border-t border-border shrink-0 flex gap-2">
        <Button
          variant="outline"
          class="flex-1 font-mono text-xs"
          @click="modelOpen = false"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          class="flex-1 font-mono text-xs"
          @click="$emit('confirm')"
        >
          {{ confirmLabel }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { AlertTriangle } from 'lucide-vue-next'

const modelOpen = defineModel<boolean>({ required: true })

defineProps<{
  title: string
  message: string
  confirmLabel: string
  checkboxId?: string
  showCheckbox?: boolean
  suppressWarning?: boolean
}>()

defineEmits<{
  confirm: []
  'update:suppressWarning': [value: boolean]
}>()
</script>
