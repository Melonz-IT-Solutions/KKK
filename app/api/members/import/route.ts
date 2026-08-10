// app/api/members/import/route.ts
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { importMembers } from '@/lib/services/member-service'

const CLIENT_NAME_HEADER = 'client name'

function findHeaderRow(worksheet: XLSX.WorkSheet): number {
  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: '',
  })

  return rows.findIndex(row =>
    row.some(cell => String(cell).trim().toLowerCase() === CLIENT_NAME_HEADER)
  )
}

function hasValues(row: Record<string, unknown>): boolean {
  return Object.values(row).some(value => String(value ?? '').trim() !== '')
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'No file was uploaded.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true })
    if (workbook.SheetNames.length === 0) {
      return NextResponse.json({ message: 'The uploaded file has no sheets.' }, { status: 400 })
    }

    const rows = workbook.SheetNames.flatMap(sheetName => {
      const worksheet = workbook.Sheets[sheetName]
      const headerRow = findHeaderRow(worksheet)

      if (headerRow === -1) return []

      return XLSX.utils
        .sheet_to_json<Record<string, unknown>>(worksheet, {
          defval: '',
          range: headerRow,
        })
        .filter(hasValues)
    })

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'No member data was found. Check that a sheet contains a Client name header.' },
        { status: 400 }
      )
    }

    const result = await importMembers(rows)

    if (result.importedCount === 0) {
      return NextResponse.json(
        {
          message: 'No members were imported. Check the file for errors.',
          errors: result.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to import members.' }, { status: 500 })
  }
}
