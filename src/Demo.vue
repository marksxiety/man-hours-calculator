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
              @click="goToHome()"
            >
              <ChevronLeft class="w-4 h-4" />
            </Button>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
              Man Hours Estimator
            </h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            @click="showInfoDialog = true"
          >
            <Info class="w-4 h-4" />
          </Button>
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
                    <HoverCard
                      :open-delay="100"
                      :close-delay="50"
                    >
                      <HoverCardTrigger as-child>
                        <button class="inline-flex items-center justify-center w-4 h-4 rounded-full border border-border text-muted-foreground hover:border-foreground/40 hover:bg-muted transition-colors">
                          <HelpCircle class="w-2.5 h-2.5" />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        class="w-56 p-4"
                        side="top"
                        align="start"
                      >
                        <div class="flex flex-col gap-2">
                          <div class="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                            <Star class="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <p class="text-xs font-medium leading-none">
                            Best case scenario
                          </p>
                          <p class="text-xs text-muted-foreground leading-relaxed">
                            Minimum hours if everything goes perfectly. Used as the lower bound in the PERT formula.
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
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
                  <HoverCard
                    :open-delay="100"
                    :close-delay="50"
                  >
                    <HoverCardTrigger as-child>
                      <button class="inline-flex items-center justify-center w-4 h-4 rounded-full border border-border text-muted-foreground hover:border-foreground/40 hover:bg-muted transition-colors">
                        <HelpCircle class="w-2.5 h-2.5" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      class="w-56 p-4"
                      side="top"
                      align="start"
                    >
                      <div class="flex flex-col gap-2">
                        <div class="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                          <Target class="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <p class="text-xs font-medium leading-none">
                          Realistic estimate
                        </p>
                        <p class="text-xs text-muted-foreground leading-relaxed">
                          Most probable hours. Weighted 4× in the PERT expected value.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
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
                  <HoverCard
                    :open-delay="100"
                    :close-delay="50"
                  >
                    <HoverCardTrigger as-child>
                      <button class="inline-flex items-center justify-center w-4 h-4 rounded-full border border-border text-muted-foreground hover:border-foreground/40 hover:bg-muted transition-colors">
                        <HelpCircle class="w-2.5 h-2.5" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      class="w-56 p-4"
                      side="top"
                      align="start"
                    >
                      <div class="flex flex-col gap-2">
                        <div class="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                          <AlertTriangle class="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <p class="text-xs font-medium leading-none">
                          Worst case scenario
                        </p>
                        <p class="text-xs text-muted-foreground leading-relaxed">
                          Maximum hours if problems arise. Upper bound in the PERT formula.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
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

            <Button
              :disabled="!newTaskForm.taskName.trim()"
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
                <HoverCard
                  :open-delay="100"
                  :close-delay="50"
                >
                  <HoverCardTrigger as-child>
                    <button class="inline-flex items-center justify-center w-4 h-4 rounded-full border border-border text-muted-foreground hover:border-foreground/40 hover:bg-muted transition-colors">
                      <HelpCircle class="w-2.5 h-2.5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent
                    class="w-56 p-4"
                    side="top"
                    align="start"
                  >
                    <div class="flex flex-col gap-2">
                      <div class="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                        <CalendarClock class="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <p class="text-xs font-medium leading-none">
                        Target deadline
                      </p>
                      <p class="text-xs text-muted-foreground leading-relaxed">
                        Your desired completion hours. Used to calculate the Z-score and on-time probability.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
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
              <div class="rounded-lg border border-border/50 bg-muted/50 p-3">
                <div class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Total Expected
                </div>
                <div class="text-xl font-bold tabular-nums mt-1">
                  {{ projectStore.pertAnalysis.totalExpectedTime.toFixed(2) }}
                </div>
                <div class="mt-1 text-[10px] leading-tight text-muted-foreground">
                  Sum of expected durations
                </div>
              </div>
              <div class="rounded-lg border border-border/50 bg-muted/50 p-3">
                <div class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Total Variance
                </div>
                <div class="text-xl font-bold tabular-nums mt-1">
                  {{ projectStore.pertAnalysis.totalVariance.toFixed(3) }}
                </div>
                <div class="mt-1 text-[10px] leading-tight text-muted-foreground">
                  Higher = less confident
                </div>
              </div>
              <div class="rounded-lg border border-border/50 bg-muted/50 p-3">
                <div class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Z-Score
                </div>
                <div class="text-xl font-bold tabular-nums mt-1">
                  {{ projectStore.pertAnalysis.zScore.toFixed(3) }}
                </div>
                <div class="mt-1 text-[10px] leading-tight text-muted-foreground">
                  (Target − Expected) / Std Dev
                </div>
              </div>
              <div class="rounded-lg border border-primary/30 bg-primary/10 p-3 shadow-sm">
                <div class="font-mono text-[10px] tracking-widest uppercase text-primary">
                  On-Time Probability
                </div>
                <div class="text-2xl font-black tabular-nums text-primary mt-1">
                  {{ projectStore.pertAnalysis.probability.toFixed(1) }}%
                </div>
                <div class="mt-1 text-[10px] leading-tight text-primary/70 italic">
                  Based on Z-score lookup
                </div>
              </div>
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
              <Button
                variant="outline"
                size="sm"
                class="gap-1.5 font-mono text-xs"
                :disabled="projectStore.taskList.length === 0"
                @click="exportToExcel()"
              >
                <Download class="w-3.5 h-3.5" />
                <span class="hidden xs:inline">Export</span>
              </Button>
              <Button
                size="sm"
                class="gap-1.5 font-mono text-xs"
                @click="projectStore.resetAll()"
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
                <div class="flex items-center gap-3 px-4 py-2.5 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground">
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
                  v-model="projectStore.taskList"
                  class="divide-y divide-border/50"
                  handle=".drag-handle"
                  chosen-class="task-chosen"
                  drag-class="task-dragging"
                  ghost-class="task-ghost"
                >
                  <div
                    v-for="(task, index) in projectStore.taskList"
                    :key="task.taskName + index"
                    class="group flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-muted/30"
                  >
                    <GripVertical class="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing shrink-0 drag-handle" />

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
                          @update:model-value="projectStore.updateTask(index, 'optimistic', $event)"
                        >
                          <NumberFieldContent><NumberFieldInput class="bg-background text-center tabular-nums h-7 text-xs px-1" /></NumberFieldContent>
                        </NumberField>
                      </div>
                      <div class="w-14">
                        <NumberField
                          :model-value="task.mostLikely"
                          :min="0"
                          :step="0.1"
                          :format-options="task.mostLikely !== null ? { minimumFractionDigits: 1 } : undefined"
                          @update:model-value="projectStore.updateTask(index, 'mostLikely', $event)"
                        >
                          <NumberFieldContent><NumberFieldInput class="bg-background text-center tabular-nums h-7 text-xs px-1" /></NumberFieldContent>
                        </NumberField>
                      </div>
                      <div class="w-14">
                        <NumberField
                          :model-value="task.pessimistic"
                          :min="0"
                          :step="0.1"
                          :format-options="task.pessimistic !== null ? { minimumFractionDigits: 1 } : undefined"
                          @update:model-value="projectStore.updateTask(index, 'pessimistic', $event)"
                        >
                          <NumberFieldContent><NumberFieldInput class="bg-background text-center tabular-nums h-7 text-xs px-1" /></NumberFieldContent>
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
                        @click="openEditDialog(index)"
                      >
                        <Pencil class="w-3.5 h-3.5" />
                      </button>
                      <button
                        class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        @click="openDeleteDialog(index)"
                      >
                        <X class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </VueDraggable>
              </div>

              <div class="md:hidden">
                <VueDraggable
                  v-model="projectStore.taskList"
                  class="divide-y divide-border/50"
                  handle=".drag-handle-mobile"
                  chosen-class="task-chosen"
                  drag-class="task-dragging"
                  ghost-class="task-ghost"
                >
                  <div
                    v-for="(task, index) in projectStore.taskList"
                    :key="task.taskName + index + 'mobile'"
                    class="px-4 py-3.5 transition-all duration-200 hover:bg-muted/20 active:bg-muted/30"
                  >
                    <div class="flex items-start gap-2.5">
                      <GripVertical class="w-4 h-4 mt-0.5 text-muted-foreground/60 cursor-grab active:cursor-grabbing shrink-0 drag-handle-mobile" />
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
                            <span class="font-mono text-[10px] uppercase text-muted-foreground font-semibold">Optimistic</span>
                            <NumberField
                              :model-value="task.optimistic"
                              :min="0"
                              :step="0.1"
                              :format-options="task.optimistic !== null ? { minimumFractionDigits: 1 } : undefined"
                              @update:model-value="projectStore.updateTask(index, 'optimistic', $event)"
                            >
                              <NumberFieldContent><NumberFieldInput class="bg-background text-center tabular-nums text-xs h-7" /></NumberFieldContent>
                            </NumberField>
                          </div>
                          <div class="flex flex-col gap-0.5">
                            <span class="font-mono text-[10px] uppercase text-muted-foreground font-semibold">Most Likely</span>
                            <NumberField
                              :model-value="task.mostLikely"
                              :min="0"
                              :step="0.1"
                              :format-options="task.mostLikely !== null ? { minimumFractionDigits: 1 } : undefined"
                              @update:model-value="projectStore.updateTask(index, 'mostLikely', $event)"
                            >
                              <NumberFieldContent><NumberFieldInput class="bg-background text-center tabular-nums text-xs h-7" /></NumberFieldContent>
                            </NumberField>
                          </div>
                          <div class="flex flex-col gap-0.5">
                            <span class="font-mono text-[10px] uppercase text-muted-foreground font-semibold">Pessimistic</span>
                            <NumberField
                              :model-value="task.pessimistic"
                              :min="0"
                              :step="0.1"
                              :format-options="task.pessimistic !== null ? { minimumFractionDigits: 1 } : undefined"
                              @update:model-value="projectStore.updateTask(index, 'pessimistic', $event)"
                            >
                              <NumberFieldContent><NumberFieldInput class="bg-background text-center tabular-nums text-xs h-7" /></NumberFieldContent>
                            </NumberField>
                          </div>
                        </div>

                        <Separator class="mb-3" />

                        <div class="flex items-center gap-3">
                          <div class="flex items-baseline gap-1">
                            <span class="font-mono text-[9px] uppercase text-muted-foreground">Expected</span>
                            <span class="text-sm font-black tabular-nums text-primary">{{ task.expectedTime.toFixed(2) }}</span>
                            <span class="text-[10px] text-muted-foreground">hrs</span>
                          </div>
                          <div class="h-3 w-px bg-border/60" />
                          <div class="flex items-baseline gap-1">
                            <span class="font-mono text-[9px] uppercase text-muted-foreground">Variance</span>
                            <span class="text-xs tabular-nums text-muted-foreground">{{ task.variance.toFixed(3) }}</span>
                          </div>
                          <div class="h-3 w-px bg-border/60" />
                          <div class="flex items-baseline gap-1">
                            <span class="font-mono text-[9px] uppercase text-muted-foreground">Std Dev</span>
                            <span class="text-xs tabular-nums text-muted-foreground">{{ task.standardDeviation.toFixed(3) }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col gap-1 shrink-0">
                        <button
                          class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          @click="openEditDialog(index)"
                        >
                          <Pencil class="w-3.5 h-3.5" />
                        </button>
                        <button
                          class="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          @click="openDeleteDialog(index)"
                        >
                          <X class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </VueDraggable>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Info Dialog (unchanged) -->
      <Dialog v-model:open="showInfoDialog">
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
                      For each task, provide an <span class="font-medium text-foreground">Optimistic (O)</span> best-case, <span class="font-medium text-foreground">Most Likely (M)</span> realistic, and <span class="font-medium text-foreground">Pessimistic (P)</span> worst-case hour estimate.
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
                      Enter your target deadline in hours under <span class="font-medium text-foreground">Desired Completion Time (D)</span>. The tool calculates a Z-score and maps it to an on-time probability.
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
                      Aim for <span class="font-medium text-foreground">≥ 80%</span> for reliable delivery. Below 50% signals the deadline is too aggressive.
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
                      Edit estimates directly in the table, reorder tasks by dragging, or use the pencil/X icons for detailed edits. Use the <span class="font-medium text-foreground">Retain Milestone</span> checkbox to quickly add multiple tasks to the same milestone.
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
                      <span class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">E</span>
                    </div>
                    <code class="block font-mono text-xs bg-background border border-border rounded-md px-3 py-2 text-center tracking-wide">E = (O + 4M + P) / 6</code>
                    <p class="text-[11px] text-muted-foreground leading-relaxed">
                      Weighted average that emphasises the most likely estimate 4×.
                    </p>
                  </div>
                  <div class="rounded-lg border border-primary/50 bg-muted/40 p-3 space-y-1.5">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-xs font-medium">
                        Variance
                      </p>
                      <span class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">σ²</span>
                    </div>
                    <code class="block font-mono text-xs bg-background border border-border rounded-md px-3 py-2 text-center tracking-wide">σ² = ((P − O) / 6)²</code>
                    <p class="text-[11px] text-muted-foreground leading-relaxed">
                      Measures uncertainty. Higher variance means a wider spread between best and worst case.
                    </p>
                  </div>
                  <div class="rounded-lg border border-primary/50 bg-muted/40 p-3 space-y-1.5">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-xs font-medium">
                        Standard Deviation
                      </p>
                      <span class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">σ</span>
                    </div>
                    <code class="block font-mono text-xs bg-background border border-border rounded-md px-3 py-2 text-center tracking-wide">σ = (P − O) / 6</code>
                    <p class="text-[11px] text-muted-foreground leading-relaxed">
                      Square root of variance. Used to compute the Z-score for probability lookup.
                    </p>
                  </div>
                  <div class="rounded-lg border border-primary/50 bg-muted/40 p-3 space-y-1.5">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-xs font-medium">
                        Z-Score
                      </p>
                      <span class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Z</span>
                    </div>
                    <code class="block font-mono text-xs bg-background border border-border rounded-md px-3 py-2 text-center tracking-wide">Z = (D − ΣE) / √Σσ²</code>
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
                    Set O, M, and P to the same value. Variance becomes zero, indicating full confidence in that estimate.
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs font-medium">
                    What does a negative Z-score mean?
                  </p>
                  <p class="text-xs text-muted-foreground leading-relaxed">
                    Your desired time is shorter than the expected total — probability drops below 50%, meaning the project is likely to overrun.
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs font-medium">
                    How do I export the results?
                  </p>
                  <p class="text-xs text-muted-foreground leading-relaxed">
                    Use the <span class="font-medium text-foreground">Export</span> button in the Task Breakdown section to download an Excel file. Note that you must set a Desired Completion Time (D) before exporting.
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs font-medium">
                    What does "Retain Milestone" do?
                  </p>
                  <p class="text-xs text-muted-foreground leading-relaxed">
                    When checked, the milestone value is preserved for the next task you add. This is useful when adding multiple tasks to the same milestone.
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs font-medium">
                    Can I edit estimates directly?
                  </p>
                  <p class="text-xs text-muted-foreground leading-relaxed">
                    Yes! Click on any O, M, or P value in the task table to edit it directly. The PERT calculations update automatically.
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
          <div class="px-5 py-4 border-t border-border shrink-0">
            <Button
              class="w-full font-mono text-xs"
              @click="showInfoDialog = false"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <!-- Edit Task Dialog (unchanged) -->
      <Dialog v-model:open="showEditDialog">
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
                    <NumberFieldContent><NumberFieldInput /></NumberFieldContent>
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
                    <NumberFieldContent><NumberFieldInput /></NumberFieldContent>
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
                    <NumberFieldContent><NumberFieldInput /></NumberFieldContent>
                  </NumberField>
                </div>
              </div>
            </div>
          </div>
          <div class="px-5 py-4 border-t border-border shrink-0 flex gap-2">
            <Button
              variant="outline"
              class="flex-1 font-mono text-xs"
              @click="showEditDialog = false"
            >
              Cancel
            </Button>
            <Button
              class="flex-1 font-mono text-xs"
              :disabled="!editTaskForm.taskName.trim() || editTaskForm.optimistic === null || editTaskForm.mostLikely === null || editTaskForm.pessimistic === null"
              @click="saveEditTask()"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <!-- Delete Confirmation Dialog -->
      <Dialog v-model:open="showDeleteDialog">
        <DialogContent class="flex flex-col gap-0 p-0 max-w-md w-[calc(100vw-2rem)] rounded-xl overflow-hidden">
          <DialogHeader class="px-5 pt-5 pb-4 border-b border-border shrink-0">
            <DialogTitle class="flex items-center gap-2 text-sm text-destructive">
              <div class="w-7 h-7 rounded-md bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle class="w-3.5 h-3.5" />
              </div>
              Delete Task
            </DialogTitle>
            <DialogDescription class="text-xs mt-1">
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div class="px-5 py-4 space-y-4">
            <p class="text-sm">
              Are you sure you want to delete this task?
            </p>
            <div class="flex items-center gap-3 pt-2">
              <Checkbox
                id="dontShowDeleteWarning"
                :model-value="!projectStore.deleteWarning"
                @update:model-value="projectStore.deleteWarning = !$event"
              />
              <Label
                for="dontShowDeleteWarning"
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
              @click="showDeleteDialog = false"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              class="flex-1 font-mono text-xs"
              @click="confirmDeleteTask()"
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
import { ref, reactive, onMounted, watch } from 'vue'
import ExcelJS from 'exceljs';
import { useRouter } from 'vue-router'
import type { NewTask } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { NumberField, NumberFieldContent, NumberFieldInput } from '@/components/ui/number-field'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeft, Download, X, RotateCcw, Info, Plus, HelpCircle, Star, Target, AlertTriangle, CalendarClock, Pencil, GripVertical } from 'lucide-vue-next'
import { VueDraggable } from 'vue-draggable-plus'
import { useProjectStore } from '@/stores/projectStore'
import { toast } from 'vue-sonner'

