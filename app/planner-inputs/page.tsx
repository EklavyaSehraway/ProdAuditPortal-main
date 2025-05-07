import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PlannerInputs() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-4">Planner Inputs</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm">
                    <CardHeader className="bg-primary/10 rounded-t-lg">
                      <CardTitle>West</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Tabs defaultValue="ftg-override" className="w-full">
                        <TabsList className="grid grid-cols-4 mb-4">
                          <TabsTrigger value="ftg-override">FTG Override</TabsTrigger>
                          <TabsTrigger value="attn-overrides">Attn Overrides</TabsTrigger>
                          <TabsTrigger value="misc-adjust">Misc Adjust</TabsTrigger>
                          <TabsTrigger value="dow">DoW</TabsTrigger>
                        </TabsList>
                        <TabsContent value="ftg-override">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">FTG Override content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="attn-overrides">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">Attn Overrides content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="misc-adjust">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">Misc Adjust content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="dow">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">DoW content</p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader className="bg-primary/10 rounded-t-lg">
                      <CardTitle>East</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Tabs defaultValue="ftg-override" className="w-full">
                        <TabsList className="grid grid-cols-4 mb-4">
                          <TabsTrigger value="ftg-override">FTG Override</TabsTrigger>
                          <TabsTrigger value="attn-overrides">Attn Overrides</TabsTrigger>
                          <TabsTrigger value="misc-adjust">Misc Adjust</TabsTrigger>
                          <TabsTrigger value="dow">DoW</TabsTrigger>
                        </TabsList>
                        <TabsContent value="ftg-override">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">FTG Override content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="attn-overrides">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">Attn Overrides content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="misc-adjust">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">Misc Adjust content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="dow">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">DoW content</p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader className="bg-primary/10 rounded-t-lg">
                      <CardTitle>South</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Tabs defaultValue="ftg-override" className="w-full">
                        <TabsList className="grid grid-cols-4 mb-4">
                          <TabsTrigger value="ftg-override">FTG Override</TabsTrigger>
                          <TabsTrigger value="attn-overrides">Attn Overrides</TabsTrigger>
                          <TabsTrigger value="misc-adjust">Misc Adjust</TabsTrigger>
                          <TabsTrigger value="dow">DoW</TabsTrigger>
                        </TabsList>
                        <TabsContent value="ftg-override">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">FTG Override content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="attn-overrides">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">Attn Overrides content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="misc-adjust">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">Misc Adjust content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="dow">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">DoW content</p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader className="bg-primary/10 rounded-t-lg">
                      <CardTitle>Central</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Tabs defaultValue="ftg-override" className="w-full">
                        <TabsList className="grid grid-cols-4 mb-4">
                          <TabsTrigger value="ftg-override">FTG Override</TabsTrigger>
                          <TabsTrigger value="attn-overrides">Attn Overrides</TabsTrigger>
                          <TabsTrigger value="misc-adjust">Misc Adjust</TabsTrigger>
                          <TabsTrigger value="dow">DoW</TabsTrigger>
                        </TabsList>
                        <TabsContent value="ftg-override">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">FTG Override content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="attn-overrides">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">Attn Overrides content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="misc-adjust">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">Misc Adjust content</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="dow">
                          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                            <p className="text-muted-foreground">DoW content</p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 