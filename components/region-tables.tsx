"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface DataPoint {
  value: number
  formatted: string
  isGood: boolean
}

interface RegionRow {
  region: string
  week12: DataPoint
  week13: DataPoint
  week14: DataPoint
  week15: DataPoint
  week16: DataPoint
}

// Sample data generator with trend direction
const generateRandomData = (): DataPoint => {
  const value = parseFloat((Math.random() * 100).toFixed(2))
  const isGood = Math.random() > 0.5
  
  return {
    value,
    formatted: value.toFixed(2) + "%",
    isGood
  }
}

// Regions list
const regions = [
  "Florida",
  "GreatLakes",
  "MidAtlantic", 
  "MidSouth",
  "Midwest",
  "NorthEast",
  "NorthWest", 
  "SouthWest",
  "Texas"
]

// Generate sample data
const generateTableData = (): RegionRow[] => {
  return regions.map(region => ({
    region,
    week12: generateRandomData(),
    week13: generateRandomData(),
    week14: generateRandomData(),
    week15: generateRandomData(),
    week16: generateRandomData()
  }))
}

export function RegionTables() {
  // Generate data for both tables
  const leftTableData = generateTableData()
  const rightTableData = generateTableData()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regional Performance</CardTitle>
          <CardDescription>WAPE metrics by region - Week 12-16</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Week 12</TableHead>
                <TableHead className="text-right">Week 13</TableHead>
                <TableHead className="text-right">Week 14</TableHead>
                <TableHead className="text-right">Week 15</TableHead>
                <TableHead className="text-right">Week 16</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leftTableData.map((row) => (
                <TableRow key={row.region}>
                  <TableCell className="font-medium">{row.region}</TableCell>
                  <TableCell className="text-right">
                    <ValueWithIndicator data={row.week12} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ValueWithIndicator data={row.week13} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ValueWithIndicator data={row.week14} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ValueWithIndicator data={row.week15} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ValueWithIndicator data={row.week16} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">W-1 Cap Ask Utilization by Region</CardTitle>
          <CardDescription>Capacity utilization by region - Week 12-16</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Week 12</TableHead>
                <TableHead className="text-right">Week 13</TableHead>
                <TableHead className="text-right">Week 14</TableHead>
                <TableHead className="text-right">Week 15</TableHead>
                <TableHead className="text-right">Week 16</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rightTableData.map((row) => (
                <TableRow key={row.region}>
                  <TableCell className="font-medium">{row.region}</TableCell>
                  <TableCell className="text-right">
                    <ValueWithIndicator data={row.week12} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ValueWithIndicator data={row.week13} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ValueWithIndicator data={row.week14} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ValueWithIndicator data={row.week15} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ValueWithIndicator data={row.week16} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

interface ValueWithIndicatorProps {
  data: DataPoint
}

// Helper component for displaying values with color indicators
function ValueWithIndicator({ data }: ValueWithIndicatorProps) {
  return (
    <span className="flex items-center justify-end gap-2">
      <span className="font-mono">{data.formatted}</span>
      <Badge 
        variant={data.isGood ? "default" : "destructive"} 
        className="ml-1 h-2 w-2 rounded-full p-0"
      />
    </span>
  );
} 