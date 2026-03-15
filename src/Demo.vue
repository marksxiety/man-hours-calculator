<template>
    <div class="relative z-10 max-w-4xl mx-auto px-8 pt-16 pb-28 w-full">

        <!-- Header -->
        <div class="mb-10">
            <Badge variant="outline" class="mb-6 font-mono text-xs tracking-widest uppercase">
                PERT Analysis
            </Badge>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <Button variant="ghost" size="icon" class="-ml-2" @click="goToHome()">
                        <ChevronLeft class="w-4 h-4" />
                    </Button>
                    <h1 class="text-3xl font-bold tracking-tight">Man Hours Estimator</h1>
                </div>
                <Button variant="outline" size="icon">
                    <Info class="w-4 h-4" />
                </Button>
            </div>
        </div>

        <!-- Top row: Add Task + Probability -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">

            <!-- Add New Task -->
            <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div class="mb-5">
                    <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">Input</p>
                    <h2 class="text-base font-semibold tracking-tight">Add New Task</h2>
                    <p class="text-xs text-muted-foreground mt-0.5">
                        Add tasks with three-point estimates. The model updates automatically.
                    </p>
                </div>

                <div class="space-y-4">
                    <div class="grid gap-2">
                        <Label for="taskName" class="text-xs font-medium">Task Name</Label>
                        <Input id="taskName" v-model="newTaskForm.taskName" type="text"
                            placeholder="e.g. API Integration" />
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div class="grid gap-2">
                            <Label class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                                Optimistic (O)
                            </Label>
                            <NumberField v-model="newTaskForm.optimistic" :min="0"
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
                            <NumberField v-model="newTaskForm.mostLikely" :min="0"
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
                            <NumberField v-model="newTaskForm.pessimistic" :min="0"
                                :format-options="{ minimumFractionDigits: 1 }">
                                <NumberFieldContent>
                                    <NumberFieldInput />
                                </NumberFieldContent>
                            </NumberField>
                        </div>
                    </div>

                    <Button :disabled="!newTaskForm.taskName.trim()" class="w-full font-mono gap-2" @click="addTask()">
                        <Plus class="w-4 h-4" />
                        Add Task
                    </Button>
                </div>
            </div>

            <!-- Project Probability -->
            <div class="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
                <div class="mb-5">
                    <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">Analysis</p>
                    <h2 class="text-base font-semibold tracking-tight">Project Probability</h2>
                    <p class="text-xs text-muted-foreground mt-0.5">Statistical confidence analysis</p>
                </div>

                <div class="grid flex-1 gap-4">
                    <div class="grid gap-2">
                        <Label for="targetDuration" class="text-xs font-medium">
                            Desired Completion Time (D)
                        </Label>
                        <NumberField v-model="targetDuration" :min="0" :format-options="{ minimumFractionDigits: 1 }">
                            <NumberFieldContent>
                                <NumberFieldInput class="bg-background" />
                            </NumberFieldContent>
                        </NumberField>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="rounded-lg border border-border/50 bg-muted/50 p-3">
                            <div class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                                Total Expected (T<sub>e</sub>)
                            </div>
                            <div class="text-xl font-bold tabular-nums mt-1">
                                {{ pertAnalysis.totalExpectedTime.toFixed(2) }}
                            </div>
                            <div class="mt-1 text-[10px] leading-tight text-muted-foreground">
                                Sum of expected durations
                            </div>
                        </div>

                        <div class="rounded-lg border border-border/50 bg-muted/50 p-3">
                            <div class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                                Total Variance (σ<sup>2</sup>)
                            </div>
                            <div class="text-xl font-bold tabular-nums mt-1">
                                {{ pertAnalysis.totalVariance.toFixed(3) }}
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
                                {{ pertAnalysis.zScore.toFixed(3) }}
                            </div>
                            <div class="mt-1 text-[10px] leading-tight text-muted-foreground">
                                (D − T<sub>e</sub>) / √σ²
                            </div>
                        </div>

                        <div class="rounded-lg border border-primary/30 bg-primary/10 p-3 shadow-sm">
                            <div class="font-mono text-[10px] tracking-widest uppercase text-primary">
                                On-Time Probability
                            </div>
                            <div class="text-2xl font-black tabular-nums text-primary mt-1">
                                {{ pertAnalysis.probability.toFixed(1) }}%
                            </div>
                            <div class="mt-1 text-[10px] leading-tight text-primary/70 italic">
                                Based on Z-score lookup
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Separator class="mb-6" />

        <!-- Task Breakdown -->
        <div>
            <div class="flex items-center justify-between mb-4">
                <p class="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                    Task Breakdown
                </p>
                <div class="flex gap-2">
                    <Button variant="outline" size="sm" class="gap-2 font-mono" @click="exportToExcel()"
                        :disabled="taskList.length === 0">
                        <Download class="w-3.5 h-3.5" />
                        Export
                    </Button>
                    <Button size="sm" class="gap-2 font-mono" @click="resetAll()">
                        <RotateCcw class="w-3.5 h-3.5" />
                        Reset
                    </Button>
                </div>
            </div>

            <Card class="overflow-hidden shadow-sm p-2">
                <CardContent class="p-0 h-auto">
                    <ScrollArea class="h-80">
                        <Table class="overflow-hidden">
                            <TableHeader>
                                <TableRow class="sticky top-0 z-10 bg-muted/30">
                                    <TableHead class="font-mono text-[10px] tracking-widest uppercase">Task Name
                                    </TableHead>
                                    <TableHead class="text-right font-mono text-[10px] tracking-widest uppercase">O
                                    </TableHead>
                                    <TableHead class="text-right font-mono text-[10px] tracking-widest uppercase">M
                                    </TableHead>
                                    <TableHead class="text-right font-mono text-[10px] tracking-widest uppercase">P
                                    </TableHead>
                                    <TableHead
                                        class="text-right font-mono text-[10px] tracking-widest uppercase text-primary">
                                        Expected (tₑ)
                                    </TableHead>
                                    <TableHead class="text-right font-mono text-[10px] tracking-widest uppercase">Std
                                        Dev (σ)
                                    </TableHead>
                                    <TableHead class="text-right font-mono text-[10px] tracking-widest uppercase">
                                        Variance (σ²)
                                    </TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                <TableRow v-if="taskList.length === 0">
                                    <TableCell colspan="8" class="py-16 text-center text-sm text-muted-foreground">
                                        No tasks added yet. Start by adding a task above.
                                    </TableCell>
                                </TableRow>

                                <TableRow v-else v-for="(task, index) in taskList" :key="index"
                                    class="transition-colors duration-150">
                                    <TableCell class="font-medium">{{ task.taskName }}</TableCell>
                                    <TableCell class="text-right">{{ task.optimistic.toFixed(1) }}</TableCell>
                                    <TableCell class="text-right">{{ task.mostLikely.toFixed(1) }}</TableCell>
                                    <TableCell class="text-right">{{ task.pessimistic.toFixed(1) }}</TableCell>
                                    <TableCell class="text-right font-bold">{{ task.expectedTime.toFixed(2) }}
                                    </TableCell>
                                    <TableCell class="text-right">{{ task.standardDeviation.toFixed(3) }}</TableCell>
                                    <TableCell class="text-right">{{ task.variance.toFixed(3) }}</TableCell>
                                    <TableCell class="text-right">
                                        <Button variant="ghost" size="icon"
                                            class="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            @click="removeTask(index)">
                                            <X class="w-3.5 h-3.5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import ExcelJS from 'exceljs';
