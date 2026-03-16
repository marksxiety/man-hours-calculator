<template>
  <div class="relative z-10 max-w-4xl mx-auto px-8 pt-16 pb-28 w-full">
    <!-- Header -->
    <div class="mb-10">
      <Badge
        variant="outline"
        class="mb-6 font-mono text-xs tracking-widest uppercase"
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
          <h1 class="text-3xl font-bold tracking-tight">
            Man Hours Estimator
          </h1>
        </div>
        <Button
          variant="outline"
          size="icon"
        >
          <Info class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Top row: Add Task + Probability -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
      <!-- Add New Task -->
      <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div class="mb-5">
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
          <Alert
            v-if="showAlert"
            :variant="alertType"
            class="transition-all duration-300"
          >
            <AlertCircle
              v-if="alertType === 'destructive'"
              class="w-4 h-4"
            />
            <CheckCircle
              v-else
              class="w-4 h-4 text-green-500"
            />
            <AlertTitle>{{ alertType === 'destructive' ? 'Missing Values' : 'Success' }}</AlertTitle>
            <AlertDescription>{{ alertMessage }}</AlertDescription>
          </Alert>
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

          <div class="grid grid-cols-3 gap-3">
            <div class="grid gap-2">
              <Label class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                Optimistic (O)
              </Label>
              <NumberField
                v-model="newTaskForm.optimistic"
                :min="0"
                :format-options="newTaskForm.optimistic !== null ? { minimumFractionDigits: 1 } : undefined"
              >
                <NumberFieldContent>
                  <NumberFieldInput />
                </NumberFieldContent>
              </NumberField>
            </div>
            <div class="grid gap-2">
              <Label class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                Most Likely (M)
              </Label>
              <NumberField
                v-model="newTaskForm.mostLikely"
                :min="0"
                :format-options="newTaskForm.mostLikely !== null ? { minimumFractionDigits: 1 } : undefined"
              >
                <NumberFieldContent>
                  <NumberFieldInput />
                </NumberFieldContent>
              </NumberField>
            </div>
            <div class="grid gap-2">
              <Label class="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                Pessimistic (P)
              </Label>
              <NumberField
                v-model="newTaskForm.pessimistic"
                :min="0"
                :format-options="newTaskForm.pessimistic !== null ? { minimumFractionDigits: 1 } : undefined"
              >
                <NumberFieldContent>
                  <NumberFieldInput />
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

      <!-- Project Probability -->
      <div class="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
        <div class="mb-5">
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
            <Label
              for="targetDuration"
              class="text-xs font-medium"
            >
              Desired Completion Time (D)
            </Label>
            <NumberField
              v-model="targetDuration"
              :min="0"
              :format-options="targetDuration !== null ? { minimumFractionDigits: 1 } : undefined"
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
                {{ pertAnalysis.totalExpectedTime.toFixed(2) }}
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
                (Target - Expected) / Std Dev
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
          <Button
            variant="outline"
            size="sm"
            class="gap-2 font-mono"
            :disabled="taskList.length === 0"
            @click="exportToExcel()"
          >
            <Download class="w-3.5 h-3.5" />
            Export
          </Button>
          <Button
            size="sm"
            class="gap-2 font-mono"
            @click="resetAll()"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </div>
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div class="overflow-x-auto overflow-y-auto max-h-80">
                <table class="w-full text-sm border-separate border-spacing-0">
                <thead class="bg-muted sticky top-0 z-10">
                    <tr class="text-xs font-semibold">
                    <th class="text-left text-muted-foreground px-4 py-2.5 border-b border-border">Task Name</th>
                    <th class="text-center text-muted-foreground px-4 py-2.5 border-b border-border">O</th>
                    <th class="text-center text-muted-foreground px-4 py-2.5 border-b border-border">M</th>
                    <th class="text-center text-muted-foreground px-4 py-2.5 border-b border-border">P</th>
                    <th class="text-center text-primary px-4 py-2.5 border-b border-border">Expected</th>
                    <th class="text-center text-muted-foreground px-4 py-2.5 border-b border-border">Std Dev</th>
                    <th class="text-center text-muted-foreground px-4 py-2.5 border-b border-border">Variance</th>
                    <th class="w-10 border-b border-border"></th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-border/50">
                    <tr v-if="taskList.length === 0">
                    <td colspan="8" class="py-16 text-center text-muted-foreground">
                        No tasks added yet. Start by adding a task above.
                    </td>
                    </tr>

                    <tr
                    v-for="(task, index) in taskList"
                    :key="index"
                    v-else
                    class="hover:bg-muted/20 transition-colors duration-150"
                    >
                    <td class="px-4 py-3 font-medium min-w-[200px]">{{ task.taskName }}</td>
                    <td class="px-4 py-3 text-center tabular-nums">{{ task.optimistic?.toFixed(1) ?? '' }}</td>
                    <td class="px-4 py-3 text-center tabular-nums">{{ task.mostLikely?.toFixed(1) ?? '' }}</td>
                    <td class="px-4 py-3 text-center tabular-nums">{{ task.pessimistic?.toFixed(1) ?? '' }}</td>
                    <td class="px-4 py-3 text-center font-bold tabular-nums text-primary">{{ task.expectedTime.toFixed(2) }}</td>
                    <td class="px-4 py-3 text-center tabular-nums">{{ task.standardDeviation.toFixed(3) }}</td>
                    <td class="px-4 py-3 text-center tabular-nums">{{ task.variance.toFixed(3) }}</td>
                    <td class="px-4 py-3 text-right">
                        <button
                        class="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        @click="removeTask(index)"
                        >
                        <X class="w-3.5 h-3.5" />
                        </button>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ChevronLeft, Download, X, RotateCcw, Info, Plus, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { calculateExpectedTime } from '@/utils/calculateExpectedTime'
