"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UploadIcon } from "lucide-react"
import { 
  JurisdictionData, 
  parseJurisdictionCsv, 
  getUniqueStations, 
  getUniqueZips,
  getWeekHeaders,
  sampleJurisdictionData
} from "./csv-utils"

export function JurisdictionTable() {
  const [data, setData] = useState<JurisdictionData[]>(sampleJurisdictionData)
  const [stationFilter, setStationFilter] = useState<string>("all")
  const [zipFilter, setZipFilter] = useState<string>("all")
  const [filteredData, setFilteredData] = useState<JurisdictionData[]>(data)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const stations = getUniqueStations(data)
  const zips = getUniqueZips(data)
  const weekHeaders = getWeekHeaders(data)

  // Apply filters whenever they change
  useEffect(() => {
    let result = data
    
    if (stationFilter && stationFilter !== "all") {
      result = result.filter(item => item.plan_id === stationFilter)
    }
    
    if (zipFilter && zipFilter !== "all") {
      result = result.filter(item => item.zip === zipFilter)
    }
    
    setFilteredData(result)
  }, [stationFilter, zipFilter, data])

  const handleClearFilters = () => {
    setStationFilter("all")
    setZipFilter("all")
  }

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const parsedData = await parseJurisdictionCsv(file)
      setData(parsedData)
    } catch (err) {
      console.error("Error parsing CSV:", err)
      setError("Failed to parse the CSV file. Please ensure it has the correct format.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-2">
          <Label htmlFor="station-filter">Station</Label>
          <Select value={stationFilter} onValueChange={setStationFilter}>
            <SelectTrigger id="station-filter" className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Stations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stations</SelectItem>
              {stations.map(station => (
                <SelectItem key={station} value={station}>{station}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="zip-filter">Zip</Label>
          <Select value={zipFilter} onValueChange={setZipFilter}>
            <SelectTrigger id="zip-filter" className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Zip Codes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zip Codes</SelectItem>
              {zips.map(zip => (
                <SelectItem key={zip} value={zip}>{zip}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end gap-2">
          <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
          
          <div className="relative">
            <Input
              type="file"
              accept=".csv"
              id="csv-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" asChild disabled={isLoading}>
              <Label htmlFor="csv-upload" className="flex items-center gap-2 cursor-pointer">
                <UploadIcon className="h-4 w-4" />
                {isLoading ? "Loading..." : "Upload CSV"}
              </Label>
            </Button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-2 rounded border border-red-200">
          {error}
        </div>
      )}
      
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap sticky left-0 bg-muted z-10">Plan ID</TableHead>
                <TableHead className="whitespace-nowrap sticky left-[100px] bg-muted z-10">Zip</TableHead>
                {weekHeaders.map(week => (
                  <TableHead key={week} className="whitespace-nowrap">{week}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <TableRow key={`${row.plan_id}-${row.zip}-${index}`}>
                    <TableCell className="whitespace-nowrap sticky left-0 bg-white z-10">{row.plan_id}</TableCell>
                    <TableCell className="whitespace-nowrap sticky left-[100px] bg-white z-10">{row.zip}</TableCell>
                    {weekHeaders.map(week => (
                      <TableCell key={week} className="whitespace-nowrap">{row.weeks[week]}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={weekHeaders.length + 2} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>Currently showing {filteredData.length} of {data.length} rows</p>
        {data === sampleJurisdictionData && (
          <p>Using sample data. Upload a CSV file to see your own data.</p>
        )}
      </div>
    </div>
  )
} 