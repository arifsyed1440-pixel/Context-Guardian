import type { ContextObject } from '../types/context';

const STORAGE_KEY = 'context_guardian_contexts_v1';
const ACTIVE_CONTEXT_ID_KEY = 'context_guardian_active_id_v1';

export const INITIAL_DEMO_CONTEXTS: ContextObject[] = [
  {
    id: 'demo-rahul-review',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    sourceType: 'demo',
    rawText: "Rahul: Hey, for tomorrow's project review, please bring the latest prototype. Also update the architecture slides before 5 PM.",
    actor: 'Rahul',
    actions: [
      'Bring latest prototype',
      'Update architecture slides'
    ],
    purpose: 'Project Review',
    temporal: {
      eventTiming: "Tomorrow's project review",
      taskDeadline: 'Before 5 PM',
      rawExpressions: ["tomorrow's project review", "before 5 PM"]
    },
    artifacts: [
      'Prototype',
      'Architecture slides'
    ],
    linkedArtifacts: [
      {
        id: 'art-proto-v3',
        name: 'prototype-v3.zip',
        conceptRef: 'Prototype',
        fileType: 'archive',
        size: '14.2 MB'
      },
      {
        id: 'art-arch-pptx',
        name: 'architecture.pptx',
        conceptRef: 'Architecture slides',
        fileType: 'presentation',
        size: '4.8 MB'
      }
    ],
    confidenceScore: 0.96,
    category: 'Review',
    status: 'active',
    completedActions: []
  },
  {
    id: 'demo-priya-handover',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    sourceType: 'demo',
    rawText: "Priya: For the mobile design handover, please verify the onboarding Figma components and export the SVG icon kit by Friday.",
    actor: 'Priya',
    actions: [
      'Verify onboarding Figma components',
      'Export SVG icon kit'
    ],
    purpose: 'Design Handover',
    temporal: {
      eventTiming: 'Mobile design handover',
      taskDeadline: 'By Friday',
      rawExpressions: ['mobile design handover', 'by Friday']
    },
    artifacts: [
      'Design Specs',
      'Specification Doc'
    ],
    linkedArtifacts: [
      {
        id: 'art-priya-fig',
        name: 'onboarding-flow-v2.fig',
        conceptRef: 'Design Specs',
        fileType: 'design',
        size: '28.4 MB'
      },
      {
        id: 'art-priya-svg',
        name: 'icons-bundle.zip',
        conceptRef: 'Specification Doc',
        fileType: 'archive',
        size: '2.1 MB'
      }
    ],
    confidenceScore: 0.92,
    category: 'Handover',
    status: 'active',
    completedActions: ['Verify onboarding Figma components']
  },
  {
    id: 'demo-alex-bug',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    sourceType: 'demo',
    rawText: "Alex: We need to fix the memory leak in production sync before tonight's 8 PM release. Review the crash logs on Sentry.",
    actor: 'Alex',
    actions: [
      'Fix memory leak in production sync',
      'Review crash logs on Sentry'
    ],
    purpose: 'Incident Response',
    temporal: {
      eventTiming: "Tonight's 8 PM release",
      taskDeadline: 'Before 8 PM',
      rawExpressions: ["tonight's 8 PM release", "before tonight's 8 PM"]
    },
    artifacts: [
      'Codebase Repo',
      'Specification Doc'
    ],
    linkedArtifacts: [
      {
        id: 'art-alex-sentry',
        name: 'sentry-crash-report.json',
        conceptRef: 'Specification Doc',
        fileType: 'document',
        size: '340 KB'
      },
      {
        id: 'art-alex-git',
        name: 'hotfix/sync-leak.patch',
        conceptRef: 'Codebase Repo',
        fileType: 'code',
        size: '18 KB'
      }
    ],
    confidenceScore: 0.94,
    category: 'Urgent',
    status: 'active',
    completedActions: []
  }
];

export function getStoredContexts(): ContextObject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CONTEXTS));
      return INITIAL_DEMO_CONTEXTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_CONTEXTS;
  } catch (err) {
    console.error('Failed to read contexts from localStorage:', err);
    return INITIAL_DEMO_CONTEXTS;
  }
}

export function saveContext(context: ContextObject): void {
  try {
    const contexts = getStoredContexts();
    const existingIndex = contexts.findIndex(c => c.id === context.id);
    let updated: ContextObject[];
    if (existingIndex >= 0) {
      updated = [...contexts];
      updated[existingIndex] = context;
    } else {
      updated = [context, ...contexts];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_CONTEXT_ID_KEY, context.id);
  } catch (err) {
    console.error('Failed to save context to localStorage:', err);
  }
}

export function deleteContext(id: string): ContextObject[] {
  try {
    const contexts = getStoredContexts().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contexts));
    return contexts;
  } catch (err) {
    console.error('Failed to delete context:', err);
    return [];
  }
}

export function getActiveContextId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_CONTEXT_ID_KEY);
  } catch {
    return null;
  }
}

export function setActiveContextId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_CONTEXT_ID_KEY, id);
  } catch (err) {
    console.error('Failed to set active context id:', err);
  }
}
