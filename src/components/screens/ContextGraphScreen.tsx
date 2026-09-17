import React, { useMemo, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  Node,
  useNodesState, 
  useEdgesState,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Network, 
  FileCheck, 
  Info 
} from 'lucide-react';
import { ContextObject, ScreenType } from '../../types/context';
import { mapContextToGraph } from '../../utils/graphMapper';

interface ContextGraphScreenProps {
  context: ContextObject | null;
  onNavigate: (screen: ScreenType) => void;
}

export const ContextGraphScreen: React.FC<ContextGraphScreenProps> = ({
  context,
  onNavigate,
}) => {
  const [selectedNodeData, setSelectedNodeData] = useState<string | null>(null);

  const initialElements = useMemo(() => {
    if (!context) return { nodes: [], edges: [] };
    return mapContextToGraph(context);
  }, [context]);

  const [nodes, , onNodesChange] = useNodesState(initialElements.nodes);
  const [edges, , onEdgesChange] = useEdgesState(initialElements.edges);

  if (!context) {
    return (
      <div className="screen-container empty-state">
        <Network size={36} className="empty-icon" />
        <h3>No Active Context Graph</h3>
        <p>Input a conversation to reconstruct its semantic relationship graph.</p>
        <button className="cta-primary-btn" onClick={() => onNavigate('input')}>
          Create Context
        </button>
      </div>
    );
  }

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeData(node.data?.label ? String(node.data.label) : node.id);
  };

  return (
    <div className="screen-container graph-screen">
      {/* Top Banner */}
      <div className="graph-header-card">
        <div className="graph-title-row">
          <div className="graph-badge">
            <Network size={14} />
            <span>Semantic Context Graph</span>
          </div>
          <span className="graph-context-label">{context.actor} ➔ {context.purpose}</span>
        </div>
        <p className="graph-desc">
          Interactive knowledge map linking originators, goals, deliverables, artifacts, and temporal constraints.
        </p>
      </div>

      {/* React Flow Container */}
      <div className="react-flow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.4}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={18} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="custom-flow-controls" showInteractive={false} />
          <MiniMap 
            nodeColor={(node) => {
              if (node.id.includes('actor')) return '#3b82f6';
              if (node.id.includes('purpose')) return '#8b5cf6';
              if (node.id.includes('deadline')) return '#e11d48';
              if (node.id.includes('art')) return '#14b8a6';
              return '#475569';
            }}
            maskColor="rgba(15, 23, 42, 0.7)"
            style={{ background: '#090d16', border: '1px solid #1e293b' }}
          />
        </ReactFlow>

        {/* Node Inspector Overlay */}
        {selectedNodeData && (
          <div className="node-inspector-overlay">
            <div className="inspector-content">
              <div className="inspector-header">
                <Info size={14} />
                <span>Selected Entity Node</span>
              </div>
              <pre className="inspector-text">{selectedNodeData}</pre>
            </div>
            <button 
              className="inspector-close" 
              onClick={() => setSelectedNodeData(null)}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Graph Legend */}
      <div className="graph-legend-card">
        <div className="legend-title">Graph Node Archetypes:</div>
        <div className="legend-items-grid">
          <div className="legend-item">
            <span className="legend-color actor"></span>
            <span>Originator / Actor</span>
          </div>
          <div className="legend-item">
            <span className="legend-color purpose"></span>
            <span>Core Purpose</span>
          </div>
          <div className="legend-item">
            <span className="legend-color action"></span>
            <span>Required Actions</span>
          </div>
          <div className="legend-item">
            <span className="legend-color deadline"></span>
            <span>Task Deadline</span>
          </div>
          <div className="legend-item">
            <span className="legend-color artifact"></span>
            <span>Artifact Concepts</span>
          </div>
        </div>
      </div>

      {/* Dossier CTA */}
      <div className="graph-footer-cta">
        <button 
          className="cta-primary-btn" 
          onClick={() => onNavigate('dossier')}
        >
          <FileCheck size={16} />
          <span>Synthesize into Context Dossier</span>
        </button>
      </div>
    </div>
  );
};
