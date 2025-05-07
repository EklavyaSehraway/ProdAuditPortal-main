import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface DssData {
  node: string;
  ofd_week: string;
  final_tva: number;
}

export interface DssComparisonResult {
  nodes: string[];
  weeks: string[];
  comparisonData: {
    [node: string]: {
      [week: string]: number | null;
    };
  };
}

/**
 * Processes DSS data files and returns comparison data
 */
export async function processDssFiles(priorDssPath: string, latestDssPath: string): Promise<DssComparisonResult> {
  // Read the CSV files
  const priorDssContent = fs.readFileSync(priorDssPath, 'utf-8');
  const latestDssContent = fs.readFileSync(latestDssPath, 'utf-8');

  // Parse the CSV files
  const priorDssRecords = parse(priorDssContent, {
    columns: true,
    skip_empty_lines: true,
  });
  
  const latestDssRecords = parse(latestDssContent, {
    columns: true,
    skip_empty_lines: true,
  });

  // Extract the relevant data from the files
  const priorDssData = extractDssData(priorDssRecords);
  const latestDssData = extractDssData(latestDssRecords);

  // Get unique nodes and weeks
  const nodes = [...new Set([
    ...priorDssData.map(item => item.node),
    ...latestDssData.map(item => item.node)
  ])].sort();
  
  const weeks = [...new Set([
    ...priorDssData.map(item => item.ofd_week),
    ...latestDssData.map(item => item.ofd_week)
  ])].sort((a, b) => parseInt(a) - parseInt(b));

  // Create a map for faster lookups
  const priorDssMap = createDssMap(priorDssData);
  const latestDssMap = createDssMap(latestDssData);

  // Calculate percentage changes
  const comparisonData: { [node: string]: { [week: string]: number | null } } = {};

  nodes.forEach(node => {
    comparisonData[node] = {};
    
    weeks.forEach(week => {
      const priorValue = priorDssMap[`${node}-${week}`]?.final_tva;
      const latestValue = latestDssMap[`${node}-${week}`]?.final_tva;
      
      if (priorValue && latestValue) {
        const percentChange = ((latestValue - priorValue) / priorValue) * 100;
        comparisonData[node][week] = parseFloat(percentChange.toFixed(2));
      } else {
        comparisonData[node][week] = null;
      }
    });
  });

  return {
    nodes,
    weeks,
    comparisonData
  };
}

function extractDssData(records: any[]): DssData[] {
  return records.map(record => ({
    node: record.node,
    ofd_week: record.ofd_week,
    final_tva: parseFloat(record.final_tva)
  }));
}

function createDssMap(dssData: DssData[]): { [key: string]: DssData } {
  const dssMap: { [key: string]: DssData } = {};
  
  dssData.forEach(item => {
    const key = `${item.node}-${item.ofd_week}`;
    dssMap[key] = item;
  });
  
  return dssMap;
} 