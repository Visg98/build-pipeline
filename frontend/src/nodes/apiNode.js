// apiNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const APINode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const url = data?.url || '';
  const method = data?.method || 'GET';

  const handles = [
    { id: `${id}-input`, type: 'target', position: Position.Left },
    { id: `${id}-response`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="API" color="var(--color-node-external)" icon="⚡" handles={handles}>
      <label>
        URL:
        <input
          type="text"
          placeholder="https://..."
          value={url}
          onChange={(e) => updateNodeField(id, 'url', e.target.value)}
        />
      </label>
      <label>
        Method:
        <select value={method} onChange={(e) => updateNodeField(id, 'method', e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
    </BaseNode>
  );
};
