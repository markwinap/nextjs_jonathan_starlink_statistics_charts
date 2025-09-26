import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface IStats {
  mission: string;
  total_sats_launched: number;
  failed_to_orbit: number;
  early_deorbit: number;
  disposal_complete: number;
  reentry_after_fail: number;
  total_down: number;
  total_in_orbit: number;
  screened: number;
  failed_decaying: number;
  graveyard: number;
  total_working: number;
  disposal_underway: number;
  out_of_constellation: number;
  anomaly: number;
  reserve_relocating: number;
  special: number;
  drift: number;
  ascent: number;
  operational_orbit: number;
  number: number;
  year: number;
  day: number;
  date: string;
  total_operational: number;
}

async function fetchCurrentData(): Promise<IStats[]> {
  try {
    // Get the base URL dynamically
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/current`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch current data: ${response.status}`);
    }
    
    const data: IStats[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching current data:', error);
    throw error;
  }
}

async function storeDataInDatabase(data: IStats[]): Promise<void> {
  try {
    // Get the current timestamp
    const timestamp = new Date();
    
    // Prepare data for bulk insert
    const bulkData = data.map(stats => ({
     timestamp,
      mission: stats.mission,
      total_sats_launched: stats.total_sats_launched,
      failed_to_orbit: stats.failed_to_orbit,
      early_deorbit: stats.early_deorbit,
      disposal_complete: stats.disposal_complete,
      reentry_after_fail: stats.reentry_after_fail,
      total_down: stats.total_down,
      total_in_orbit: stats.total_in_orbit,
      screened: stats.screened,
      failed_decaying: stats.failed_decaying,
      graveyard: stats.graveyard,
      total_working: stats.total_working,
      disposal_underway: stats.disposal_underway,
      out_of_constellation: stats.out_of_constellation,
      anomaly: stats.anomaly,
      reserve_relocating: stats.reserve_relocating,
      special: stats.special,
      drift: stats.drift,
      ascent: stats.ascent,
      operational_orbit: stats.operational_orbit,
      number: stats.number,
      year: stats.year,
      day: stats.day,
      date: stats.date,
      total_operational: stats.total_operational,
    }));

    // Bulk insert all records in a single operation
    await prisma.stats.createMany({
      data: bulkData,
    });
    
    console.log(`Successfully stored ${data.length} records at ${timestamp.toISOString()}`);
  } catch (error) {
    console.error('Error storing data in database:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    console.log('Scheduler triggered at:', new Date().toISOString());
    
    // Fetch data from the /api/current endpoint
    const currentData = await fetchCurrentData();
    
    if (!currentData || currentData.length === 0) {
      throw new Error('No data received from /api/current endpoint');
    }
    
    // Store the data in the database
    await storeDataInDatabase(currentData);
    
    return NextResponse.json({
      success: true,
      message: `Successfully processed ${currentData.length} records`,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Scheduler error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Allow both GET and POST methods for flexibility
  return GET(request);
}