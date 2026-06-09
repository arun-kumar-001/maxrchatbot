"use client";

import { useKnowledgeArticles, useReindexKnowledge } from "@/hooks/useKnowledge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";

export default function KnowledgePage() {
  const { data: articles, isLoading, error } = useKnowledgeArticles();
  const reindex = useReindexKnowledge();

  const handleReindex = () => {
    reindex.mutate(undefined, {
      onSuccess: (data) =>
        toast.success(`Reindexed ${data.reindexed} articles`),
      onError: () => toast.error("Failed to reindex"),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <Button
          variant="outline"
          onClick={handleReindex}
          disabled={reindex.isPending}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${reindex.isPending ? "animate-spin" : ""}`}
          />
          Reindex All
        </Button>
      </div>

      {error && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Unable to load knowledge base. Backend may be offline.
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
              Articles ({articles?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(!articles || articles.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                No articles yet. Upload documents via the API.
              </p>
            )}
            <div className="space-y-3">
              {(articles || []).map((article: any) => (
                <div
                  key={article.id}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                >
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{article.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {article.source_type} ·{" "}
                      {new Date(article.created_at).toLocaleDateString()} ·{" "}
                      {article.content?.length} chars
                    </p>
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