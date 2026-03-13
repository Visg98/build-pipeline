// filterNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const condition = data?.condition || '';

  const handles = [
    { id: `${id}-input`, type: 'target', position: Position.Left },
    { id: `${id}-output`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Filter" color="var(--color-node-process)" icon="⊗" handles={handles}>
      <label>
        Condition:
        <input
          type="text"
          placeholder="e.g. value > 10"
          value={condition}
          onChange={(e) => updateNodeField(id, 'condition', e.target.value)}
        />
      </label>
    </BaseNode>
  );
};
