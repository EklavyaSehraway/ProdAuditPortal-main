"use client"

import { useState } from "react"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { NetworkLevelSidebar } from "../../components/network-level-sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AdhocStationsPage() {
  const [stations, setStations] = useState("")

  const handleSave = () => {
    // Here you would typically send the data to an API
    // For now, we'll just show a toast notification
    toast({
      title: "Stations Saved",
      description: "Your stations have been saved successfully.",
    })
  }

  return (
    <SidebarProvider>
      <NetworkLevelSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-semibold tracking-tight">AdHoc Stations</h1>
                <p className="text-muted-foreground">Manage AdHoc stations here.</p>
              </div>
              
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Enter AdHoc Stations</CardTitle>
                    <CardDescription>
                      Enter one station ID per line or separate multiple stations with commas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="Enter station IDs here..."
                      className="min-h-[200px]"
                      value={stations}
                      onChange={(e) => setStations(e.target.value)}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="ml-auto"
                      onClick={handleSave}
                    >
                      Save Stations
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
} 