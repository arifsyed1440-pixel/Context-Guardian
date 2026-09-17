export type ScreenType = 'home' | 'capture' | 'input' | 'analysis' | 'graph' | 'dossier';

export interface TemporalContext {
  eventTiming?: string;      // e.g., "Tomorrow's project review"
  taskDeadline?: string;     // e.g., "Before 5 PM"
  rawExpressions: string[];  // e.g., ["tomorrow's project review", "before 5 PM"]
}

export interface LinkedArtifact {
  id: string;
  name: string;             // e.g., "prototype-v3.zip" or "architecture.pptx"
  conceptRef: string;       // References the extracted concept, e.g. "Prototype"
  fileType: 'archive' | 'presentation' | 'document' | 'design' | 'code';
  size?: string;
  url?: string;
}

export interface ContextObject {
  id: string;
  createdAt: string;        // ISO timestamp
  sourceType: 'text' | 'screenshot' | 'demo';
  rawText: string;

  // Extracted Core Semantic Entities
  actor: string;            // e.g., "Rahul"
  actions: string[];        // e.g., ["Bring latest prototype", "Update architecture slides"]
  purpose: string;          // e.g., "Project Review"
  temporal: TemporalContext; // Distinct event timing vs task deadline
  artifacts: string[];      // Directly extracted concepts: ["Prototype", "Architecture slides"]

  // Associated Context Metadata
  linkedArtifacts: LinkedArtifact[]; // Demo-linked/associated files tied to concepts
  confidenceScore: number;  // 0.0 - 1.0 (local extraction heuristic score)
  category: 'Review' | 'Handover' | 'Urgent' | 'General';
  status: 'active' | 'completed' | 'archived';
  completedActions: string[]; // Set of completed action strings
}

export interface ExtractionResult {
  context: ContextObject;
  debugSteps: string[];
}
