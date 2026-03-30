import ExcelJS from 'exceljs'
import type { PERTTaskResult, Analysis } from '@/types'
import { buildExportFilename } from './buildFilename'
import { buildTaskBreakdownSheet, buildPERTAnalysisSheet } from './buildSheetContents'

export interface ExportParams {
  projectName: string
  tasks: PERTTaskResult[]
  analysis: Analysis
  targetDuration: number
}

export async function exportToExcel({ projectName, tasks, analysis, targetDuration }: ExportParams): Promise<void> {
  const workbook = new ExcelJS.Workbook()

  buildTaskBreakdownSheet({ workbook, tasks, analysis })
  buildPERTAnalysisSheet({ workbook, analysis, targetDuration })

  const filename = buildExportFilename(projectName)

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export { buildExportFilename, sanitizeProjectName } from './buildFilename'
export { buildTaskBreakdownSheet, buildPERTAnalysisSheet } from './buildSheetContents'
