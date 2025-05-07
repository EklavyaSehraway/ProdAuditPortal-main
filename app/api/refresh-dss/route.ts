import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST() {
  try {
    // Get the current working directory
    const cwd = process.cwd();
    
    // Execute the script
    const { stdout, stderr } = await execPromise('node frontend/scripts/generate-dss-comparison.js', { cwd });
    
    if (stderr) {
      console.error('Error refreshing DSS data:', stderr);
      return NextResponse.json({ success: false, message: 'Failed to refresh DSS data', error: stderr }, { status: 500 });
    }
    
    console.log('DSS data refreshed successfully:', stdout);
    return NextResponse.json({ success: true, message: 'DSS data refreshed successfully' });
  } catch (error) {
    console.error('Exception refreshing DSS data:', error);
    return NextResponse.json({ success: false, message: 'Failed to refresh DSS data', error: String(error) }, { status: 500 });
  }
} 