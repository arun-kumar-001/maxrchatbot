"use client";

import { useDashboard } from "@/hooks/useChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data, isLoading, error } = useDashboard();

  const stats = [
    {
      title: "Active Chats",
      value: data?.activeChats ?? 0,
      icon: MessageCircle,
      color: "text-blue-600",
    },
    {
      title: "Total Leads",
      value: data?.totalLeads ?? 0,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Today's Chats",
      value: data?.todayChats ?? 0,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Total Conversations",
      value: data?.totalConversations ?? 0,
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Unable to load dashboard data.{" "}
            {error instanceof Error ? error.message : "Backend may be offline."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}