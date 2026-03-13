// llmNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const LLMNode = ({ id, data }) => {

  const handles = [
    { id: `${id}-system`, type: 'target', position: Position.Left, style: { top: `${100/3}%` } },
    { id: `${id}-prompt`, type: 'target', position: Position.Left, style: { top: `${200/3}%` } },
    { id: `${id}-response`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="LLM" color="var(--color-node-ai)" icon="✦" handles={handles}>
      <span>This is a LLM.</span>
    </BaseNode>
  );
}
