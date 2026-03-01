"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  LayoutDashboard,
  Menu,
  Search,
  Server,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/Badge";

export function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Logs Explorer", href: "/logs", icon: Search },
      { label: "Services", href: "/services", icon: Server },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
    []
  );

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-4 z-50 rounded-md border border-border bg-card/80 p-2 text-foreground md:hidden"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/55 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-72 border-r border-border/70 bg-card/75 px-4 backdrop-blur-xl transition-transform md:relative md:translate-x-0",
          !sidebarOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center border-b border-border/60 px-2">
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-primary/40 bg-primary/20 p-2 text-primary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">LogScope</p>
              <p className="text-xs text-muted-foreground">Realtime Intelligence</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1 px-2 py-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/70 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border/60 p-4">
          <div className="surface p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">System status</span>
              <Badge variant="success">Live</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Latency target: &lt; 2s</p>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Header() {
  const pathname = usePathname();

  const title = useMemo(() => {
    if (pathname.startsWith("/logs")) return "Logs Explorer";
    if (pathname.startsWith("/services")) return "Service Insights";
    if (pathname.startsWith("/analytics")) return "Analytics";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Overview";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 bg-background/75 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold tracking-tight md:text-xl">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="info" className="hidden sm:inline-flex">
          <Sparkles className="mr-1 h-3 w-3" />
          realtime mode
        </Badge>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="flex h-11 items-center justify-between border-t border-border/70 px-6 text-xs text-muted-foreground">
      <p>LogScope • Observability Suite</p>
      <p>Built for high-volume systems</p>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
