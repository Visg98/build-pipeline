// ui.js — ReactFlow canvas

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, MarkerType, BackgroundVariant } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

// Existing nodes
import { InputNode }          from './nodes/inputNode';
import { LLMNode }            from './nodes/llmNode';
import { OutputNode }         from './nodes/outputNode';
import { TextNode }           from './nodes/textNode';
import { FilterNode }         from './nodes/filterNode';
import { MergeNode }          from './nodes/mergeNode';
import { APINode }            from './nodes/apiNode';
import { TransformNode }      from './nodes/transformNode';
import { NoteNode }           from './nodes/noteNode';

// Nodes added in round 1
import { FileLoaderNode }     from './nodes/fileLoaderNode';
import { VectorDBNode }       from './nodes/vectorDBNode';
import { SlackNode }          from './nodes/slackNode';
import { EmailGeneratorNode } from './nodes/emailGeneratorNode';
import { CodeGeneratorNode }  from './nodes/codeGeneratorNode';
import { WebhookNode }        from './nodes/webhookNode';
import { DatabaseNode }       from './nodes/databaseNode';
import { SchedulerNode }      from './nodes/schedulerNode';

// Nodes from mock
import { OpenAINode }         from './nodes/openAINode';
import { ClaudeNode }         from './nodes/claudeNode';
import { GeminiNode }         from './nodes/geminiNode';
import { ImageGenNode }       from './nodes/imageGenNode';
import { ConditionalNode }    from './nodes/conditionalNode';
import { ChatMemoryNode }     from './nodes/chatMemoryNode';
import { VectorDBLoaderNode } from './nodes/vectorDBLoaderNode';
import { VectorDBReaderNode } from './nodes/vectorDBReaderNode';

import 'reactflow/dist/style.css';

const nodeTypes = {
  // Core
  customInput:    InputNode,
  llm:            LLMNode,
  customOutput:   OutputNode,
  text:           TextNode,
  filter:         FilterNode,
  merge:          MergeNode,
  api:            APINode,
  transform:      TransformNode,
  note:           NoteNode,
  // Round 1
  fileLoader:     FileLoaderNode,
  vectorDB:       VectorDBNode,
  slack:          SlackNode,
  emailGenerator: EmailGeneratorNode,
  codeGenerator:  CodeGeneratorNode,
  webhook:        WebhookNode,
  database:       DatabaseNode,
  scheduler:      SchedulerNode,
  // From mock
  openai:         OpenAINode,
  claude:         ClaudeNode,
  gemini:         GeminiNode,
  imageGen:       ImageGenNode,
  conditional:    ConditionalNode,
  chatMemory:     ChatMemoryNode,
  vectorDBLoader: VectorDBLoaderNode,
  vectorDBReader: VectorDBReaderNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '6 4' },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6', width: 16, height: 16 },
};

const proOptions = { hideAttribution: true };
const gridSize = 24;

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  deleteEdge: state.deleteEdge,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes, edges, getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect, deleteEdge,
  } = useStore(selector, shallow);

  const onEdgeClick = useCallback((_, edge) => {
    deleteEdge(edge.id);
  }, [deleteEdge]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const raw = event?.dataTransfer?.getData('application/reactflow');
      if (!raw || !reactFlowWrapper.current) return;

      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className="canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        deleteKeyCode="Delete"
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineStyle={{ stroke: '#8b5cf6', strokeWidth: 2 }}
        connectionLineType="smoothstep"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={gridSize}
          size={1.2}
          color="var(--dot-color)"
        />
        <Controls />
        <MiniMap
          nodeColor={() => 'rgba(124,58,237,0.5)'}
          maskColor="rgba(15,10,40,0.4)"
        />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="canvas-empty">
          <div className="canvas-empty__icon">🔧</div>
          <div className="canvas-empty__title">Drag nodes from the left panel</div>
          <div className="canvas-empty__sub">to start building your pipeline</div>
        </div>
      )}

      <div className="canvas-info-bar">
        <span className="canvas-info-bar__label">
          {nodes.length} nodes · {edges.length} connections
        </span>
      </div>
    </div>
  );
};
