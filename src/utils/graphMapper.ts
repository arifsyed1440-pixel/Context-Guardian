import { MarkerType, type Node, type Edge } from '@xyflow/react';
import type { ContextObject } from '../types/context';

/**
 * Maps a single ContextObject into React Flow graph nodes and edges
 * utilizing the Obsidian Lumina visual design system with clear hierarchy,
 * non-overlapping coordinates, and high-readability typography.
 */
export function mapContextToGraph(context: ContextObject): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 1. Center Master Node: Purpose / Goal
  const purposeId = 'node-purpose';
  nodes.push({
    id: purposeId,
    type: 'default',
    position: { x: 190, y: 150 },
    data: {
      label: `🎯 ${context.purpose}\n(Master Milestone)`
    },
    style: {
      background: 'linear-gradient(135deg, #262a33 0%, #1c2028 100%)',
      color: '#c0c1ff',
      border: '2px solid #8083ff',
      borderRadius: '16px',
      padding: '12px 16px',
      fontWeight: 700,
      fontSize: '12.5px',
      lineHeight: '1.4',
      boxShadow: '0 0 32px rgba(128, 131, 255, 0.45)',
      width: 170,
      textAlign: 'center'
    }
  });

  // 2. Originator / Actor Node (Top-Left)
  const actorId = 'node-actor';
  nodes.push({
    id: actorId,
    type: 'default',
    position: { x: 20, y: 40 },
    data: {
      label: `👤 ${context.actor}\n(Originator)`
    },
    style: {
      background: 'linear-gradient(135deg, #181c24 0%, #0f131c 100%)',
      color: '#4cd7f6',
      border: '1.5px solid #03b5d3',
      borderRadius: '14px',
      padding: '10px 14px',
      fontWeight: 600,
      fontSize: '11.5px',
      lineHeight: '1.35',
      boxShadow: '0 0 22px rgba(76, 215, 246, 0.35)',
      width: 140,
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
    style: { stroke: '#4cd7f6', strokeWidth: 2 },
    labelStyle: { fill: '#4cd7f6', fontSize: 10, fontWeight: 600 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4cd7f6' }
  });

  // 3. Event Timing Node (Bottom-Left)
  if (context.temporal.eventTiming) {
    const eventId = 'node-event';
    nodes.push({
      id: eventId,
      type: 'default',
      position: { x: 20, y: 260 },
      data: {
        label: `📅 ${context.temporal.eventTiming}\n(Event Horizon)`
      },
      style: {
        background: '#0a0e16',
        color: '#4edea3',
        border: '1.5px dashed #4edea3',
        borderRadius: '13px',
        padding: '9px 12px',
        fontSize: '11px',
        fontWeight: 600,
        lineHeight: '1.35',
        boxShadow: '0 0 20px rgba(78, 222, 163, 0.25)',
        width: 150,
        textAlign: 'center'
      }
    });

    edges.push({
      id: `edge-${purposeId}-${eventId}`,
      source: purposeId,
      target: eventId,
      label: 'scheduled at',
      type: 'smoothstep',
      style: { stroke: '#4edea3', strokeWidth: 1.75, strokeDasharray: '4,4' },
      labelStyle: { fill: '#4edea3', fontSize: 9.5, fontWeight: 500 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#4edea3' }
    });
  }

  // 4. Action Nodes & Connected Artifacts (Right Side)
  const actionX = 280;
  const artifactX = 470;
  const startY = 30;
  const gapY = 125;

  context.actions.forEach((action, idx) => {
    const actionId = `node-action-${idx}`;
    const isDone = context.completedActions.includes(action);
    const posY = startY + idx * gapY;

    nodes.push({
      id: actionId,
      type: 'default',
      position: { x: actionX, y: posY },
      data: {
        label: `${isDone ? '✅' : '⚡'} Action ${idx + 1}:\n${action}`
      },
      style: {
        background: isDone
          ? 'linear-gradient(135deg, #005236 0%, #0a1813 100%)'
          : 'linear-gradient(135deg, #262a33 0%, #181c24 100%)',
        color: isDone ? '#6ffbbe' : '#dfe2ee',
        border: isDone ? '1.5px solid #4edea3' : '1px solid #908fa0',
        borderRadius: '14px',
        padding: '10px 14px',
        fontWeight: 600,
        fontSize: '11.5px',
        lineHeight: '1.35',
        boxShadow: isDone
          ? '0 0 24px rgba(78, 222, 163, 0.4)'
          : '0 4px 18px rgba(0, 0, 0, 0.5)',
        width: 165,
        textAlign: 'center'
      }
    });

    edges.push({
      id: `edge-${purposeId}-${actionId}`,
      source: purposeId,
      target: actionId,
      label: 'requires action',
      type: 'smoothstep',
      style: { stroke: '#c0c1ff', strokeWidth: 1.75 },
      labelStyle: { fill: '#c0c1ff', fontSize: 9.5, fontWeight: 500 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#c0c1ff' }
    });

    // Associated Artifact Concept
    const artifactConcept = context.artifacts[idx] || context.artifacts[0];
    if (artifactConcept) {
      const artifactId = `node-art-${idx}`;
      nodes.push({
        id: artifactId,
        type: 'default',
        position: { x: artifactX, y: posY },
        data: {
          label: `📦 Artifact:\n${artifactConcept}`
        },
        style: {
          background: '#0a0e16',
          color: '#4cd7f6',
          border: '1.5px solid #0ea5e9',
          borderRadius: '12px',
          padding: '8px 12px',
          fontWeight: 600,
          fontSize: '11px',
          lineHeight: '1.3',
          boxShadow: '0 0 18px rgba(76, 215, 246, 0.25)',
          width: 140,
          textAlign: 'center'
        }
      });

      edges.push({
        id: `edge-${actionId}-${artifactId}`,
        source: actionId,
        target: artifactId,
        label: 'references',
        type: 'smoothstep',
        style: { stroke: '#4cd7f6', strokeWidth: 1.5, strokeDasharray: '3,3' },
        labelStyle: { fill: '#4cd7f6', fontSize: 9, fontWeight: 500 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#4cd7f6' }
      });
    }
  });

  // 5. Task Deadline Node (Bottom Center)
  if (context.temporal.taskDeadline) {
    const deadlineId = 'node-deadline';
    nodes.push({
      id: deadlineId,
      type: 'default',
      position: { x: 190, y: 310 },
      data: {
        label: `⏰ Cutoff Deadline:\n${context.temporal.taskDeadline}`
      },
      style: {
        background: 'linear-gradient(135deg, #690005 0%, #181c24 100%)',
        color: '#ffdad6',
        border: '1.5px solid #ffb4ab',
        borderRadius: '13px',
        padding: '9px 14px',
        fontWeight: 700,
        fontSize: '11.5px',
        lineHeight: '1.35',
        boxShadow: '0 0 24px rgba(255, 180, 171, 0.4)',
        width: 165,
        textAlign: 'center'
      }
    });

    const lastActionId = `node-action-${Math.max(0, context.actions.length - 1)}`;
    edges.push({
      id: `edge-${lastActionId}-${deadlineId}`,
      source: lastActionId,
      target: deadlineId,
      label: 'due by',
      type: 'smoothstep',
      style: { stroke: '#ffb4ab', strokeWidth: 1.75, strokeDasharray: '4,4' },
      labelStyle: { fill: '#ffb4ab', fontSize: 9.5, fontWeight: 600 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#ffb4ab' }
    });
  }

  return { nodes, edges };
}
