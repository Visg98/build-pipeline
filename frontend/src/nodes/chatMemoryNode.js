// chatMemoryNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const ChatMemoryNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const memoryType = data?.memoryType || 'buffer';
  const windowSize = data?.windowSize || '10';

  const handles = [
    { id: `${id}-input`, type: 'target', position: Position.Left },
    { id: `${id}-output`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Chat Memory" color="var(--color-node-ai)" icon="💭" handles={handles}>
      <label>
        Memory Type:
        <select value={memoryType} onChange={(e) => updateNodeField(id, 'memoryType', e.target.value)}>
          <option value="buffer">Buffer</option>
          <option value="window">Window</option>
          <option value="summary">Summary</option>
          <option value="vector">Vector Store</option>
        </select>
      </label>
      {memoryType === 'window' && (
        <label>
          Window Size:
          <input type="number" min="1" max="100" value={windowSize}
            onChange={(e) => updateNodeField(id, 'windowSize', e.target.value)} />
        </label>
      )}
    </BaseNode>
  );
};
