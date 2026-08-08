// app/api/members/import/route.ts
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { importMembers } from '@/lib/services/member-service'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'No file was uploaded.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true })
    const firstSheetName = workbook.SheetNames[0]

    if (!firstSheetName) {
      return NextResponse.json({ message: 'The uploaded file has no sheets.' }, { status: 400 })
    }

    const worksheet = workbook.Sheets[firstSheetName]
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: '', // empty cells become '' instead of being omitted
      range: 1, // header row is row 2 in this spreadsheet template — row 1 is blank
    })

    if (rows.length === 0) {
      return NextResponse.json({ message: 'The uploaded file has no data rows.' }, { status: 400 })
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
