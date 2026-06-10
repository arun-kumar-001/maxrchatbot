'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Upload,
  Search,
  Trash2,
  RefreshCw,
  Plus,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const mockDocuments = [
  {
    id: '1',
    name: 'Pricing_Guide_2024.pdf',
    size: '1.2 MB',
    status: 'indexed',
    date: '2023-11-01',
    chunks: 45,
  },
  {
    id: '2',
    name: 'FAQ_Technical_Support.docx',
    size: '850 KB',
    status: 'indexed',
    date: '2023-10-28',
    chunks: 28,
  },
  {
    id: '3',
    name: 'Company_Policy.txt',
    size: '120 KB',
    status: 'processing',
    date: '2023-11-05',
    chunks: 0,
  },
];

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Upload documents to train your AI assistant on your business.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reindex All
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Storage Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Used Space</span>
                <span className="font-medium">2.17 MB / 100 MB</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[2%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Documents</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Total Chunks</span>
                <span className="font-medium">73</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search documents..." className="pl-10" />
          </div>

          <div className="grid gap-4">
            {mockDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-primary">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.date}</span>
                        <span>•</span>
                        <span>{doc.chunks} chunks</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {doc.status === 'indexed' ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                        <CheckCircle2 size={12} className="mr-1" />
                        Indexed
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">
                        <Clock size={12} className="mr-1" />
                        Processing
                      </Badge>
                    )}
                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
