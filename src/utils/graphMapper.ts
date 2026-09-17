import { Node, Edge, MarkerType } from '@xyflow/react';
import { ContextObject } from '../types/context';

/**
 * Maps a single ContextObject into React Flow graph nodes and edges
 * utilizing the Obsidian Lumina visual design system.
 */
export function mapContextToGraph(context: ContextObject): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const centerX = 200;

  // 1. Center Master Node: Purpose (e.g. Project Review)
  const purposeId = 'node-purpose';
  nodes.push({
    id: purposeId,
    type: 'default',
    position: { x: centerX - 80, y: 160 },
    data: {
      label: `🎯 ${context.purpose}\n(${context.temporal.eventTiming || 'Milestone'})`
    },
    style: {
      background: 'linear-gradient(135deg, #262a33 0%, #1c2028 100%)',
      color: '#c0c1ff',
      border: '1.5px solid #8083ff',
      borderRadius: '16px',
      padding: '12px 16px',
      fontWeight: 700,
      fontSize: '12px',
      boxShadow: '0 0 28px rgba(128, 131, 255, 0.45)',
      width: 160,
      textAlign: 'center'
    }
  });

  // 2. Originator / Actor Node (Level 0, Top-Left)
  const actorId = 'node-actor';
  nodes.push({
    id: actorId,
    type: 'default',
    position: { x: 30, y: 30 },
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
      boxShadow: '0 0 20px rgba(76, 215, 246, 0.3)',
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

  // 3. Event Timing Node (Bottom-Left of Purpose)
  if (context.temporal.eventTiming) {
    const eventId = 'node-event';
    nodes.push({
      id: eventId,
      type: 'default',
      position: { x: 20, y: 290 },
      data: {
        label: `📅 ${context.temporal.eventTiming}\n(Event Horizon)`
      },
      style: {
        background: '#0a0e16',
        color: '#4edea3',
        border: '1px dashed #4edea3',
        borderRadius: '12px',
        padding: '8px 12px',
        fontSize: '11px',
        fontWeight: 500,
        boxShadow: '0 0 16px rgba(78, 222, 163, 0.25)',
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
      style: { stroke: '#4edea3', strokeWidth: 1.5, strokeDasharray: '3,3' },
      labelStyle: { fill: '#4edea3', fontSize: 9 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#4edea3' }
    });
  }

  // 4. Action Nodes & Artifacts (Right Side)
  const actionStartY = 40;
  const actionGapY = 130;
  const actionX = 260;

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
          ? 'linear-gradient(135deg, #00885d 0%, #0f131c 100%)'
          : 'linear-gradient(135deg, #262a33 0%, #181c24 100%)',
        color: isDone ? '#4edea3' : '#dfe2ee',
        border: isDone ? '1px solid #4edea3' : '1px solid #908fa0',
        borderRadius: '14px',
        padding: '10px 14px',
        fontWeight: 600,
        fontSize: '11.5px',
        boxShadow: isDone
          ? '0 0 20px rgba(78, 222, 163, 0.35)'
          : '0 4px 16px rgba(0, 0, 0, 0.4)',
        width: 170,
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
      labelStyle: { fill: '#c0c1ff', fontSize: 9.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#c0c1ff' }
    });

    // Associated Artifact Concept
    const artifactConcept = context.artifacts[idx] || context.artifacts[0];
    if (artifactConcept) {
      const artifactId = `node-art-${idx}`;
      nodes.push({
        id: artifactId,
        type: 'default',
        position: { x: actionX + 190, y: actionStartY + idx * actionGapY },
        data: {
          label: `📦 Artifact:\n${artifactConcept}`
        },
        style: {
          background: '#0a0e16',
          color: '#4cd7f6',
          border: '1px solid #4cd7f6',
          borderRadius: '12px',
          padding: '8px 12px',
          fontWeight: 600,
          fontSize: '11px',
          boxShadow: '0 0 16px rgba(76, 215, 246, 0.25)',
          width: 130,
          textAlign: 'center'
        }
      });

      edges.push({
        id: `edge-${actionId}-${artifactId}`,
        source: actionId,
        target: artifactId,
        label: 'specifies',
        type: 'smoothstep',
        style: { stroke: '#4cd7f6', strokeWidth: 1.5, strokeDasharray: '3,3' },
        labelStyle: { fill: '#4cd7f6', fontSize: 9 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#4cd7f6' }
      });
    }
  });

  // 5. Task Deadline Node (Bottom Right)
  if (context.temporal.taskDeadline) {
    const deadlineId = 'node-deadline';
    nodes.push({
      id: deadlineId,
      type: 'default',
      position: { x: actionX + 40, y: actionStartY + context.actions.length * actionGapY + 10 },
      data: {
        label: `⏰ Deadline:\n${context.temporal.taskDeadline}`
      },
      style: {
        background: 'linear-gradient(135deg, #93000a 0%, #1c2028 100%)',
        color: '#ffb4ab',
        border: '1.5px solid #ffb4ab',
        borderRadius: '12px',
        padding: '8px 14px',
        fontWeight: 700,
        fontSize: '11px',
        boxShadow: '0 0 20px rgba(255, 180, 171, 0.35)',
        width: 140,
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
      labelStyle: { fill: '#ffb4ab', fontSize: 9 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#ffb4ab' }
    });
  }

  return { nodes, edges };
}
