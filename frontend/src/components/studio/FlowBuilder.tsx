'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FlowDefinition, FlowNode, FlowNodeType } from '@/lib/flow-types';
import { studioApi } from '@/lib/api';
import { DEFAULT_FLOW } from '@/lib/default-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Save, Plus, Trash2, RefreshCw, WifiOff } from 'lucide-react';

const NODE_W = 200;
const NODE_H = 72;

const typeColors: Record<FlowNodeType, string> = {
  start: 'border-gray-400 bg-gray-50',
  message: 'border-gray-300 bg-white',
  choice: 'border-gray-300 bg-white',
  ai: 'border-gray-300 bg-white',
  capture: 'border-gray-300 bg-white',
  handoff: 'border-amber-300 bg-amber-50',
  end: 'border-gray-400 bg-gray-100',
};

export default function FlowBuilder() {
  const [flow, setFlow] = useState<FlowDefinition | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);

  const loadFlow = useCallback(async () => {
    setLoading(true);
    setFlow(structuredClone(DEFAULT_FLOW));
    setLoading(false);

    try {
      const remote = await studioApi.getFlow();
      if (remote?.nodes?.length) {
        setFlow(remote);
        setApiOnline(true);
      }
    } catch {
      setApiOnline(false);
      toast.message('Showing local workflow — start backend on port 3001 to sync', {
        duration: 5000,
      });
    }
  }, []);

  useEffect(() => {
    void loadFlow();
  }, [loadFlow]);

  const selected = flow?.nodes.find((n) => n.id === selectedId);

  const save = async () => {
    if (!flow) return;
    setSaving(true);
    try {
      await studioApi.saveFlow(flow);
      toast.success('Workflow published');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const updateNode = (id: string, patch: Partial<FlowNode>) => {
    if (!flow) return;
    setFlow({
      ...flow,
      nodes: flow.nodes.map((n) => (n.id === id ? { ...n, ...patch, data: { ...n.data, ...patch.data } } : n)),
    });
  };

  const addNode = (type: FlowNodeType) => {
    if (!flow) return;
    const id = `${type}_${Date.now()}`;
    const node: FlowNode = {
      id,
      type,
      data: type === 'message' ? { text: 'New message' } : type === 'choice' ? { text: 'Choose:', choices: [{ id: 'c1', label: 'Option 1' }] } : {},
      position: { x: 120 + flow.nodes.length * 40, y: 120 + flow.nodes.length * 30 },
    };
    setFlow({ ...flow, nodes: [...flow.nodes, node] });
    setSelectedId(id);
  };

  const removeNode = (id: string) => {
    if (!flow || id === 'start') return;
    setFlow({
      ...flow,
      nodes: flow.nodes.filter((n) => n.id !== id),
      edges: flow.edges.filter((e) => e.source !== id && e.target !== id),
    });
    setSelectedId(null);
  };

  const onDrag = useCallback(
    (id: string, dx: number, dy: number) => {
      if (!flow) return;
      setFlow({
        ...flow,
        nodes: flow.nodes.map((n) =>
          n.id === id
            ? { ...n, position: { x: n.position.x + dx, y: n.position.y + dy } }
            : n,
        ),
      });
    },
    [flow],
  );

  if (loading || !flow) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        Preparing canvas…
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0">
      <div className="flex flex-1 flex-col min-w-0 border-r border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{flow.name}</h2>
            <p className="text-xs text-gray-500">Drag nodes · Click to edit · Publish to go live</p>
            {!apiOnline && (
              <p className="flex items-center gap-1 text-xs text-amber-700 mt-1">
                <WifiOff size={12} />
                Offline mode — run: <code className="bg-amber-50 px-1 rounded">cd backend && npm run start:dev</code>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => void loadFlow()}>
              <RefreshCw size={14} className="mr-1" /> Reload
            </Button>
            <Button variant="outline" size="sm" onClick={() => addNode('message')}>
              <Plus size={14} className="mr-1" /> Message
            </Button>
            <Button variant="outline" size="sm" onClick={() => addNode('choice')}>
              <Plus size={14} className="mr-1" /> Choice
            </Button>
            <Button variant="outline" size="sm" onClick={() => addNode('ai')}>
              <Plus size={14} className="mr-1" /> AI
            </Button>
            <Button size="sm" onClick={save} disabled={saving} className="bg-gray-900 hover:bg-gray-800">
              <Save size={14} className="mr-1" />
              {saving ? 'Publishing…' : 'Publish'}
            </Button>
          </div>
        </div>

        <div
          className="relative flex-1 overflow-auto bg-[#fafafa] bg-[length:20px_20px] bg-[image:linear-gradient(#eee_1px,transparent_1px),linear-gradient(90deg,#eee_1px,transparent_1px)]"
          style={{ minHeight: 520 }}
        >
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            style={{ width: 1500, height: 700 }}
          >
            {flow.edges.map((e) => {
              const s = flow.nodes.find((n) => n.id === e.source);
              const t = flow.nodes.find((n) => n.id === e.target);
              if (!s || !t) return null;
              const x1 = s.position.x + NODE_W / 2;
              const y1 = s.position.y + NODE_H / 2;
              const x2 = t.position.x + NODE_W / 2;
              const y2 = t.position.y + NODE_H / 2;
              return (
                <line
                  key={e.id}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#9ca3af"
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                />
              );
            })}
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#9ca3af" />
              </marker>
            </defs>
          </svg>

          {flow.nodes.map((node) => (
            <FlowNodeCard
              key={node.id}
              node={node}
              selected={selectedId === node.id}
              onSelect={() => setSelectedId(node.id)}
              onDrag={onDrag}
            />
          ))}
        </div>
      </div>

      <div className="w-80 shrink-0 bg-white p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Inspector</h3>
        {selected ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 uppercase">{selected.type}</p>
            <Input
              value={selected.id}
              disabled
              className="text-xs bg-gray-50"
            />
            {(selected.type === 'message' ||
              selected.type === 'choice' ||
              selected.type === 'capture' ||
              selected.type === 'handoff' ||
              selected.type === 'end') && (
              <textarea
                className="w-full rounded-md border border-gray-200 p-2 text-sm min-h-[100px]"
                value={selected.data.text || ''}
                onChange={(e) => updateNode(selected.id, { data: { text: e.target.value } })}
                placeholder="Message text"
              />
            )}
            {selected.type === 'ai' && (
              <textarea
                className="w-full rounded-md border border-gray-200 p-2 text-sm min-h-[100px]"
                value={selected.data.prompt || ''}
                onChange={(e) => updateNode(selected.id, { data: { prompt: e.target.value } })}
                placeholder="AI system prompt"
              />
            )}
            {selected.type === 'choice' && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">Choices (label = user reply)</p>
                {(selected.data.choices || []).map((c, i) => (
                  <Input
                    key={c.id}
                    value={c.label}
                    onChange={(e) => {
                      const choices = [...(selected.data.choices || [])];
                      choices[i] = { ...c, label: e.target.value };
                      updateNode(selected.id, { data: { choices } });
                    }}
                  />
                ))}
              </div>
            )}
            {selected.id !== 'start' && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200"
                onClick={() => removeNode(selected.id)}
              >
                <Trash2 size={14} className="mr-1" /> Delete node
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Select a node on the canvas</p>
        )}
      </div>
    </div>
  );
}

