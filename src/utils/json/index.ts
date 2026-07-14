import type { PERTTaskResult, Analysis } from '@/types'
import { buildExportFilename } from '@/utils/excel/buildFilename'

interface ExportParams {
  projectName: string
  tasks: PERTTaskResult[]
  analysis: Analysis
  targetDuration: number
}

export async function exportToJson({ projectName, tasks, analysis, targetDuration }: ExportParams): Promise<void> {
  const data = {
    projectName,
    exportedAt: new Date().toISOString(),
    taskBreakdown: tasks.map((task) => ({
      milestone: task.milestone || 'Uncategorized',
      taskName: task.taskName,
      description: task.description || '',
      optimistic: task.optimistic,
      mostLikely: task.mostLikely,
      pessimistic: task.pessimistic,
      expectedTime: parseFloat(task.expectedTime.toFixed(2)),
      standardDeviation: parseFloat(task.standardDeviation.toFixed(3)),
      variance: parseFloat(task.variance.toFixed(3)),
    })),
    totals: {
      totalExpectedTime: parseFloat(analysis.totalExpectedTime.toFixed(2)),
      totalVariance: parseFloat(analysis.totalVariance.toFixed(3)),
      standardDeviation: parseFloat(Math.sqrt(analysis.totalVariance).toFixed(3)),
    },
    pertAnalysis: {
      desiredCompletionTime: targetDuration,
      zScore: parseFloat(analysis.zScore.toFixed(3)),
      onTimeProbability: parseFloat(analysis.probability.toFixed(1)),
    },
  }

  const filename = buildExportFilename(projectName, 'json')
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