const router = useRouter()
const projectStore = useProjectStore()
const showInfoDialog = ref(false)
const showEditDialog = ref(false)
const editingTaskIndex = ref<number | null>(null)
const showDeleteDialog = ref(false)
const deleteTaskIndex = ref<number | null>(null)

const editTaskForm = reactive({
  taskName: '',
  milestone: '',
  description: '',
  optimistic: null as number | null,
  mostLikely: null as number | null,
  pessimistic: null as number | null,
})

const newTaskForm = reactive<NewTask>({
  taskName: '',
  milestone: '',
  description: '',
  optimistic: null,
  mostLikely: null,
  pessimistic: null,
})

function resetTaskForm(): void {
  newTaskForm.taskName = ''
  newTaskForm.description = ''
  if (!projectStore.retainMilestone) newTaskForm.milestone = ''
  newTaskForm.optimistic = null
  newTaskForm.mostLikely = null
  newTaskForm.pessimistic = null
}

function openEditDialog(index: number): void {
  const task = projectStore.taskList[index]
  if (task) {
    editingTaskIndex.value = index
    editTaskForm.taskName = task.taskName
    editTaskForm.milestone = task.milestone
    editTaskForm.description = task.description
    editTaskForm.optimistic = task.optimistic
    editTaskForm.mostLikely = task.mostLikely
    editTaskForm.pessimistic = task.pessimistic
    showEditDialog.value = true
  }
}

