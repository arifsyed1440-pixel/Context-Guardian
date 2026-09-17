import { Node, Edge, MarkerType } from '@xyflow/react';
import { ContextObject } from '../types/context';

export function mapContextToGraph(context: ContextObject): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Layout coordinates (mobile-friendly vertical/hierarchical flow)
  // X centers around 200
  const centerX = 220;

  // 1. Actor Node (Level 0)
  const actorId = 'node-actor';
  nodes.push({
    id: actorId,
    type: 'default',
    position: { x: centerX - 80, y: 30 },
    data: {
      label: `👤 ${context.actor}\n(Initiator)`
    },
    style: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: '#ffffff',
      border: '1px solid #60a5fa',
      borderRadius: '12px',
      padding: '10px 16px',
      fontWeight: 600,
      fontSize: '13px',
      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
      width: 160,
      textAlign: 'center'
    }
  });

  // 2. Purpose Node (Level 1, Left)
  const purposeId = 'node-purpose';
  nodes.push({
    id: purposeId,
    type: 'default',
    position: { x: 30, y: 150 },
    data: {
      label: `🎯 Purpose:\n${context.purpose}`
    },
    style: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      color: '#ffffff',
      border: '1px solid #a78bfa',
      borderRadius: '12px',
      padding: '10px 14px',
      fontWeight: 600,
      fontSize: '12px',
      boxShadow: '0 6px 16px rgba(139, 92, 246, 0.25)',
      width: 150,
      textAlign: 'center'
    }
  });

  edges.push({
    id: `edge-${actorId}-${purposeId}`,
    source: actorId,
    target: purposeId,
    label: 'initiates for',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
    labelStyle: { fill: '#cbd5e1', fontSize: 10, fontWeight: 500 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' }
  });

  // 3. Event Timing Node (Level 2, Left of Purpose)
  if (context.temporal.eventTiming) {
    const eventId = 'node-event';
    nodes.push({
      id: eventId,
      type: 'default',
      position: { x: 20, y: 270 },
      data: {
        label: `📅 Event Timing:\n${context.temporal.eventTiming}`
      },
      style: {
        background: '#0f172a',
        color: '#38bdf8',
        border: '1px dashed #38bdf8',
        borderRadius: '10px',
        padding: '8px 12px',
        fontSize: '11px',
        fontWeight: 500,
        width: 160,
        textAlign: 'center'
      }
    });

    edges.push({
      id: `edge-${purposeId}-${eventId}`,
      source: purposeId,
      target: eventId,
      label: 'scheduled as',
      type: 'smoothstep',
      style: { stroke: '#38bdf8', strokeWidth: 1.5 },
      labelStyle: { fill: '#94a3b8', fontSize: 9 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
    });
  }

  // 4. Action Nodes (Level 1 & 2, Center/Right)
  const actionStartY = 140;
  const actionGapY = 120;
  const actionX = 240;

  context.actions.forEach((action, idx) => {
    const actionId = `node-action-${idx}`;
    const isDone = context.completedActions.includes(action);

    nodes.push({
      id: actionId,
      type: 'default',
      position: { x: actionX, y: actionStartY + idx * actionGapY },
      data: {
        label: `${isDone ? '✅' : '⚡'} Action ${idx + 1}:\n${action}`
      },
      style: {
        background: isDone
          ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
          : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: isDone ? '#ffffff' : '#f1f5f9',
        border: isDone ? '1px solid #10b981' : '1px solid #475569',
        borderRadius: '12px',
        padding: '10px 14px',
        fontWeight: 500,
        fontSize: '12px',
        boxShadow: isDone
          ? '0 6px 16px rgba(16, 185, 129, 0.2)'
          : '0 6px 16px rgba(15, 23, 42, 0.4)',
        width: 170,
        textAlign: 'center'
      }
    });

    edges.push({
      id: `edge-${actorId}-${actionId}`,
      source: actorId,
      target: actionId,
      label: 'requests',
      type: 'smoothstep',
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      labelStyle: { fill: '#94a3b8', fontSize: 10 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
    });

    // Link matching artifact concept to action if applicable
    const artifactConcept = context.artifacts[idx] || context.artifacts[0];
    if (artifactConcept) {
      const artifactId = `node-art-${idx}`;
      nodes.push({
        id: artifactId,
        type: 'default',
        position: { x: 440, y: actionStartY + idx * actionGapY - 10 },
        data: {
          label: `📦 Artifact:\n${artifactConcept}`
        },
        style: {
          background: '#042f2e',
          color: '#2dd4bf',
          border: '1px solid #14b8a6',
          borderRadius: '10px',
          padding: '8px 12px',
          fontWeight: 600,
          fontSize: '11px',
          width: 140,
          textAlign: 'center'
        }
      });

      edges.push({
        id: `edge-${actionId}-${artifactId}`,
        source: actionId,
        target: artifactId,
        label: 'requires',
        type: 'smoothstep',
        style: { stroke: '#14b8a6', strokeWidth: 1.5 },
        labelStyle: { fill: '#99f6e4', fontSize: 9 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#14b8a6' }
      });
    }
  });

  // 5. Task Deadline Node (if present)
  if (context.temporal.taskDeadline) {
    const deadlineId = 'node-deadline';
    nodes.push({
      id: deadlineId,
      type: 'default',
      position: { x: actionX + 20, y: actionStartY + context.actions.length * actionGapY },
      data: {
        label: `⏰ Task Deadline:\n${context.temporal.taskDeadline}`
      },
      style: {
        background: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)',
        color: '#ffffff',
        border: '1px solid #fb7185',
        borderRadius: '10px',
        padding: '8px 14px',
        fontWeight: 600,
        fontSize: '11px',
        boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)',
        width: 150,
        textAlign: 'center'
      }
    });

    // Link last action to deadline
    const lastActionId = `node-action-${Math.max(0, context.actions.length - 1)}`;
    edges.push({
      id: `edge-${lastActionId}-${deadlineId}`,
      source: lastActionId,
      target: deadlineId,
      label: 'due by',
      type: 'smoothstep',
      style: { stroke: '#f43f5e', strokeWidth: 2, strokeDasharray: '4 4' },
      labelStyle: { fill: '#fecdd3', fontSize: 9 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f43f5e' }
    });
  }

  return { nodes, edges };
}
