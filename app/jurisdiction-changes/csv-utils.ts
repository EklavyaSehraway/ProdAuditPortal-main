// CSV Parsing utilities for Jurisdiction Changes
import Papa from 'papaparse'

export interface JurisdictionData {
  plan_id: string
  zip: string
  weeks: {
    [key: string]: string
  }
}

/**
 * Parses a CSV file and converts it to the JurisdictionData format
 * 
 * The CSV is expected to have the following structure:
 * - Column A: Plan_id
 * - Column B: Zip
 * - Columns C-Q: Weeks (with dates as headers)
 * 
 * @param file - The CSV file to parse
 * @returns A promise that resolves to an array of JurisdictionData objects
 */
export async function parseJurisdictionCsv(file: File): Promise<JurisdictionData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data as Record<string, string>[]
          const weekHeaders = Object.keys(rows[0]).filter(key => 
            key !== 'Plan_id' && key !== 'Zip'
          )
          
          const parsedData: JurisdictionData[] = rows.map(row => {
            const weeks: Record<string, string> = {}
            
            weekHeaders.forEach(weekHeader => {
              weeks[weekHeader] = row[weekHeader]
            })
            
            return {
              plan_id: row['Plan_id'],
              zip: row['Zip'],
              weeks
            }
          })
          
          resolve(parsedData)
        } catch (error) {
          reject(error)
        }
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * Gets all unique stations from the data
 */
export function getUniqueStations(data: JurisdictionData[]): string[] {
  return [...new Set(data.map(item => item.plan_id))]
}

/**
 * Gets all unique zip codes from the data
 */
export function getUniqueZips(data: JurisdictionData[]): string[] {
  return [...new Set(data.map(item => item.zip))]
}

/**
 * Gets all week headers from the data
 */
export function getWeekHeaders(data: JurisdictionData[]): string[] {
  if (data.length === 0) return []
  return Object.keys(data[0].weeks)
}

/**
 * Sample data for testing when no CSV is available
 */
export const sampleJurisdictionData: JurisdictionData[] = [
  {
    plan_id: "AMZL_US_2025.18",
    zip: "92",
    weeks: {
      "16-Apr": "ADDITIONAL",
      "23-Apr": "ADDITIONAL",
      "30-Apr": "ADDITIONAL",
      "07-May": "ADDITIONAL",
      "14-May": "ADDITIONAL",
      "21-May": "ADDITIONAL",
      "28-May": "ADDITIONAL",
      "04-Jun": "ADDITIONAL",
      "11-Jun": "ADDITIONAL",
      "18-Jun": "ADDITIONAL",
      "25-Jun": "ADDITIONAL",
      "02-Jul": "ADDITIONAL",
      "09-Jul": "ADDITIONAL",
      "16-Jul": "ADDITIONAL",
      "23-Jul": "ADDITIONAL",
    }
  },
  {
    plan_id: "AMZL_US_2025.18",
    zip: "103",
    weeks: {
      "16-Apr": "ADDITIONAL",
      "23-Apr": "ADDITIONAL",
      "30-Apr": "ADDITIONAL",
      "07-May": "ADDITIONAL",
      "14-May": "ADDITIONAL",
      "21-May": "ADDITIONAL",
      "28-May": "ADDITIONAL",
      "04-Jun": "ADDITIONAL",
      "11-Jun": "ADDITIONAL",
      "18-Jun": "ADDITIONAL",
      "25-Jun": "ADDITIONAL",
      "02-Jul": "ADDITIONAL",
      "09-Jul": "ADDITIONAL",
      "16-Jul": "ADDITIONAL",
      "23-Jul": "ADDITIONAL",
    }
  },
  {
    plan_id: "AMZL_US_2025.18",
    zip: "110",
    weeks: {
      "16-Apr": "ADDITIONAL",
      "23-Apr": "ADDITIONAL",
      "30-Apr": "ADDITIONAL",
      "07-May": "ADDITIONAL",
      "14-May": "ADDITIONAL",
      "21-May": "ADDITIONAL",
      "28-May": "ADDITIONAL",
      "04-Jun": "ADDITIONAL",
      "11-Jun": "ADDITIONAL",
      "18-Jun": "ADDITIONAL",
      "25-Jun": "ADDITIONAL",
      "02-Jul": "ADDITIONAL",
      "09-Jul": "ADDITIONAL",
      "16-Jul": "ADDITIONAL",
      "23-Jul": "ADDITIONAL",
    }
  },
  {
    plan_id: "AMZL_US_2025.18",
    zip: "123",
    weeks: {
      "16-Apr": "ADDITIONAL",
      "23-Apr": "ADDITIONAL",
      "30-Apr": "ADDITIONAL",
      "07-May": "ADDITIONAL",
      "14-May": "ADDITIONAL",
      "21-May": "ADDITIONAL",
      "28-May": "ADDITIONAL",
      "04-Jun": "ADDITIONAL",
      "11-Jun": "ADDITIONAL",
      "18-Jun": "ADDITIONAL",
      "25-Jun": "ADDITIONAL",
      "02-Jul": "ADDITIONAL",
      "09-Jul": "ADDITIONAL",
      "16-Jul": "ADDITIONAL",
      "23-Jul": "ADDITIONAL",
    }
  },
  {
    plan_id: "AMZL_US_2025.18",
    zip: "202",
    weeks: {
      "16-Apr": "ADDITIONAL",
      "23-Apr": "ADDITIONAL",
      "30-Apr": "ADDITIONAL",
      "07-May": "ADDITIONAL",
      "14-May": "ADDITIONAL",
      "21-May": "ADDITIONAL",
      "28-May": "ADDITIONAL",
      "04-Jun": "ADDITIONAL",
      "11-Jun": "ADDITIONAL",
      "18-Jun": "ADDITIONAL",
      "25-Jun": "ADDITIONAL",
      "02-Jul": "ADDITIONAL",
      "09-Jul": "ADDITIONAL",
      "16-Jul": "ADDITIONAL",
      "23-Jul": "ADDITIONAL",
    }
  },
] 