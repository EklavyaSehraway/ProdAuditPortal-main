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
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
