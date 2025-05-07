import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { processDssFiles } from '@/utils/dss-processor';

export async function POST(request: NextRequest) {
  try {
    const { priorDssFile, latestDssFile } = await request.json();

    // Validate input
    if (!priorDssFile || !latestDssFile) {
      return NextResponse.json(
        { error: 'Prior DSS file and latest DSS file paths are required' },
        { status: 400 }
      );
    }

    // Resolve paths
    const basePath = process.cwd();
    const priorDssPath = path.join(basePath, priorDssFile);
    const latestDssPath = path.join(basePath, latestDssFile);

    // Process the files
    const comparisonData = await processDssFiles(priorDssPath, latestDssPath);

    return NextResponse.json(comparisonData);
  } catch (error) {
    console.error('Error processing DSS files:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 