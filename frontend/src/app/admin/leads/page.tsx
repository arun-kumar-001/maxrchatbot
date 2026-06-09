"use client";

import { useLeads, useUpdateLead } from "@/hooks/useLeads";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  new: "bg-blue-500",
  qualified: "bg-green-500",
  contacted: "bg-yellow-500",
  converted: "bg-purple-500",
  closed: "bg-gray-500",
};

export default function LeadsPage() {
  const { data: leads, isLoading, error } = useLeads();
  const updateLead = useUpdateLead();

  const handleStatusChange = (id: string, status: string) => {
    updateLead.mutate(
      { id, status },
      { onSuccess: () => toast.success(`Lead moved to ${status}`) }
    );
  };

  const handleExport = () => {
    if (!leads) return;
    const csv = [
      "Name,Email,Phone,Company,Status,Created",
      ...leads.map(
        (l: any) =>
          `${l.name || ""},${l.email || ""},${l.phone || ""},${l.company || ""},${l.status},${l.created_at}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {error && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Unable to load leads. Backend may be offline.
          </p>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pipeline ({leads?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {(!leads || leads.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                No leads captured yet.
              </p>
            )}
            <div className="space-y-3">
              {(leads || []).map((lead: any) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        statusColors[lead.status] || "bg-gray-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">
                        {lead.name || lead.email || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lead.company ? `${lead.company} · ` : ""}
                        {lead.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead.id, e.target.value)
                      }
                      className="text-sm border rounded px-2 py-1"
                    >
                      {["new", "qualified", "contacted", "converted", "closed"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        )
                      )}
                    </select>
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