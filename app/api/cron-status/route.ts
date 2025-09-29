import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Check the last few records from the database to see if cron is working
    const lastRecords = await prisma.stats.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      take: 5,
      select: {
        timestamp: true,
        mission: true,
        total_operational: true,
        total_in_orbit: true,
      }
    });

    // Calculate time since last record
    const now = new Date();
    const lastRecord = lastRecords[0];
    const timeSinceLastRecord = lastRecord 
      ? Math.floor((now.getTime() - lastRecord.timestamp.getTime()) / (1000 * 60 * 60)) 
      : null;

    // Check if cron is likely working (data within last 25 hours)
    const cronWorking = timeSinceLastRecord !== null && timeSinceLastRecord < 25;

    return NextResponse.json({
      success: true,
      cronStatus: cronWorking ? 'healthy' : 'issue_detected',
      lastRecords: lastRecords.map(record => ({
        timestamp: record.timestamp.toISOString(),
        mission: record.mission,
        total_operational: record.total_operational,
        total_in_orbit: record.total_in_orbit,
      })),
      timeSinceLastRecord: timeSinceLastRecord ? `${timeSinceLastRecord} hours` : 'No records found',
      analysis: {
        totalRecords: lastRecords.length,
        shouldRunDaily: "Cron is scheduled to run at 00:00 UTC daily",
        expectedNextRun: getNextCronRun(),
      }
    });

  } catch (error) {
    console.error('Error checking cron status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

function getNextCronRun(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  
  return tomorrow.toISOString();
}