import { calculateStandardDeviation } from '@/utils/calculateStandardDeviation'
import { calculateVariance } from '@/utils/calculateVariance'
import { calculateTotalExpectedTime, calculateTotalVariance } from '@/utils/calculateTotals'
import { calculateZScore } from '@/utils/calculateZScore'
import { calculateProbability } from '@/utils/calculateProbability'

const router = useRouter()

const taskList = reactive<PERTTaskResult[]>([
  { taskName: 'Project Kickoff', optimistic: 1, mostLikely: 2, pessimistic: 4, expectedTime: 2.17, standardDeviation: 0.5, variance: 0.25 },
  { taskName: 'Requirements Gathering', optimistic: 3, mostLikely: 5, pessimistic: 9, expectedTime: 5.33, standardDeviation: 1.0, variance: 1.0 },
  { taskName: 'System Architecture Design', optimistic: 4, mostLikely: 7, pessimistic: 12, expectedTime: 7.33, standardDeviation: 1.333, variance: 1.778 },
  { taskName: 'Database Schema Design', optimistic: 2, mostLikely: 4, pessimistic: 7, expectedTime: 4.17, standardDeviation: 0.833, variance: 0.694 },
  { taskName: 'API Integration', optimistic: 5, mostLikely: 8, pessimistic: 14, expectedTime: 8.5, standardDeviation: 1.5, variance: 2.25 },
  { taskName: 'Frontend UI Development', optimistic: 6, mostLikely: 10, pessimistic: 18, expectedTime: 10.67, standardDeviation: 2.0, variance: 4.0 },
  { taskName: 'Backend Logic Implementation', optimistic: 7, mostLikely: 12, pessimistic: 20, expectedTime: 12.5, standardDeviation: 2.167, variance: 4.694 },
  { taskName: 'Authentication & Auth Module', optimistic: 3, mostLikely: 5, pessimistic: 10, expectedTime: 5.5, standardDeviation: 1.167, variance: 1.361 },
  { taskName: 'Unit Testing', optimistic: 4, mostLikely: 6, pessimistic: 10, expectedTime: 6.33, standardDeviation: 1.0, variance: 1.0 },
  { taskName: 'Integration Testing', optimistic: 3, mostLikely: 5, pessimistic: 9, expectedTime: 5.33, standardDeviation: 1.0, variance: 1.0 },
  { taskName: 'Performance Optimization', optimistic: 2, mostLikely: 4, pessimistic: 8, expectedTime: 4.33, standardDeviation: 1.0, variance: 1.0 },
  { taskName: 'Security Audit', optimistic: 3, mostLikely: 6, pessimistic: 11, expectedTime: 6.33, standardDeviation: 1.333, variance: 1.778 },
  { taskName: 'User Acceptance Testing', optimistic: 4, mostLikely: 7, pessimistic: 13, expectedTime: 7.5, standardDeviation: 1.5, variance: 2.25 },
  { taskName: 'Deployment & CI/CD Setup', optimistic: 2, mostLikely: 4, pessimistic: 7, expectedTime: 4.17, standardDeviation: 0.833, variance: 0.694 },
  { taskName: 'Documentation & Handover', optimistic: 2, mostLikely: 3, pessimistic: 6, expectedTime: 3.33, standardDeviation: 0.667, variance: 0.444 },
])
const newTaskForm = reactive<NewTask>({
    taskName: '',
    optimistic: null,
    mostLikely: null,
    pessimistic: null,
})
const targetDuration = ref<number | null>(null)
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'destructive' | 'default'>('destructive')
let alertTimeout: ReturnType<typeof setTimeout> | null = null

const pertAnalysis = computed<Analysis>(() => {
    const totalExpectedTime = calculateTotalExpectedTime(taskList)
    const totalVariance = calculateTotalVariance(taskList)
    const zScore = taskList.length === 0 || targetDuration.value === null ? 0 : calculateZScore(targetDuration.value, totalExpectedTime, totalVariance)
    const probability = taskList.length === 0 ? 0 : calculateProbability(zScore) * 100
    return { totalExpectedTime, totalVariance, zScore, probability }
})

function resetTaskForm(): void {
    newTaskForm.taskName = ''
    newTaskForm.optimistic = null
    newTaskForm.mostLikely = null
    newTaskForm.pessimistic = null
}

function resetAll(): void {
    resetTaskForm()
    targetDuration.value = null
    taskList.length = 0
}