function saveEditTask(): void {
  if (!editTaskForm.taskName.trim()) { toast.error('Task name is required'); return }
  if (!editTaskForm.milestone.trim()) { toast.error('Milestone is required'); return }
  if (editTaskForm.optimistic == null || editTaskForm.mostLikely == null || editTaskForm.pessimistic == null) {
    const missing = []
    if (editTaskForm.optimistic == null) missing.push('Optimistic (O)')
    if (editTaskForm.mostLikely == null) missing.push('Most Likely (M)')
    if (editTaskForm.pessimistic == null) missing.push('Pessimistic (P)')
    toast.error(`Please fill in: ${missing.join(', ')}`)
    return
  }
  if (editingTaskIndex.value !== null) {
    projectStore.editTask(editingTaskIndex.value, {
      taskName: editTaskForm.taskName,
      milestone: editTaskForm.milestone,
      description: editTaskForm.description,
      optimistic: editTaskForm.optimistic,
      mostLikely: editTaskForm.mostLikely,
      pessimistic: editTaskForm.pessimistic,
    })
    showEditDialog.value = false
    editingTaskIndex.value = null
    toast.success('Task updated successfully!')
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

function openDeleteDialog(index: number): void {
  if (projectStore.deleteWarning) {
    deleteTaskIndex.value = index
    showDeleteDialog.value = true
  } else {
    projectStore.removeTask(index)
    toast.success('Task deleted successfully!')
  }
}

function addTask(): void {
  if (!projectStore.addTask(newTaskForm)) {
    const missing = []
    if (newTaskForm.optimistic === null) missing.push('Optimistic (O)')
    if (newTaskForm.mostLikely === null) missing.push('Most Likely (M)')
    if (newTaskForm.pessimistic === null) missing.push('Pessimistic (P)')
    toast.error(`Please fill in all fields: ${missing.join(', ')}`)
    return
  }
  resetTaskForm()
  toast.success('Task added successfully!')
}

function goToHome(): void {
  router.push('/')
}

function exportToExcel(): void {
  if (projectStore.targetDuration === null) {
    toast.error('Please add a Desired Completion Time (D) before exporting')
    return
  }
  const workbook = new ExcelJS.Workbook()
  const taskSheet = workbook.addWorksheet('Task Breakdown')
  taskSheet.columns = [
    { header: 'Milestone', key: 'milestone', width: 25 },
    { header: 'Task Name', key: 'taskName', width: 30 },
    { header: 'Description', key: 'description', width: 50 },
    { header: 'Optimistic (O)', key: 'optimistic', width: 16 },
    { header: 'Most Likely (M)', key: 'mostLikely', width: 16 },
    { header: 'Pessimistic (P)', key: 'pessimistic', width: 16 },
    { header: 'Expected', key: 'expectedTime', width: 16 },
    { header: 'Std Dev', key: 'standardDeviation', width: 16 },
    { header: 'Variance', key: 'variance', width: 16 },
  ]
  projectStore.taskList.forEach((task) => {
    taskSheet.addRow({
      milestone: task.milestone || 'Uncategorized',
      taskName: task.taskName,
      description: task.description || '',
      optimistic: task.optimistic,
      mostLikely: task.mostLikely,
      pessimistic: task.pessimistic,
      expectedTime: parseFloat(task.expectedTime.toFixed(2)),
      standardDeviation: parseFloat(task.standardDeviation.toFixed(3)),
      variance: parseFloat(task.variance.toFixed(3)),
    })
  })
  taskSheet.addRow([])
  const totalRow = taskSheet.addRow({
    taskName: 'TOTALS',
    expectedTime: parseFloat(projectStore.pertAnalysis.totalExpectedTime.toFixed(2)),
    variance: parseFloat(projectStore.pertAnalysis.totalVariance.toFixed(3)),
  })
  totalRow.font = { bold: true }
  totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F0F0' } }
  const taskHeader = taskSheet.getRow(1)
  taskHeader.font = { bold: true }
  taskHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } }
  taskHeader.alignment = { horizontal: 'center' }
  const analysisSheet = workbook.addWorksheet('PERT Analysis')
  analysisSheet.columns = [
    { header: 'Metric', key: 'metric', width: 35 },
    { header: 'Value', key: 'value', width: 20 },
  ]
  const analysisHeader = analysisSheet.getRow(1)
  analysisHeader.font = { bold: true }
  analysisHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } }
  const { totalExpectedTime, totalVariance, zScore, probability } = projectStore.pertAnalysis
  const analysisRows = [
    { metric: 'Desired Completion Time (D)', value: projectStore.targetDuration },
    { metric: 'Total Expected Time', value: parseFloat(totalExpectedTime.toFixed(2)) },
    { metric: 'Total Variance', value: parseFloat(totalVariance.toFixed(3)) },
    { metric: 'Standard Deviation', value: parseFloat(Math.sqrt(totalVariance).toFixed(3)) },
    { metric: 'Z-Score', value: parseFloat(zScore.toFixed(3)) },
    { metric: 'On-Time Probability (%)', value: parseFloat(probability.toFixed(1)) },
  ]
  analysisRows.forEach((row) => analysisSheet.addRow(row))
  const probabilityRow = analysisSheet.getRow(analysisSheet.rowCount)
  probabilityRow.font = { bold: true }
  probabilityRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } }
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const YY = String(now.getFullYear()).slice(2)
  const MM = pad(now.getMonth() + 1)
  const DD = pad(now.getDate())
  const HH = pad(now.getHours())
  const SS = pad(now.getSeconds())
  const timestamp = `${YY}-${MM}-${DD}_${HH}-${SS}`
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ManHoursEstimation_${timestamp}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  })
}

onMounted(() => {
  projectStore.loadFromStorage()
})

watch(() => projectStore.taskList, () => {
  projectStore.saveToStorage()
}, { deep: true })
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

@media (min-width: 400px) {
  .xs\:inline { display: inline; }
}
</style>