<template>
  <Dialog v-model:open="modelOpen">
    <DialogContent class="flex flex-col gap-0 p-0 max-w-md w-[calc(100vw-2rem)] rounded-xl overflow-hidden">
      <DialogHeader class="px-5 pt-5 pb-4 border-b border-border shrink-0">
        <DialogTitle class="flex items-center gap-2 text-sm">
          <div class="w-7 h-7 rounded-md bg-muted text-primary flex items-center justify-center shrink-0">
            <Info class="w-3.5 h-3.5" />
          </div>
          How to Use the Estimator
        </DialogTitle>
        <DialogDescription class="text-xs mt-1">
          A quick guide to PERT-based man-hour estimation.
        </DialogDescription>
      </DialogHeader>
      <ScrollArea class="h-[60dvh]">
        <div class="px-5 py-4 space-y-5">
          <div class="space-y-4">
            <p class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Steps
            </p>
            <div class="flex gap-3">
              <div class="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center mt-0.5">
                <span class="font-mono text-[10px] font-semibold text-primary">1</span>
              </div>
              <div class="space-y-0.5">
                <p class="text-sm font-medium">
                  Enter three-point estimates per task
                </p>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  For each task, provide an <span class="font-medium text-foreground">Optimistic (O)</span>
                  best-case,
                  <span class="font-medium text-foreground">Most Likely (M)</span> realistic, and <span
                    class="font-medium text-foreground"
                  >Pessimistic (P)</span> worst-case hour estimate.
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center mt-0.5">
                <span class="font-mono text-[10px] font-semibold text-primary">2</span>
              </div>
              <div class="space-y-0.5">
                <p class="text-sm font-medium">
                  Expected time is auto-calculated
                </p>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  Once a task is added, the PERT formula runs automatically — no manual calculation needed.
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center mt-0.5">
                <span class="font-mono text-[10px] font-semibold text-primary">3</span>
              </div>
              <div class="space-y-0.5">
                <p class="text-sm font-medium">
                  Set a desired completion time
                </p>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  Enter your target deadline in hours under <span class="font-medium text-foreground">Desired
                    Completion
                    Time (D)</span>. The tool calculates a Z-score and maps it to an on-time probability.
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center mt-0.5">
                <span class="font-mono text-[10px] font-semibold text-primary">4</span>
              </div>
              <div class="space-y-0.5">
                <p class="text-sm font-medium">
                  Interpret the probability
                </p>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  Aim for <span class="font-medium text-foreground">≥ 80%</span> for reliable delivery. Below 50%
                  signals
                  the deadline is too aggressive.
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center mt-0.5">
                <span class="font-mono text-[10px] font-semibold text-primary">5</span>
              </div>
              <div class="space-y-0.5">
                <p class="text-sm font-medium">
                  Manage your tasks
                </p>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  Edit estimates directly in the table, reorder tasks by dragging, or use the pencil/X icons for
                  detailed
                  edits. Use the <span class="font-medium text-foreground">Retain Milestone</span> checkbox to
                  quickly add
                  multiple tasks to the same milestone.
                </p>
              </div>
            </div>
          </div>
          <Separator />
          <div class="space-y-3">
            <p class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Formulas
            </p>
            <div class="space-y-2.5">
              <div class="rounded-lg border border-primary/50 bg-muted/40 p-3 space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-xs font-medium">
                    Expected Duration
                  </p>
                  <span
                    class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                  >E</span>
                </div>
                <code
                  class="block font-mono text-xs bg-background border border-border rounded-md px-3 py-2 text-center tracking-wide"
                >E
                  = (O + 4M + P) / 6</code>
                <p class="text-[11px] text-muted-foreground leading-relaxed">
                  Weighted average that emphasises the most likely estimate 4×.
                </p>
              </div>
              <div class="rounded-lg border border-primary/50 bg-muted/40 p-3 space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-xs font-medium">
                    Variance
                  </p>
                  <span
                    class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                  >σ²</span>
                </div>
                <code
                  class="block font-mono text-xs bg-background border border-border rounded-md px-3 py-2 text-center tracking-wide"
                >σ²
                  = ((P − O) / 6)²</code>
                <p class="text-[11px] text-muted-foreground leading-relaxed">
                  Measures uncertainty. Higher variance means a wider spread between best and worst case.
                </p>
              </div>
              <div class="rounded-lg border border-primary/50 bg-muted/40 p-3 space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-xs font-medium">
                    Standard Deviation
                  </p>
                  <span
                    class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                  >σ</span>
                </div>
                <code
                  class="block font-mono text-xs bg-background border border-border rounded-md px-3 py-2 text-center tracking-wide"
                >σ
                  = (P − O) / 6</code>
                <p class="text-[11px] text-muted-foreground leading-relaxed">
                  Square root of variance. Used to compute the Z-score for probability lookup.
                </p>
              </div>
              <div class="rounded-lg border border-primary/50 bg-muted/40 p-3 space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-xs font-medium">
                    Z-Score
                  </p>
                  <span
                    class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                  >Z</span>
                </div>
                <code
                  class="block font-mono text-xs bg-background border border-border rounded-md px-3 py-2 text-center tracking-wide"
                >Z
                  = (D − ΣE) / √Σσ²</code>
                <p class="text-[11px] text-muted-foreground leading-relaxed">
                  How many standard deviations your deadline (D) is from the total expected time.
                </p>
              </div>
            </div>
          </div>
          <Separator />
          <div class="space-y-3 pb-1">
            <p class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              FAQ
            </p>
            <div class="space-y-1">
              <p class="text-xs font-medium">
                What if I only have one estimate?
              </p>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Set O, M, and P to the same value. Variance becomes zero, indicating full confidence in that
                estimate.
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-medium">
                What does a negative Z-score mean?
              </p>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Your desired time is shorter than the expected total — probability drops below 50%, meaning the
                project is
                likely to overrun.
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-medium">
                How do I export the results?
              </p>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Use the <span class="font-medium text-foreground">Export</span> button in the Task Breakdown section
                to
                download an Excel file. Note that you must set a Desired Completion Time (D) before exporting.
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-medium">
                What does "Retain Milestone" do?
              </p>
              <p class="text-xs text-muted-foreground leading-relaxed">
                When checked, the milestone value is preserved for the next task you add. This is useful when adding
                multiple tasks to the same milestone.
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-medium">
                Can I edit estimates directly?
              </p>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Yes! Click on any O, M, or P value in the task table to edit it directly. The PERT calculations
                update
                automatically.
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
      <div class="px-5 py-4 border-t border-border shrink-0">
        <Button
          class="w-full font-mono text-xs"
          @click="modelOpen = false"
        >
          Got it
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Info } from 'lucide-vue-next'

const modelOpen = defineModel<boolean>({ required: true })
</script>
