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

export interface FlowState {
  currentNodeId: string | null;
  variables: Record<string, string>;
  awaiting: 'none' | 'choice' | 'text';
  choiceNodeId?: string;
  completed: boolean;
}

export interface BotReplyMessage {
  type: 'text' | 'choice';
  content: string;
  choices?: FlowChoice[];
}

export interface BotTurnResult {
  messages: BotReplyMessage[];
  state: FlowState;
  escalated?: boolean;
}
