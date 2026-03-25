import ExcelJS from 'exceljs'
import type { PERTTaskResult, Analysis } from '@/types'

export async function exportToExcel(tasks: PERTTaskResult[], analysis: Analysis, filename: string = 'project-analysis.xlsx') {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Man Hours Calculator'
    workbook.created = new Date()

    const sheet = workbook.addWorksheet('Project Analysis')

    const columns = [
        { header: 'Task Name', key: 'taskName', width: 25 },
        { header: 'Milestone', key: 'milestone', width: 20 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Optimistic (O)', key: 'optimistic', width: 15 },
        { header: 'Most Likely (M)', key: 'mostLikely', width: 15 },
        { header: 'Pessimistic (P)', key: 'pessimistic', width: 15 },
        { header: 'Expected Time (tₑ)', key: 'expectedTime', width: 18 },
        { header: 'Std Deviation (σ)', key: 'standardDeviation', width: 18 },
        { header: 'Variance (σ²)', key: 'variance', width: 15 },
    ]

    sheet.columns = columns

    sheet.getRow(1).font = { bold: true }
    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
    }

    tasks.forEach((task, index) => {
        const row = sheet.addRow({
            taskName: task.taskName,
            milestone: task.milestone,
            description: task.description,
            optimistic: task.optimistic,
            mostLikely: task.mostLikely,
            pessimistic: task.pessimistic,
            expectedTime: task.expectedTime.toFixed(2),
            standardDeviation: task.standardDeviation.toFixed(2),
            variance: task.variance.toFixed(4),
        })

        if (index % 2 === 0) {
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF9F9F9' },
            }
        }
    })

    const summaryRow = tasks.length + 3
    sheet.getCell(`A${summaryRow}`).value = 'Summary'
    sheet.getCell(`A${summaryRow}`).font = { bold: true }
    sheet.getCell(`A${summaryRow + 1}`).value = 'Total Expected Time:'
    sheet.getCell(`B${summaryRow + 1}`).value = analysis.totalExpectedTime.toFixed(2)
    sheet.getCell(`A${summaryRow + 2}`).value = 'Total Variance:'
    sheet.getCell(`B${summaryRow + 2}`).value = analysis.totalVariance.toFixed(4)
    sheet.getCell(`A${summaryRow + 3}`).value = 'Z-Score:'
    sheet.getCell(`B${summaryRow + 3}`).value = analysis.zScore.toFixed(2)
    sheet.getCell(`A${summaryRow + 4}`).value = 'Probability:'
    sheet.getCell(`B${summaryRow + 4}`).value = `${analysis.probability.toFixed(2)}%`

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
