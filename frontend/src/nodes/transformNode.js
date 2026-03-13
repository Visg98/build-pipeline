// transformNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const TransformNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const transformType = data?.transformType || 'uppercase';

  const handles = [
    { id: `${id}-input`, type: 'target', position: Position.Left },
    { id: `${id}-output`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Transform" color="var(--color-node-process)" icon="↺" handles={handles}>
      <label>
        Type:
        <select value={transformType} onChange={(e) => updateNodeField(id, 'transformType', e.target.value)}>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="trim">Trim</option>
          <option value="reverse">Reverse</option>
        </select>
      </label>
    </BaseNode>
  );
};
