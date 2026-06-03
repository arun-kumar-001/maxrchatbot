'use client';

import { useEffect, useState } from 'react';
import { studioDataApi, type KnowledgeArticle } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function BotKnowledgePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    studioDataApi.getKnowledge().then(setArticles).catch(() => setArticles([]));
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content required');
      return;
    }
    setLoading(true);
    try {
      await studioDataApi.uploadKnowledge({ title, content });
      toast.success('Indexed for RAG');
      setTitle('');
      setContent('');
      load();
    } catch {
      toast.error('Upload failed — check backend, OpenAI & Qdrant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-slate-900">Add knowledge</h2>
          <p className="text-sm text-slate-500">Powers AI nodes in your workflow</p>
          <Input
            placeholder="Article title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white"
          />
          <textarea
            className="w-full min-h-[140px] rounded-lg border border-slate-200 p-3 text-sm bg-white"
            placeholder="Paste docs, FAQs, or policies…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button onClick={upload} disabled={loading} className="bg-slate-900 hover:bg-slate-800">
            {loading ? 'Indexing…' : 'Add & index'}
          </Button>
        </div>
        <ul className="space-y-2">
          {articles.map((a) => (
            <li key={a.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="font-medium text-slate-900">{a.title}</p>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{a.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
