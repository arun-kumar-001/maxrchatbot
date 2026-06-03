export type FlowNodeType =
  | 'start'
  | 'message'
  | 'choice'
  | 'ai'
  | 'capture'
  | 'handoff'
  | 'end';

export interface FlowChoice {
  id: string;
  label: string;
}

export interface FlowNodeData {
  text?: string;
  choices?: FlowChoice[];
  prompt?: string;
  field?: 'name' | 'email' | 'phone' | 'company';
  variable?: string;
}

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  data: FlowNodeData;
  position: { x: number; y: number };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
}

export interface FlowDefinition {
  id: string;
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}
