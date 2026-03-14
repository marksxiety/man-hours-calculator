<template>
    <div class="flex flex-1 flex-col gap-6 p-6">

        <!-- Top row: Add Task + Probability -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

            <!-- Add New Task -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                <div class="mb-5">
                    <h2 class="text-lg font-semibold">Add New Task</h2>
                    <p class="text-sm text-muted-foreground">
                        Enter task estimates to update the PERT model.
                    </p>
                </div>

                <div class="space-y-4">
                    <div class="grid gap-2">
                        <Label for="taskName">Task Name</Label>
                        <Input id="taskName" v-model="newTask.taskName" type="text"
                            placeholder="e.g. API Integration" />
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div class="grid gap-2">
                            <Label class="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                                Optimistic (O)
                            </Label>
                            <NumberField v-model="newTask.optimistic" :min="0"
                                :format-options="{ minimumFractionDigits: 1 }">
                                <NumberFieldContent>
                                    <NumberFieldInput />
                                </NumberFieldContent>
                            </NumberField>
                        </div>
                        <div class="grid gap-2">
                            <Label class="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                                Most Likely (M)
                            </Label>
                            <NumberField v-model="newTask.mostLikely" :min="0"
                                :format-options="{ minimumFractionDigits: 1 }">
                                <NumberFieldContent>
                                    <NumberFieldInput />
                                </NumberFieldContent>
                            </NumberField>
                        </div>
                        <div class="grid gap-2">
                            <Label class="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                                Pessimistic (P)
                            </Label>
                            <NumberField v-model="newTask.pessimistic" :min="0"
                                :format-options="{ minimumFractionDigits: 1 }">
                                <NumberFieldContent>
                                    <NumberFieldInput />
                                </NumberFieldContent>
                            </NumberField>
                        </div>
                    </div>

                    <Button :disabled="!newTask.taskName.trim()" class="w-full font-mono">
                        Add Task
                    </Button>
                </div>
            </div>

            <!-- Project Probability -->
            <div class="flex flex-col rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm">
                <div class="mb-5">
                    <h2 class="text-lg font-semibold">Project Probability</h2>
                    <p class="text-sm text-muted-foreground">Statistical Confidence Analysis</p>
                </div>

                <div class="grid flex-1 gap-4">
                    <div class="grid gap-2">
                        <Label for="desiredTime" class="text-sm font-medium">
                            Desired Completion Time (D)
                        </Label>
                        <NumberField v-model="desiredTime" :min="0" :format-options="{ minimumFractionDigits: 1 }">
                            <NumberFieldContent>
                                <NumberFieldInput class="bg-background" />
                            </NumberFieldContent>
                        </NumberField>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <!-- Total Expected -->
                        <div class="rounded-lg border border-border/50 bg-muted/50 p-3">
                            <div class="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                                Total Expected (T<sub>e</sub>)
                            </div>
                            <div class="text-xl font-bold tabular-nums">
                                {{ analysis.totalExpectedTime.toFixed(2) }}
                            </div>
                            <div class="mt-1 text-[10px] leading-tight text-muted-foreground">
                                Sum of Expected
                            </div>
                        </div>

                        <!-- Total Variance -->
                        <div class="rounded-lg border border-border/50 bg-muted/50 p-3">
                            <div class="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                                Total Variance (σ<sup>2</sup>)
                            </div>
                            <div class="text-xl font-bold tabular-nums">
                                {{ analysis.totalVariance.toFixed(3) }}
                            </div>
                            <div class="mt-1 text-[10px] leading-tight text-muted-foreground">
                                Sum of Variances
                            </div>
                        </div>

                        <!-- Z-Score -->
                        <div class="rounded-lg border border-border/50 bg-muted/50 p-3">
                            <div class="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                                Z-Score
                            </div>
                            <div class="text-xl font-bold tabular-nums">
                                {{ analysis.zScore.toFixed(3) }}
                            </div>
                            <div class="mt-1 text-[10px] leading-tight text-muted-foreground">
                                (Desired − Expected) / √Variance
                            </div>
                        </div>

                        <!-- On-Time Probability -->
                        <div class="rounded-lg border border-primary/30 bg-primary/10 p-3 shadow-sm">
                            <div class="text-[10px] font-bold tracking-widest uppercase text-primary">
                                On-Time Probability
                            </div>
                            <div class="text-2xl font-black tabular-nums text-primary">
                                {{ analysis.probability.toFixed(1) }}%
                            </div>
                            <div class="mt-1 text-[10px] leading-tight text-primary/70 italic">
                                Based on Z-score lookup
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Task Breakdown Table -->
        <div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm">
            <div class="border-b bg-muted/30 px-6 py-4">
                <h3 class="font-semibold">Task Breakdown</h3>
                <p class="text-xs text-muted-foreground mt-0.5">
                    All PERT calculations per task — expected duration, standard deviation, and variance.
                </p>
            </div>

            <div class="px-4 py-2">
                <Table>
                    <TableHeader>
                        <TableRow class="bg-muted/20">
                            <TableHead>Task Name</TableHead>
                            <TableHead class="text-right">O</TableHead>
                            <TableHead class="text-right">M</TableHead>
                            <TableHead class="text-right">P</TableHead>
                            <TableHead class="text-right font-bold text-primary">Expected (tₑ)</TableHead>
                            <TableHead class="text-right">Std Dev (σ)</TableHead>
                            <TableHead class="text-right">Variance (σ²)</TableHead>
                            <TableHead class="text-right" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        <TableRow>
                            <TableCell colspan="8" class="py-16 text-center text-muted-foreground text-sm">
                                No tasks added yet. Start by adding a task above.
                            </TableCell>
                        </TableRow>
                    </TableBody>

                    <TableFooter>
                        <TableRow class="bg-muted/50 font-bold">
                            <TableCell>Totals</TableCell>
                            <TableCell colspan="3" />
                            <TableCell class="text-right text-primary">—</TableCell>
                            <TableCell />
                            <TableCell class="text-right">—</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>

            <div class="border-t px-6 py-3 text-center text-[11px] italic text-muted-foreground">
                Formula: tₑ = (O + 4M + P) / 6 &nbsp;·&nbsp; σ = (P − O) / 6 &nbsp;·&nbsp; σ² = σ × σ
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { NewTask, Analysis } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldInput,
} from '@/components/ui/number-field'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

const newTask = reactive<NewTask>({ taskName: '', optimistic: 0, mostLikely: 0, pessimistic: 0 })
const desiredTime = ref(0)
const analysis = reactive<Analysis>({
    totalExpectedTime: 0,
    totalVariance: 0,
    zScore: 0,
    probability: 0,
})
</script>