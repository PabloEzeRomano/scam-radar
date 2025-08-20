import { NextRequest, NextResponse } from 'next/server';
import { reportServices } from '@/lib/firebase/services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'approved';

    // Fetch reports with filters
    const allReports = await reportServices.getReports({
      type: type || undefined,
      search: search || undefined,
      status,
    });

    return NextResponse.json({
      success: true,
      reports: allReports,
      count: allReports.length,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
