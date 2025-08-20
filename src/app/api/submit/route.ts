import { NextRequest, NextResponse } from 'next/server';
import { userServices, reportServices } from '@/lib/firebase/services';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, url, title, platform, reason, email, linkedin, name, expertise } = body;

    // Validate required fields
    if (!type || !url || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: type, url, reason' },
        { status: 400 }
      );
    }

    // Require either email or LinkedIn
    if (!email && !linkedin) {
      return NextResponse.json(
        { error: 'Either email or LinkedIn URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Upsert user (create if doesn't exist, update if does)
    const user = await userServices.upsertUser({
      email,
      name,
      expertise,
      linkedin,
    });

    // Create report
    const report = await reportServices.createReport({
      type,
      url,
      title: title || undefined,
      platform,
      reason,
      reporterId: user.id,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      reportId: report.id,
    });

  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
