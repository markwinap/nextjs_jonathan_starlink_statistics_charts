import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the base URL
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    
    // Call the scheduler endpoint
    const response = await fetch(`${baseUrl}/api/scheduler`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include auth header if CRON_SECRET is set
        ...(process.env.CRON_SECRET && {
          'Authorization': `Bearer ${process.env.CRON_SECRET}`
        })
      }
    });
    
    const result = await response.json();
    
    return NextResponse.json({
      schedulerResponse: result,
      status: response.status,
      testRun: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Test failed',
      testRun: true,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}