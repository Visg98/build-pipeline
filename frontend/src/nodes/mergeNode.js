// mergeNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const MergeNode = ({ id, data }) => {

  const handles = [
    { id: `${id}-input1`, type: 'target', position: Position.Left, style: { top: '33%' } },
    { id: `${id}-input2`, type: 'target', position: Position.Left, style: { top: '66%' } },
    { id: `${id}-output`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Merge" color="var(--color-node-process)" icon="⊕" handles={handles}>
      <span>Merges two inputs into one output.</span>
    </BaseNode>
  );
};