function addTask(): void {
    if (newTaskForm.optimistic === null || newTaskForm.mostLikely === null || newTaskForm.pessimistic === null) {
        const missingFields = []
        if (newTaskForm.optimistic === null) missingFields.push('Optimistic (O)')
        if (newTaskForm.mostLikely === null) missingFields.push('Most Likely (M)')
        if (newTaskForm.pessimistic === null) missingFields.push('Pessimistic (P)')
        
        alertMessage.value = `Please fill in all fields: ${missingFields.join(', ')}`
        alertType.value = 'destructive'
        showAlert.value = true
        
        if (alertTimeout) clearTimeout(alertTimeout)
        alertTimeout = setTimeout(() => {
            showAlert.value = false
        }, 4000)
        
        return
    }
    
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
    
    alertMessage.value = 'Task added successfully!'
    alertType.value = 'default'
    showAlert.value = true
    
    if (alertTimeout) clearTimeout(alertTimeout)
    alertTimeout = setTimeout(() => {
        showAlert.value = false
    }, 4000)
}

function removeTask(index: number): void {
    taskList.splice(index, 1)
}

function goToHome(): void {
    router.push('/')
}

function exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();

    // ── Sheet 1: Task Breakdown ──────────────────────────────────────────────
    const taskSheet = workbook.addWorksheet('Task Breakdown');

    taskSheet.columns = [
        { header: 'Task Name', key: 'taskName', width: 30 },
        { header: 'Optimistic (O)', key: 'optimistic', width: 16 },
        { header: 'Most Likely (M)', key: 'mostLikely', width: 16 },
        { header: 'Pessimistic (P)', key: 'pessimistic', width: 16 },
        { header: 'Expected', key: 'expectedTime', width: 16 },
        { header: 'Std Dev', key: 'standardDeviation', width: 16 },
        { header: 'Variance', key: 'variance', width: 16 },
    ];

    taskList.forEach((task) => {
        taskSheet.addRow({
            taskName: task.taskName,
            optimistic: task.optimistic,
            mostLikely: task.mostLikely,
            pessimistic: task.pessimistic,
            expectedTime: parseFloat(task.expectedTime.toFixed(2)),
            standardDeviation: parseFloat(task.standardDeviation.toFixed(3)),
            variance: parseFloat(task.variance.toFixed(3)),
        });
    });

    // Totals row
    taskSheet.addRow([]);
    const totalRow = taskSheet.addRow({
        taskName: 'TOTALS',
        expectedTime: parseFloat(pertAnalysis.value.totalExpectedTime.toFixed(2)),
        variance: parseFloat(pertAnalysis.value.totalVariance.toFixed(3)),
    });
    totalRow.font = { bold: true };
    totalRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F0F0' },
    };

    // Style header row
    const taskHeader = taskSheet.getRow(1);
    taskHeader.font = { bold: true };
    taskHeader.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
    };
    taskHeader.alignment = { horizontal: 'center' };

    // Formula footnote
    taskSheet.addRow([]);
    const footnote = taskSheet.addRow(['te = (O + 4M + P) / 6   ·   sigma = (P - O) / 6   ·   variance = sigma * sigma']);
    footnote.font = { italic: true, color: { argb: 'FF888888' }, size: 9 };

    // ── Sheet 2: PERT Analysis ───────────────────────────────────────────────
    const analysisSheet = workbook.addWorksheet('PERT Analysis');

    analysisSheet.columns = [
        { header: 'Metric', key: 'metric', width: 35 },
        { header: 'Value', key: 'value', width: 20 },
    ];

    const analysisHeader = analysisSheet.getRow(1);
    analysisHeader.font = { bold: true };
    analysisHeader.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
    };

    const { totalExpectedTime, totalVariance, zScore, probability } = pertAnalysis.value;

    const analysisRows = [
        { metric: 'Desired Completion Time (D)', value: targetDuration.value },
        { metric: 'Total Expected Time', value: parseFloat(totalExpectedTime.toFixed(2)) },
        { metric: 'Total Variance', value: parseFloat(totalVariance.toFixed(3)) },
        { metric: 'Standard Deviation', value: parseFloat(Math.sqrt(totalVariance).toFixed(3)) },
        { metric: 'Z-Score', value: parseFloat(zScore.toFixed(3)) },
        { metric: 'On-Time Probability (%)', value: parseFloat(probability.toFixed(1)) },
    ];

    analysisRows.forEach((row) => analysisSheet.addRow(row));

    // Highlight probability row
    const probabilityRow = analysisSheet.getRow(analysisSheet.rowCount);
    probabilityRow.font = { bold: true };
    probabilityRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE8F5E9' },
    };

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');

    const YY = String(now.getFullYear()).slice(2);
    const MM = pad(now.getMonth() + 1);
    const DD = pad(now.getDate());
    const HH = pad(now.getHours());
    const SS = pad(now.getSeconds());

    const timestamp = `${YY}-${MM}-${DD}_${HH}-${SS}`;

    // ── Export ───────────────────────────────────────────────────────────────
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ManHoursEstimation_${timestamp}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}
</script>