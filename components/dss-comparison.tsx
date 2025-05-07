'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DssComparisonResult } from '../utils/dss-processor';
// Import generated comparison data
import dssComparisonData from '../data/dss-comparison.json';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefreshCw, Download, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface DssComparisonProps {
  priorDssFile: string;
  latestDssFile: string;
}

export function DssComparison({ priorDssFile, latestDssFile }: DssComparisonProps) {
  // Cast the imported JSON to the correct type
  const comparisonData = dssComparisonData as DssComparisonResult;
  
  // State for pagination and filtering
  const [displayLimit, setDisplayLimit] = useState<number>(15);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  
  const router = useRouter();
  const { toast } = useToast();
  
  // Initialize selected weeks when comparisonData is loaded
  useEffect(() => {
    if (comparisonData && comparisonData.weeks) {
      setSelectedWeeks(comparisonData.weeks);
    }
  }, [comparisonData]);
  
  // Helper function to determine cell color based on percentage change
  const getCellColorClass = (value: number | null) => {
    if (value === null) return 'bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    if (value > 5) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 font-medium';
    if (value < -5) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 font-medium';
    return 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200';
  };
  
  // Helper function to determine cell display value
  const getCellDisplayValue = (value: number | null) => {
    if (value === null) return 'N/A';
    if (value > 5 || value < -5) return `${value.toFixed(2)}%`;
    return '';
  };
  
  // Refresh the DSS data by calling the API
  const refreshDssData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/refresh-dss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "DSS data refreshed successfully. Reloading page...",
        });
        // Wait a moment before refreshing to show the toast
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to refresh DSS data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Export the DSS data to CSV
  const downloadCsv = () => {
    setIsDownloading(true);
    try {
      // Create the CSV header row (only include selected weeks)
      const headerRow = ['Station', ...selectedWeeks.map(week => `Week ${week}`)];
      
      // Create the CSV data rows using the filtered nodes
      const dataRows = filteredNodes.map(node => {
        const rowData = [node];
        
        // Add the percentage change for each selected week
        selectedWeeks.forEach(week => {
          const value = comparisonData.comparisonData[node][week];
          rowData.push(value === null ? 'N/A' : `${value.toFixed(2)}%`);
        });
        
        return rowData;
      });
      
      // Combine header and data rows
      const csvContent = [
        headerRow.join(','),
        ...dataRows.map(row => row.join(','))
      ].join('\n');
      
      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'dss_comparison.csv');
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "DSS comparison data downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download DSS comparison data",
        variant: "destructive",
      });
      console.error('Error downloading CSV:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Toggle week selection
  const toggleWeek = (week: string) => {
    if (selectedWeeks.includes(week)) {
      setSelectedWeeks(selectedWeeks.filter(w => w !== week));
    } else {
      setSelectedWeeks([...selectedWeeks, week].sort());
    }
  };
  
  // Select or deselect all weeks
  const toggleAllWeeks = () => {
    if (selectedWeeks.length === comparisonData.weeks.length) {
      setSelectedWeeks([]);
    } else {
      setSelectedWeeks([...comparisonData.weeks]);
    }
  };
  
  // Filter nodes based on filter type and search term
  const filteredNodes = comparisonData.nodes.filter(node => {
    // Filter by search term
    if (searchTerm && !node.toLowerCase().includes(searchTerm.toLowerCase())) {
      // Also check if region or planner contains the search term
      const nodeMetadata = comparisonData.nodeMetadata?.[node] || {};
      const region = nodeMetadata.region || '';
      const planner = nodeMetadata.planner || '';
      
      if (
        !region.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !planner.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
    }
    
    // Filter by significance
    if (filterType === 'significant') {
      // Check if node has at least one significant change (>5% or <-5%) in selected weeks
      for (const week of selectedWeeks) {
        const value = comparisonData.comparisonData[node][week];
        if (value !== null && (value > 5 || value < -5)) {
          return true;
        }
      }
      return false;
    }
    
    return true;
  });
  
  // Get the current page of nodes based on the display limit
  const displayedNodes = filteredNodes.slice(0, displayLimit);
  
  // Check if there are more nodes to display
  const hasMoreNodes = displayLimit < filteredNodes.length;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-primary/10 rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle>DSS Comparison - Final TVA % Change</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadCsv} 
              disabled={isDownloading}
            >
              <Download className={`h-4 w-4 mr-2`} />
              {isDownloading ? 'Downloading...' : 'Download CSV'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshDssData} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search region, planner or station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/3">
            <Select
              value={filterType}
              onValueChange={(value) => {
                console.log("Filter changed to:", value);
                setFilterType(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by significance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stations</SelectItem>
                <SelectItem value="significant">Significant Changes Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Filter Weeks</span>
                  </div>
                  {selectedWeeks.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedWeeks.length} selected
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Weeks</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={selectedWeeks.length === comparisonData.weeks.length}
                  onCheckedChange={toggleAllWeeks}
                >
                  All Weeks
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {comparisonData.weeks.map(week => (
                  <DropdownMenuCheckboxItem
                    key={week}
                    checked={selectedWeeks.includes(week)}
                    onCheckedChange={() => toggleWeek(week)}
                  >
                    Week {week}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 overflow-x-auto">
        <div className="text-sm text-muted-foreground dark:text-gray-300 mb-2">
          Showing {displayedNodes.length} of {filteredNodes.length} stations
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold dark:text-white">Region</TableHead>
              <TableHead className="font-bold dark:text-white">Planner</TableHead>
              <TableHead className="font-bold dark:text-white">Station</TableHead>
              {selectedWeeks.map(week => (
                <TableHead key={week} className="text-center font-bold dark:text-white">Week {week}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedNodes.map(node => {
              const nodeMetadata = comparisonData.nodeMetadata?.[node] || {};
              const region = nodeMetadata.region || 'Unknown';
              const planner = nodeMetadata.planner || 'Unknown';
              
              return (
                <TableRow key={node}>
                  <TableCell className="font-medium dark:text-white">{region}</TableCell>
                  <TableCell className="font-medium dark:text-white">{planner}</TableCell>
                  <TableCell className="font-medium dark:text-white">{node}</TableCell>
                  {selectedWeeks.map(week => {
                    const value = comparisonData.comparisonData[node][week];
                    return (
                      <TableCell 
                        key={`${node}-${week}`} 
                        className={`text-center ${getCellColorClass(value)}`}
                      >
                        {getCellDisplayValue(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {hasMoreNodes && (
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => setDisplayLimit(displayLimit + 15)}
            >
              Load More
            </Button>
            <Button 
              variant="outline" 
              className="ml-2"
              onClick={() => setDisplayLimit(filteredNodes.length)}
            >
              Show All ({filteredNodes.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 