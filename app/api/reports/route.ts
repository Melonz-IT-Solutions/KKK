import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createReport, listReports } from '@/lib/services/report-service';

const reportSchema = z.object({
  type: z.string().min(1),
  dateRangeStart: z.string().min(1),
  dateRangeEnd: z.string().min(1),
  generatedDate: z.string().min(1),
});

export async function GET() {
  try {
    const reports = await listReports();
    return NextResponse.json(reports);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to load reports' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = reportSchema.parse(await request.json());
    const report = await createReport(payload);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: error.flatten() },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to create report' },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Report deletion is not permitted' },
    { status: 405 },
  );
}
