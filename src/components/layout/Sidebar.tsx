'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BedDouble,
  Users,
  Building2,
  Scissors,
  Receipt,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import nexusLogo from "@/assets/nexus-logo.jpg";

interface SubNavItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

interface NestedNavItem {
  title: string;
  icon: React.ElementType;
  children?: { title: string; path: string }[];
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  children?: SubNavItem[];
  nestedChildren?: NestedNavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: BedDouble,
    path: "/dashboard",
  },
  {
    title: "Patient Management",
    icon: Users,
    nestedChildren: [
      {
        title: "Patient",
        icon: Users,
        children: [
          { title: "Add", path: "/patients/add" },
          { title: "Get", path: "/patients/search" },
        ],
      },
      {
        title: "Transfer Patient",
        icon: Users,
        children: [
          { title: "Transfer", path: "/patients/transfer" },
        ],
      },
      {
        title: "Admin/Discharge",
        icon: Users,
        children: [
          { title: "Get", path: "/patients/admission-search" },
          { title: "Add", path: "/patients/admission-add" },
        ],
      },
    ],
  },
  {
    title: "IPD/Ward",
    icon: Building2,
    nestedChildren: [
      {
        title: "Floors",
        icon: Building2,
        children: [
          { title: "Add", path: "/ipd/add-floor" },
          { title: "Get", path: "/ipd/floors" },
        ],
      },
      {
        title: "Rooms",
        icon: Building2,
        children: [
          { title: "Add", path: "/ipd/add-room" },
          { title: "Get", path: "/ipd/rooms" },
        ],
      },
      {
        title: "Department",
        icon: Building2,
        children: [
          { title: "Add", path: "/ipd/add-department" },
          { title: "Get", path: "/ipd/department" },
        ],
      },
      {
        title: "Room Types",
        icon: Building2,
        children: [
          { title: "Add", path: "/ipd/add-room-type" },
          { title: "Get", path: "/ipd/room-types" },
        ],
      },
      {
        title: "Beds",
        icon: BedDouble,
        children: [
          { title: "Add", path: "/ipd/beds/add" },
          { title: "Get", path: "/ipd/beds" },
        ],
      },
      {
        title: "OT Rooms",
        icon: Scissors,
        children: [
          { title: "Add", path: "/ipd/add-ot-room" },
          { title: "Get", path: "/ipd/ot-rooms" },
        ],
      },
    ],
  },
  {
    title: "OT Modules",
    icon: Scissors,
    nestedChildren: [
      {
        title: "OT Slot",
        icon: Scissors,
        children: [
          { title: "Add", path: "/ot/add-slot" },
          { title: "Get", path: "/ot/slots" },
        ],
      },
      {
        title: "OT Inventory",
        icon: Scissors,
        children: [
          { title: "Add", path: "/ot/add-inventory" },
          { title: "Get", path: "/ot/inventory" },
        ],
      },
    ],
  },
  {
    title: "Billing/Finance",
    icon: Receipt,
    children: [
      { title: "Create Bill", icon: Receipt, path: "/billing/create" },
      { title: "Get Bill", icon: Receipt, path: "/billing/search" },
      { title: "Create Final Bill", icon: Receipt, path: "/billing/create-final" },
      { title: "Get Final Bill", icon: Receipt, path: "/billing/get-final" },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
];

export default function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Patient Management", "IPD/Ward"]);
  const [expandedNestedItems, setExpandedNestedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const toggleNestedExpand = (title: string) => {
    setExpandedNestedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.endsWith(path);
  };

  const isParentActive = (children?: { path: string }[]) =>
    children?.some((child) => isActive(child.path));

  const isNestedParentActive = (nestedChildren?: NestedNavItem[]) =>
    nestedChildren?.some((nested) =>
      nested.children?.some((child) => isActive(child.path))
    );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </Button>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300",
          "lg:relative lg:translate-x-0",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
          "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border">
          <img src={nexusLogo.src} alt="Nexus Logo" className="w-10 h-10 rounded-xl shadow-md object-cover" />
          <div>
            <h1 className="font-bold text-sidebar-foreground">Nexus Bed Management</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.path ? (
                <Link
                  href={item.path}
                  onClick={() => setIsCollapsed(true)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(item.path)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              ) : item.nestedChildren ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isNestedParentActive(item.nestedChildren)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {expandedItems.includes(item.title) && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-sidebar-border pl-3">
                      {item.nestedChildren.map((nested) => (
                        <div key={nested.title}>
                          <button
                            onClick={() => toggleNestedExpand(nested.title)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                              nested.children?.some((c) => isActive(c.path))
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )}
                          >
                            <nested.icon className="w-4 h-4" />
                            <span className="flex-1 text-left">{nested.title}</span>
                            {expandedNestedItems.includes(nested.title) ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                          </button>

                          {expandedNestedItems.includes(nested.title) && nested.children && (
                            <div className="ml-4 mt-1 space-y-1 pl-3">
                              {nested.children.map((subChild) => (
                                <Link
                                  key={subChild.path}
                                  href={subChild.path}
                                  onClick={() => setIsCollapsed(true)}
                                  className={cn(
                                    "flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs transition-all duration-200",
                                    isActive(subChild.path)
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                  )}
                                >
                                  <span>{subChild.title}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isParentActive(item.children)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {expandedItems.includes(item.title) && item.children && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-sidebar-border pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          onClick={() => setIsCollapsed(true)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            isActive(child.path)
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          )}
                        >
                          <child.icon className="w-4 h-4" />
                          <span>{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