import { useRouter } from 'vue-router'
import type { NewTask, Analysis, PERTTaskResult } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { NumberField, NumberFieldContent, NumberFieldInput } from '@/components/ui/number-field'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeft, Download, X, RotateCcw, Info, Plus } from 'lucide-vue-next'
import { calculateExpectedTime } from '@/utils/calculateExpectedTime'
import { calculateStandardDeviation } from '@/utils/calculateStandardDeviation'
import { calculateVariance } from '@/utils/calculateVariance'
import { calculateTotalExpectedTime, calculateTotalVariance } from '@/utils/calculateTotals'
import { calculateZScore } from '@/utils/calculateZScore'
import { calculateProbability } from '@/utils/calculateProbability'

const router = useRouter()

const taskList = reactive<PERTTaskResult[]>([])
const newTaskForm = reactive<NewTask>({
    taskName: '',
    optimistic: 0,
    mostLikely: 0,
    pessimistic: 0,
})
const targetDuration = ref<number>(35)

const pertAnalysis = computed<Analysis>(() => {
    const totalExpectedTime = calculateTotalExpectedTime(taskList)
    const totalVariance = calculateTotalVariance(taskList)
    const zScore = taskList.length === 0 ? 0 : calculateZScore(targetDuration.value, totalExpectedTime, totalVariance)
    const probability = taskList.length === 0 ? 0 : calculateProbability(zScore) * 100
    return { totalExpectedTime, totalVariance, zScore, probability }
})

function resetTaskForm(): void {
    newTaskForm.taskName = ''
    newTaskForm.optimistic = 0
    newTaskForm.mostLikely = 0
    newTaskForm.pessimistic = 0
}

function resetAll(): void {
    resetTaskForm()
    targetDuration.value = 0
    taskList.length = 0
}

function addTask(): void {
    const expectedTime = calculateExpectedTime(newTaskForm)
    const standardDeviation = calculateStandardDeviation(newTaskForm)
    const variance = calculateVariance(standardDeviation)
    taskList.push({
        taskName: newTaskForm.taskName,
        optimistic: newTaskForm.optimistic,
        mostLikely: newTaskForm.mostLikely,
        pessimistic: newTaskForm.pessimistic,
        expectedTime,
        standardDeviation,
        variance,
    })
    resetTaskForm()
}

function removeTask(index: number): void {
    taskList.splice(index, 1)
}

function goToHome(): void {
    router.push('/')
}

function exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PERT Analysis');

    worksheet.columns = [
        { header: 'Task Name', key: 'taskName', width: 30 },
        { header: 'Expected', key: 'expected', width: 15 },
    ];

    taskList.forEach((task) => {
        worksheet.addRow({
            taskName: task.taskName,
            expected: task.expectedTime.toFixed(2),
        });
    });

    worksheet.addRow([]);
    worksheet.addRow({
        taskName: 'Total',
        expected: pertAnalysis.value.totalExpectedTime.toFixed(2),
    });

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
    };

    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Man_Hours_Analysis.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}
</script>