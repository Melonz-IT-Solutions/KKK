export const ACCEPTED_EXTENSIONS = /\.(xlsx|xls|csv)$/i

export function isExcelFile(file: File): boolean {
  return (
    ACCEPTED_EXTENSIONS.test(file.name) ||
    file.type.includes('spreadsheet') ||
    file.type.includes('excel')
  )
}
