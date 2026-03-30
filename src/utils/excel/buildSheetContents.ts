import type { Workbook, Worksheet } from 'exceljs'
import type { PERTTaskResult, Analysis } from '@/types'

interface TaskBreakdownParams {
  workbook: Workbook
  tasks: PERTTaskResult[]
  analysis: Analysis
}

interface PERTAnalysisParams {
  workbook: Workbook
  analysis: Analysis
  targetDuration: number
}

function styleHeader(sheet: Worksheet): void {
  const header = sheet.getRow(1)
  header.font = { bold: true }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } }
  header.alignment = { horizontal: 'center' }
}

export function buildTaskBreakdownSheet({ workbook, tasks, analysis }: TaskBreakdownParams): void {
  const sheet = workbook.addWorksheet('Task Breakdown')

  sheet.columns = [
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

  styleHeader(sheet)

  tasks.forEach((task) => {
    sheet.addRow({
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

  sheet.addRow([])

  const totalRow = sheet.addRow({
    taskName: 'TOTALS',
    expectedTime: parseFloat(analysis.totalExpectedTime.toFixed(2)),
    variance: parseFloat(analysis.totalVariance.toFixed(3)),
  })
  totalRow.font = { bold: true }
  totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F0F0' } }
}

export function buildPERTAnalysisSheet({ workbook, analysis, targetDuration }: PERTAnalysisParams): void {
  const sheet = workbook.addWorksheet('PERT Analysis')

  sheet.columns = [
    { header: 'Metric', key: 'metric', width: 35 },
    { header: 'Value', key: 'value', width: 20 },
  ]

  styleHeader(sheet)

  const { totalExpectedTime, totalVariance, zScore, probability } = analysis

  const rows = [
    { metric: 'Desired Completion Time (D)', value: targetDuration },
    { metric: 'Total Expected Time', value: parseFloat(totalExpectedTime.toFixed(2)) },
    { metric: 'Total Variance', value: parseFloat(totalVariance.toFixed(3)) },
    { metric: 'Standard Deviation', value: parseFloat(Math.sqrt(totalVariance).toFixed(3)) },
    { metric: 'Z-Score', value: parseFloat(zScore.toFixed(3)) },
    { metric: 'On-Time Probability (%)', value: parseFloat(probability.toFixed(1)) },
  ]

  rows.forEach((row) => sheet.addRow(row))

  const probabilityRow = sheet.getRow(sheet.rowCount)
  probabilityRow.font = { bold: true }
  probabilityRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } }
}
