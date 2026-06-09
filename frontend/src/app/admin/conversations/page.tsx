"use client";

import { useConversations } from "@/hooks/useChat";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  waiting: "bg-yellow-500",
  escalated: "bg-red-500",
  resolved: "bg-gray-500",
};

export default function ConversationsPage() {
  const [search, setSearch] = useState("");
  const { data: conversations, isLoading, error } = useConversations();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Conversations</h1>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Unable to load conversations. Backend may be offline.
          </p>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              All Conversations ({conversations?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(!conversations || conversations.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                No conversations yet.
              </p>
            )}
            <div className="space-y-3">
              {(conversations || [])
                .filter(
                  (c: any) =>
                    !search ||
                    c.id?.toLowerCase().includes(search.toLowerCase())
                )
                .map((conversation: any) => (
                  <div
                    key={conversation.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          statusColors[conversation.status] || "bg-gray-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm">
                          Conversation {conversation.id?.slice(0, 8)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {conversation.status} &middot;{" "}
                          {new Date(
                            conversation.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          conversation.status === "active"
                            ? "default"
                            : conversation.status === "escalated"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {conversation.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}