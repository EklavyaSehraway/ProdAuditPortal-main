import { SectionCards } from "../../components/section-cards"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RegionalLevelSidebar } from "../../components/regional-level-sidebar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function RegionalLevelPage() {
  return (
    <SidebarProvider>
      <RegionalLevelSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              
              <Tabs defaultValue="w1-wape" className="flex w-full flex-col justify-start gap-6 px-4 lg:px-6">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="w1-wape">W-1 WAPE</TabsTrigger>
                  <TabsTrigger value="w3-wape" className="gap-1">
                    W-3 WAPE
                  </TabsTrigger>
                  <TabsTrigger value="low-utilization" className="gap-1">
                    Low Utilization
                  </TabsTrigger>
                  <TabsTrigger value="high-utilization">High Utilization</TabsTrigger>
                  <TabsTrigger value="coh-flag">COH Flag</TabsTrigger>
                </TabsList>
                
                {/* Tab content container with fixed height */}
                <div className="h-[calc(100vh-26rem)] min-h-[400px]">
                  {/* W-1 WAPE Tab */}
                  <TabsContent value="w1-wape" className="flex flex-col h-full data-[state=inactive]:hidden">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Region</TableHead>
                            <TableHead>MSA</TableHead>
                            <TableHead>Week</TableHead>
                            <TableHead>WAPE</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell>North</TableCell>
                              <TableCell>MSA-{i+1}</TableCell>
                              <TableCell>Week 1</TableCell>
                              <TableCell>{(Math.random() * 10).toFixed(2)}%</TableCell>
                              <TableCell>{i % 2 === 0 ? "Approved" : "Pending"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  {/* W-3 WAPE Tab */}
                  <TabsContent value="w3-wape" className="flex flex-col h-full data-[state=inactive]:hidden">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Region</TableHead>
                            <TableHead>MSA</TableHead>
                            <TableHead>Week</TableHead>
                            <TableHead>WAPE</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell>East</TableCell>
                              <TableCell>MSA-{i+10}</TableCell>
                              <TableCell>Week 3</TableCell>
                              <TableCell>{(Math.random() * 10).toFixed(2)}%</TableCell>
                              <TableCell>{i % 2 === 0 ? "Approved" : "Pending"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  {/* Low Utilization Tab */}
                  <TabsContent value="low-utilization" className="flex flex-col h-full data-[state=inactive]:hidden">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Region</TableHead>
                            <TableHead>MSA</TableHead>
                            <TableHead>Station</TableHead>
                            <TableHead>Utilization</TableHead>
                            <TableHead>Action Required</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell>South</TableCell>
                              <TableCell>MSA-{i+20}</TableCell>
                              <TableCell>Station {i+1}</TableCell>
                              <TableCell>{(Math.random() * 50).toFixed(2)}%</TableCell>
                              <TableCell>{i % 2 === 0 ? "Yes" : "No"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  {/* High Utilization Tab */}
                  <TabsContent value="high-utilization" className="flex flex-col h-full data-[state=inactive]:hidden">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Region</TableHead>
                            <TableHead>MSA</TableHead>
                            <TableHead>Station</TableHead>
                            <TableHead>Utilization</TableHead>
                            <TableHead>Action Required</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell>West</TableCell>
                              <TableCell>MSA-{i+30}</TableCell>
                              <TableCell>Station {i+1}</TableCell>
                              <TableCell>{(Math.random() * 30 + 70).toFixed(2)}%</TableCell>
                              <TableCell>{i % 2 === 0 ? "Yes" : "No"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  {/* COH Flag Tab */}
                  <TabsContent value="coh-flag" className="flex flex-col h-full data-[state=inactive]:hidden">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Region</TableHead>
                            <TableHead>MSA</TableHead>
                            <TableHead>Station</TableHead>
                            <TableHead>COH Status</TableHead>
                            <TableHead>Date Added</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell>{["North", "South", "East", "West", "Central"][i]}</TableCell>
                              <TableCell>MSA-{i+40}</TableCell>
                              <TableCell>Station {i+1}</TableCell>
                              <TableCell>{i % 2 === 0 ? "Flagged" : "Clear"}</TableCell>
                              <TableCell>2023/0{i+1}/01</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 