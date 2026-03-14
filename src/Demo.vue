<template>
    <div class="relative flex flex-1 flex-col gap-4 px-8 py-10 max-w-4xl mx-auto w-full">

        <!-- Section label -->
        <div>
            <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
                PERT Analysis
            </p>
            <div class="flex justify-start items-center gap-4">
                <div class="hover:bg-neutral-300 rounded-lg p-2" @click="goToHome()">
                    <ChevronLeft />
                </div>
                <h1 class="text-2xl font-bold tracking-tight">Project Estimator</h1>
            </div>

            <p class="text-sm text-muted-foreground mt-1">
                Add tasks with three-point estimates. The model updates automatically.
            </p>
        </div>

        <!-- Top row: Add Task + Probability -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

            <!-- Add New Task -->
            <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div class="mb-5">
                    <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
                        Input
                    </p>
                    <h2 class="text-base font-semibold tracking-tight">Add New Task</h2>
                    <p class="text-xs text-muted-foreground mt-0.5">
                        Enter task estimates to update the PERT model.
                    </p>
                </div>

                <div class="space-y-4">
                    <div class="grid gap-2">
                        <Label for="taskName" class="text-xs font-medium">Task Name</Label>
                        <Input id="taskName" v-model="newTask.taskName" type="text"
                            placeholder="e.g. API Integration" />
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div class="grid gap-2">
                            <Label class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
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
                            <Label class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
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
                            <Label class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
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

                    <Button :disabled="!newTask.taskName.trim()" class="w-full font-mono" @click="AddTask()">
                        Add Task
                    </Button>
                </div>
            </div>

            <!-- Project Probability -->
            <div class="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
                <div class="mb-5">
                    <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
                        Analysis
                    </p>
                    <h2 class="text-base font-semibold tracking-tight">Project Probability</h2>
                    <p class="text-xs text-muted-foreground mt-0.5">Statistical confidence analysis</p>
                </div>

                <div class="grid flex-1 gap-4">
                    <div class="grid gap-2">
                        <Label for="desiredTime" class="text-xs font-medium">
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
                            <div class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                                Total Expected (T<sub>e</sub>)
                            </div>
                            <div class="text-xl font-bold tabular-nums mt-1">
                                {{ analysis.totalExpectedTime.toFixed(2) }}
                            </div>
                            <div class="mt-1 text-[10px] leading-tight text-muted-foreground">
                                Sum of expected durations
                            </div>
                        </div>

                        <!-- Total Variance -->
                        <div class="rounded-lg border border-border/50 bg-muted/50 p-3">
                            <div class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                                Total Variance (σ<sup>2</sup>)
                            </div>
                            <div class="text-xl font-bold tabular-nums mt-1">
                                {{ analysis.totalVariance.toFixed(3) }}
                            </div>
                            <div class="mt-1 text-[10px] leading-tight text-muted-foreground">
                                Higher = less confident
                            </div>
                        </div>

                        <!-- Z-Score -->
                        <div class="rounded-lg border border-border/50 bg-muted/50 p-3">
                            <div class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                                Z-Score
                            </div>
                            <div class="text-xl font-bold tabular-nums mt-1">
                                {{ analysis.zScore.toFixed(3) }}
                            </div>
                            <div class="mt-1 text-[10px] leading-tight text-muted-foreground">
                                (D − T<sub>e</sub>) / √σ²
                            </div>
                        </div>

                        <!-- On-Time Probability -->
                        <div class="rounded-lg border border-primary/30 bg-primary/10 p-3 shadow-sm">
                            <div class="font-mono text-[10px] tracking-widest uppercase text-primary">
                                On-Time Probability
                            </div>
                            <div class="text-2xl font-black tabular-nums text-primary mt-1">
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

        <Separator />
        <!-- Task Breakdown Table -->
        <div>
            <div class="flex items-center justify-between bg-muted/30 pb-4">
                <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                    Task Breakdown
                </p>
                <Button variant="outline" size="sm" class="gap-2">
                    <Download />
                    Export Excel
                </Button>
            </div>

            <div class="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow class="bg-muted/30">
                            <TableHead class="font-mono text-[10px] tracking-widest uppercase">Task Name</TableHead>
                            <TableHead class="text-right font-mono text-[10px] tracking-widest uppercase">O</TableHead>
                            <TableHead class="text-right font-mono text-[10px] tracking-widest uppercase">M</TableHead>
                            <TableHead class="text-right font-mono text-[10px] tracking-widest uppercase">P</TableHead>
                            <TableHead class="text-right font-mono text-[10px] tracking-widest uppercase text-primary">
                                Expected (tₑ)
                            </TableHead>
                            <TableHead class="text-right font-mono text-[10px] tracking-widest uppercase">Std Dev (σ)
                            </TableHead>
                            <TableHead class="text-right font-mono text-[10px] tracking-widest uppercase">Variance (σ²)
                            </TableHead>
                            <TableHead class="text-right" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>

                        <TableRow v-if="taskList.length === 0">
                            <TableCell colspan="8" class="py-16 text-center text-sm text-muted-foreground">
                                No tasks added yet. Start by adding a task above.
                            </TableCell>
                        </TableRow>

                        <TableRow v-else v-for="(task, index) in taskList" :key="index">
                            <TableCell class="font-medium">{{
                                task.taskName
                            }}</TableCell>
                            <TableCell class="text-right">{{
                                task.optimistic.toFixed(1)
                            }}</TableCell>
                            <TableCell class="text-right">{{
                                task.mostLikely.toFixed(1)
                            }}</TableCell>
                            <TableCell class="text-right">{{
                                task.pessimistic.toFixed(1)
                            }}</TableCell>
                            <TableCell class="text-right font-bold">{{
                                task.expectedTime.toFixed(2)
                            }}</TableCell>
                            <TableCell class="text-right">{{
                                task.standardDeviation.toFixed(3)
                            }}</TableCell>
                            <TableCell class="text-right">{{
                                task.variance.toFixed(3)
                            }}</TableCell>
                        </TableRow>
                    </TableBody>

                    <TableFooter>
                        <TableRow class="bg-muted/40 font-bold">
                            <TableCell class="font-mono text-xs">Totals</TableCell>
                            <TableCell colspan="3" />
                            <TableCell class="text-right text-primary">—</TableCell>
                            <TableCell />
                            <TableCell class="text-right">—</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableFooter>
                </Table>

                <div class="border-t px-6 py-3 text-center font-mono text-[10px] tracking-wide text-muted-foreground">
                    tₑ = (O + 4M + P) / 6 &nbsp;·&nbsp; σ = (P − O) / 6 &nbsp;·&nbsp; σ² = σ × σ
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { NewTask, Analysis, PERTTaskResult } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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
import { ChevronLeft, Download } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { calculateExpectedTime } from '@/utils/calculateExpectedTime'
import { calculateStandardDeviation } from '@/utils/calculateStandardDeviation'
import { calculateVariance } from '@/utils/calculateVariance'

const router = useRouter()
const goToHome = () => router.push('/')

const taskList = reactive<PERTTaskResult[]>([]);

const newTask = reactive<NewTask>({ taskName: '', optimistic: 0, mostLikely: 0, pessimistic: 0 })
const desiredTime = ref<number>(0)
const analysis = reactive<Analysis>({
    totalExpectedTime: 0,
    totalVariance: 0,
    zScore: 0,
    probability: 0,
})

const AddTask = () => {
    const expectedTime = calculateExpectedTime(newTask)
    const standardDeviation = calculateStandardDeviation(newTask)
    const variance = calculateVariance(standardDeviation)

    taskList.push({
        taskName: newTask.taskName,
        optimistic: newTask.optimistic,
        mostLikely: newTask.mostLikely,
        pessimistic: newTask.pessimistic,
        expectedTime,
        standardDeviation,
        variance
    })
    console.log(taskList)

    newTask.taskName = ''
    newTask.optimistic = 0
    newTask.mostLikely = 0
    newTask.pessimistic = 0
}
</script>