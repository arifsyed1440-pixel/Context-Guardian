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
      <div className="screen-inner-container empty-state">
        <span className="material-symbols-outlined empty-icon">hub</span>
        <h3>No Active Context Graph</h3>
        <p>Input a conversation to reconstruct its relational semantic map.</p>
        <button className="stitch-btn primary" onClick={() => onNavigate('input')}>
          Create Context
        </button>
      </div>
    );
  }

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeData(node.data?.label ? String(node.data.label) : node.id);
  };

  return (
    <div className="screen-inner-container graph-stitch-screen">
      {/* Header Banner (Stitch Screen 04) */}
      <div className="graph-banner-card">
        <div className="graph-banner-top">
          <div className="graph-title-group">
            <span className="material-symbols-outlined text-secondary text-[18px]">hub</span>
            <span className="graph-title">Semantic Context Map</span>
          </div>
          <div className="synced-streams-badge">
            <span className="material-symbols-outlined text-[13px] text-secondary">sync_saved_locally</span>
            <span>3 STREAMS SYNCED</span>
          </div>
        </div>
        <p className="graph-caption">
          Relational knowledge map connecting {context.actor}, {context.purpose}, action items, and referenced assets.
        </p>
      </div>

      {/* Interactive React Flow Canvas */}
      <div className="graph-canvas-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.4}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1e293b" gap={20} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="stitch-flow-controls" showInteractive={false} />
          <MiniMap 
            nodeColor={(node) => {
              if (node.id.includes('purpose')) return '#8083ff';
              if (node.id.includes('actor')) return '#4cd7f6';
              if (node.id.includes('deadline')) return '#ffb4ab';
              if (node.id.includes('art')) return '#4cd7f6';
              return '#4edea3';
            }}
            maskColor="rgba(10, 14, 22, 0.75)"
            style={{ background: '#0a0e16', border: '1px solid #262a33', borderRadius: '8px' }}
          />
        </ReactFlow>

        {/* Node Inspector Overlay */}
        {selectedNodeData && (
          <div className="node-inspector-modal">
            <div className="inspector-top-row">
              <div className="inspector-label-group">
                <span className="material-symbols-outlined text-primary text-[15px]">info</span>
                <span className="inspector-label">Entity Node Selected</span>
              </div>
              <button 
                className="inspector-dismiss-btn" 
                onClick={() => setSelectedNodeData(null)}
              >
                ✕
              </button>
            </div>
            <pre className="inspector-content-text">{selectedNodeData}</pre>
          </div>
        )}
      </div>

      {/* Node Archetypes Legend */}
      <div className="graph-legend-module">
        <span className="legend-heading">Semantic Node Archetypes:</span>
        <div className="legend-grid">
          <div className="legend-entry">
            <span className="entry-dot purpose"></span>
            <span>Master Goal (Purpose)</span>
          </div>
          <div className="legend-entry">
            <span className="entry-dot actor"></span>
            <span>Originator / Actor</span>
          </div>
          <div className="legend-entry">
            <span className="entry-dot action"></span>
            <span>Required Actions</span>
          </div>
          <div className="legend-entry">
            <span className="entry-dot deadline"></span>
            <span>Task Deadline</span>
          </div>
          <div className="legend-entry">
            <span className="entry-dot artifact"></span>
            <span>Artifact Concepts</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA to Dossier */}
      <div className="graph-bottom-cta-wrap">
        <button 
          className="stitch-btn primary full-width"
          onClick={() => onNavigate('dossier')}
        >
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Synthesize into Context Dossier</span>
        </button>
      </div>
    </div>
  );
};
