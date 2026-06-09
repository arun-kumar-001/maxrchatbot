"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookOpen,
  Settings,
  Bot,
  Inbox,
  BarChart3,
  Puzzle,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/knowledge", label: "Knowledge Base", icon: BookOpen },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/admin/dashboard">
          <h2 className="text-lg font-bold">MAXR</h2>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </Link>
      </div>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}