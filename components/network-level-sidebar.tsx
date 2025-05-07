"use client"

import type * as React from "react"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowUpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  BarChartIcon,
  FolderIcon,
  DatabaseIcon,
  UsersIcon,
  SettingsIcon,
  ClipboardListIcon,
  FileIcon,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavDocuments } from "./nav-documents"
import { ThemeToggle } from "./theme-toggle"
import { SettingsDialog } from "./settings-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const data = {
  navMain: [
    {
      title: "Network Level View",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Regional Level View",
      url: "/regional-level-view",
      icon: BarChartIcon,
    },
    {
      title: "Jurisdiction Changes",
      url: "/jurisdiction-changes",
      icon: ListIcon,
    },
    {
      title: "Apply Overrides",
      url: "/apply-overrides",
      icon: BarChartIcon,
    },
    {
      title: "Planner Inputs",
      url: "/planner-inputs",
      icon: FolderIcon,
    },
    {
      title: "Overlapping Jurisdictions",
      url: "/overlapping-jurisdictions",
      icon: DatabaseIcon,
    },
    {
      title: "Plan Progression",
      url: "/plan-progression",
      icon: UsersIcon,
    },
    {
      title: "Current DSS",
      url: "/current-dss",
      icon: DatabaseIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
  ],
  documents: [
    {
      name: "AdHoc Stations",
      url: "/adhoc-stations",
      icon: DatabaseIcon,
    },
    {
      name: "Attainment Overrides",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "DoW Curve Overrides",
      url: "#",
      icon: FileIcon,
    },
  ],
}

export function NetworkLevelSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  const navSecondaryWithClickHandler = [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
      onClick: () => setSettingsOpen(true)
    },
  ]

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                <Link href="/">
                  <ArrowUpCircleIcon className="h-5 w-5" />
                  <span className="text-base font-semibold">S&OP Audit Portal</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          
          {/* Selection filter for Network Level View */}
          <div className="px-3 py-2">
            <h3 className="mb-2 px-1 text-sm font-medium">Filters</h3>
            <div className="space-y-2">
              <Select>
                <SelectTrigger id="week-sidebar" className="w-full">
                  <SelectValue placeholder="Week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week1">Week 1</SelectItem>
                  <SelectItem value="week2">Week 2</SelectItem>
                  <SelectItem value="week3">Week 3</SelectItem>
                  <SelectItem value="week4">Week 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1"></div>
          <NavDocuments items={data.documents} />
          <NavSecondary items={navSecondaryWithClickHandler} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <ThemeToggle />
          <SidebarSeparator />
        </SidebarFooter>
      </Sidebar>
      
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
} 