function FlowNodeCard({
  node,
  selected,
  onSelect,
  onDrag,
}: {
  node: FlowNode;
  selected: boolean;
  onSelect: () => void;
  onDrag: (id: string, dx: number, dy: number) => void;
}) {
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      onClick={onSelect}
      onMouseDown={(e) => {
        dragRef.current = { x: e.clientX, y: e.clientY };
        const move = (ev: MouseEvent) => {
          if (!dragRef.current) return;
          onDrag(node.id, ev.clientX - dragRef.current.x, ev.clientY - dragRef.current.y);
          dragRef.current = { x: ev.clientX, y: ev.clientY };
        };
        const up = () => {
          dragRef.current = null;
          window.removeEventListener('mousemove', move);
          window.removeEventListener('mouseup', up);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
      }}
      className={`absolute cursor-grab active:cursor-grabbing rounded-lg border-2 px-3 py-2 shadow-sm ${typeColors[node.type]} ${selected ? 'ring-2 ring-gray-900 ring-offset-2' : ''}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: NODE_W,
        minHeight: NODE_H,
      }}
    >
      <p className="text-[10px] font-bold uppercase text-gray-500">{node.type}</p>
      <p className="text-xs text-gray-800 line-clamp-2 mt-0.5">
        {node.data.text || node.data.prompt || node.id}
      </p>
    </div>
  );
}
