"use client"

import type * as React from "react"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavDocuments } from "./nav-documents"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { ThemeToggle } from "./theme-toggle"
import { SettingsDialog } from "./settings-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Use the same data structure as in app-sidebar
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
  ],
}

export function ApplyOverridesSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
          
          {/* Selection filters for Apply Overrides */}
          <div className="px-3 py-2">
            <h3 className="mb-2 px-1 text-sm font-medium">Filters</h3>
            <div className="space-y-2">
              <Select>
                <SelectTrigger id="region-sidebar" className="w-full">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger id="msa-sidebar" className="w-full">
                  <SelectValue placeholder="MSA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="msa1">MSA 1</SelectItem>
                  <SelectItem value="msa2">MSA 2</SelectItem>
                  <SelectItem value="msa3">MSA 3</SelectItem>
                  <SelectItem value="msa4">MSA 4</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger id="station-sidebar" className="w-full">
                  <SelectValue placeholder="Station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="station1">Station 1</SelectItem>
                  <SelectItem value="station2">Station 2</SelectItem>
                  <SelectItem value="station3">Station 3</SelectItem>
                  <SelectItem value="station4">Station 4</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger id="Week-sidebar" className="w-full">
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