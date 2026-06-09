"use client";

import { useHealth } from "@/hooks/useChat";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { data: health } = useHealth();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Backend Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span>API Status</span>
            <Badge variant={health ? "default" : "destructive"}>
              {health ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          {health && (
            <>
              <div className="flex items-center justify-between">
                <span>Version</span>
                <span className="text-sm text-muted-foreground">
                  {health.version}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Uptime</span>
                <span className="text-sm text-muted-foreground">
                  {Math.floor(health.uptime)}s
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure via environment variables:{" "}
            <code className="text-sm bg-muted px-1 rounded">
              AI_PROVIDER
            </code>
            ,{" "}
            <code className="text-sm bg-muted px-1 rounded">
              OPENAI_API_KEY
            </code>
            ,{" "}
            <code className="text-sm bg-muted px-1 rounded">
              GROQ_API_KEY
            </code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}