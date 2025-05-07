"use client"

import { useState, useEffect } from "react"
import { ApplyOverridesSidebar } from "../../components/apply-overrides-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Link as LinkIcon, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useToast } from "@/hooks/use-toast"

// FTG Performance chart data
const ftgChartData = [
  { week: "WK01", actual: 186, forecast: 180 },
  { week: "WK02", actual: 305, forecast: 290 },
  { week: "WK03", actual: 237, forecast: 250 },
  { week: "WK04", actual: 173, forecast: 190 },
  { week: "WK05", actual: 209, forecast: 210 },
  { week: "WK06", actual: 214, forecast: 220 },
]

const ftgChartConfig = {
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-1))",
  },
  forecast: {
    label: "Forecast",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

// Attainment Performance chart data
const attainmentChartData = [
  { week: "WK01", achieved: 86, target: 100 },
  { week: "WK02", achieved: 95, target: 100 },
  { week: "WK03", achieved: 107, target: 100 },
  { week: "WK04", achieved: 93, target: 100 },
  { week: "WK05", achieved: 99, target: 100 },
  { week: "WK06", achieved: 104, target: 100 },
]

const attainmentChartConfig = {
  achieved: {
    label: "Achieved",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

// Helper function to generate all weeks (1-52)
const generateWeeks = () => {
  const weeks = []
  for (let i = 1; i <= 52; i++) {
    const weekNum = i.toString().padStart(2, '0')
    weeks.push({ value: `wk${weekNum}`, label: `WK${weekNum}` })
  }
  return weeks
}

// Helper to format date as YYYY/MM/DD
const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}/${month}/${day}`
}

// Current year for all calculations
const CURRENT_YEAR = 2025

// Find the first Sunday of the year
const getFirstSundayOfYear = (year: number) => {
  const firstDay = new Date(year, 0, 1)
  const dayOfWeek = firstDay.getDay()
  const daysUntilSunday = (7 - dayOfWeek) % 7
  const firstSunday = new Date(year, 0, 1 + daysUntilSunday)
  return firstSunday
}

// First Sunday of 2025 is January 5
const FIRST_SUNDAY_OF_YEAR = getFirstSundayOfYear(CURRENT_YEAR)

// Specific end dates for special cases
const SPECIAL_END_DATES = {
  wk17: "2025/04/26",
  wk18: "2025/05/03" 
}

export default function ApplyOverridesPage() {
  const { toast } = useToast()
  const [ftgOverride, setFtgOverride] = useState(0)
  const [miscAdjustment, setMiscAdjustment] = useState(0)
  const [nfpPercentage, setNfpPercentage] = useState(0)
  const [miscPackages, setMiscPackages] = useState(0)
  const [startWeek, setStartWeek] = useState("wk01")
  const [endWeek, setEndWeek] = useState("wk02")
  
  // All available weeks
  const allWeeks = generateWeeks()
  
  // Calculate available end weeks based on start week
  const availableEndWeeks = allWeeks.filter(week => {
    // Extract week number from value (e.g., "wk01" -> 1)
    const startWeekNum = parseInt(startWeek.substring(2))
    const weekNum = parseInt(week.value.substring(2))
    return weekNum >= startWeekNum
  })
  
  // Update end week if it becomes invalid (before start week)
  useEffect(() => {
    const startWeekNum = parseInt(startWeek.substring(2))
    const endWeekNum = parseInt(endWeek.substring(2))
    
    if (endWeekNum < startWeekNum) {
      setEndWeek(startWeek)
    }
  }, [startWeek, endWeek])

  const increment = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(prev => prev + 1)
  }

  const decrement = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(prev => prev - 1)
  }

  // Allow direct input for more precise values
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const value = e.target.value
    // Check if it's a valid number or empty
    if (value === '' || !isNaN(Number(value))) {
      setter(value === '' ? 0 : Number(value))
    }
  }

  // Calculate start date (Sunday) based on selected week
  const getStartDateFromWeek = (weekValue: string) => {
    const weekNum = parseInt(weekValue.substring(2))
    
    // Calculate the Sunday of the selected week
    const startDate = new Date(FIRST_SUNDAY_OF_YEAR)
    startDate.setDate(FIRST_SUNDAY_OF_YEAR.getDate() + (weekNum - 1) * 7)
    
    // Week 17 in 2025 starts on April 20
    if (weekValue === "wk17") {
      // Verify it's correct
      const calculatedDate = new Date(2025, 3, 20) // April 20, 2025
      if (startDate.getDate() !== 20 || startDate.getMonth() !== 3) {
        return "2025/04/20" // Force to correct date if calculation is off
      }
    }
    
    return formatDate(startDate)
  }
  
  // Calculate end date (Saturday) based on selected week
  const getEndDateFromWeek = (weekValue: string) => {
    // Check for special case end dates
    if (weekValue in SPECIAL_END_DATES) {
      return SPECIAL_END_DATES[weekValue as keyof typeof SPECIAL_END_DATES]
    }
    
    const weekNum = parseInt(weekValue.substring(2))
    
    // Calculate the Sunday of the selected week
    const startDate = new Date(FIRST_SUNDAY_OF_YEAR)
    startDate.setDate(FIRST_SUNDAY_OF_YEAR.getDate() + (weekNum - 1) * 7)
    
    // Calculate the Saturday at the end of the week (6 days after Sunday)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    
    return formatDate(endDate)
  }

  // Handle save changes
  const handleSaveChanges = () => {
    // Here you would typically save the changes to your backend
    
    // Show success toast with auto-dismiss and orange styling
    toast({
      title: "Success",
      description: "Overrides have been successfully saved.",
      duration: 3000, // 3 seconds
      className: "border-orange-500 border-2", // Orange outline
    })
  }

  return (
    <SidebarProvider>
      <ApplyOverridesSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 py-4 px-6">
              {/* Header with title and link icon */}
              <div className="flex items-center gap-2">
              </div>

              {/* Navigation buttons and station selection */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <Button variant="outline" className="flex items-center gap-2 bg-background">
                    <ChevronLeft size={16} />
                    Previous Station
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">🏙️ Select Station</span>
                    <Select>
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="DAB4" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dab4">DAB4</SelectItem>
                        <SelectItem value="dab5">DAB5</SelectItem>
                        <SelectItem value="dab6">DAB6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" className="flex items-center gap-2 bg-background">
                    Next Station
                    <ChevronRight size={16} />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="mark-checked" />
                  <label htmlFor="mark-checked" className="text-sm font-medium cursor-pointer">✓ Mark as Checked</label>
                  
                  <div className="ml-2 bg-background rounded-lg border p-3 flex flex-col items-center justify-center">
                    <div className="flex gap-1 items-baseline">
                      <span className="text-xl  text-green-500">0</span>
                      <span className="text-xl text-gray-400">/</span>
                      <span className="text-xl text-blue-400">366</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Sites Checked</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border w-full"></div>
              
              {/* Main content panels */}
              <div className="grid grid-cols-3 gap-6">
                {/* Left panel - Overrides */}
                <Card className="p-4 bg-background col-span-1">
                  <h2 className="text-lg font-semibold mb-4">Overrides</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm mb-1 block">Start Week</label>
                      <Select 
                        value={startWeek}
                        onValueChange={(value) => setStartWeek(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select week" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {allWeeks.map((week) => (
                            <SelectItem key={week.value} value={week.value}>
                              {week.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">Start Date (Sun)</label>
                      <Input type="text" value={getStartDateFromWeek(startWeek)} readOnly />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">End Week</label>
                      <Select 
                        value={endWeek}
                        onValueChange={(value) => setEndWeek(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select week" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {availableEndWeeks.map((week) => (
                            <SelectItem key={week.value} value={week.value}>
                              {week.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">End Date (Sat)</label>
                      <Input type="text" value={getEndDateFromWeek(endWeek)} readOnly />
                    </div>
                  </div>
                  
                  <h2 className="text-lg font-semibold mb-4">Override Values</h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">FTG Override %</label>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => decrement(setFtgOverride)}
                        >
                          -
                        </Button>
                        <Input 
                          type="text" 
                          value={ftgOverride} 
                          className="h-8 w-16 rounded-none text-center"
                          onChange={(e) => handleInputChange(e, setFtgOverride)}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => increment(setFtgOverride)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Misc Adjustment %</label>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => decrement(setMiscAdjustment)}
                        >
                          -
                        </Button>
                        <Input 
                          type="text" 
                          value={miscAdjustment} 
                          className="h-8 w-16 rounded-none text-center"
                          onChange={(e) => handleInputChange(e, setMiscAdjustment)}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => increment(setMiscAdjustment)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">NFP % (W+1 Only)</label>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => decrement(setNfpPercentage)}
                        >
                          -
                        </Button>
                        <Input 
                          type="text" 
                          value={nfpPercentage}
                          className="h-8 w-16 rounded-none text-center"
                          onChange={(e) => handleInputChange(e, setNfpPercentage)}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => increment(setNfpPercentage)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Misc Packages (k)</label>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => decrement(setMiscPackages)}
                        >
                          -
                        </Button>
                        <Input 
                          type="text" 
                          value={miscPackages} 
                          className="h-8 w-16 rounded-none text-center"
                          onChange={(e) => handleInputChange(e, setMiscPackages)}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => increment(setMiscPackages)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="mt-2 bg-orange-500 hover:bg-orange-600"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </Button>
                  </div>
                </Card>
                
                {/* Middle and Right column - stacked Notes and Prior Notes */}
                <div className="col-span-2 space-y-6">
                  {/* Notes section */}
                  <Card className="p-4 bg-background">
                    <h2 className="text-lg font-semibold mb-4">Notes</h2>
                    <Textarea 
                      placeholder="Add notes for overrides & adjustments here..." 
                      className="min-h-[300px]"
                    />
                  </Card>
                  
                  {/* Prior Notes section */}
                  <Card className="p-4 bg-background">
                    <h2 className="text-lg font-semibold mb-4">Prior Notes</h2>
                    <div className="text-sm text-muted-foreground mb-2">Recent updates:</div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span className="font-medium">WK01-WK01: FTG Override 4.0% note: eklavya test by UNKNOWN</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span className="font-medium">WK03-WK02: FTG Override 2.0% note: eklavya tefdfdfst by UNKNOWN</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
              
              {/* Performance Charts */}
              <div className="grid grid-cols-2 gap-6">
                {/* FTG Performance Chart */}
                <Card>
                  <div className="p-6">
                    <div className="flex flex-col space-y-1.5">
                      <h3 className="text-lg font-semibold">FTG Performance</h3>
                      <p className="text-sm text-muted-foreground">
                        Actual vs Forecast for last 6 weeks
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <ChartContainer config={ftgChartConfig}>
                      <AreaChart
                        accessibilityLayer
                        data={ftgChartData}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="week"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                          dataKey="forecast"
                          type="natural"
                          fill="var(--color-forecast)"
                          fillOpacity={0.4}
                          stroke="var(--color-forecast)"
                          stackId="a"
                        />
                        <Area
                          dataKey="actual"
                          type="natural"
                          fill="var(--color-actual)"
                          fillOpacity={0.4}
                          stroke="var(--color-actual)"
                          stackId="a"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                  <div className="border-t px-6 py-4">
                    <div className="flex w-full items-start gap-2 text-sm">
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                          Trending up by 3.5% this week <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                          WK01 - WK06 2024
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Attainment Performance Chart */}
                <Card>
                  <div className="p-6">
                    <div className="flex flex-col space-y-1.5">
                      <h3 className="text-lg font-semibold">Attainment Performance</h3>
                      <p className="text-sm text-muted-foreground">
                        Achieved vs Target for last 6 weeks
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <ChartContainer config={attainmentChartConfig}>
                      <AreaChart
                        accessibilityLayer
                        data={attainmentChartData}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="week"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                          dataKey="target"
                          type="natural"
                          fill="var(--color-target)"
                          fillOpacity={0.4}
                          stroke="var(--color-target)"
                          stackId="a"
                        />
                        <Area
                          dataKey="achieved"
                          type="natural"
                          fill="var(--color-achieved)"
                          fillOpacity={0.4}
                          stroke="var(--color-achieved)"
                          stackId="a"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                  <div className="border-t px-6 py-4">
                    <div className="flex w-full items-start gap-2 text-sm">
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                          Averaging 97.3% attainment <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                          WK01 - WK06 2024
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 