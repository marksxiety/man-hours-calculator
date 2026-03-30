export function sanitizeProjectName(name: string): string {
  return name.replace(/\s+/g, '_')
}

function buildTimestamp(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const YY = String(now.getFullYear()).slice(2)
  const MM = pad(now.getMonth() + 1)
  const DD = pad(now.getDate())
  const HH = pad(now.getHours())
  const SS = pad(now.getSeconds())
  return `${YY}-${MM}-${DD}_${HH}-${SS}`
}

export function buildExportFilename(projectName: string): string {
  const sanitized = sanitizeProjectName(projectName)
  const timestamp = buildTimestamp()
  return `${sanitized}_${timestamp}.xlsx`
}
