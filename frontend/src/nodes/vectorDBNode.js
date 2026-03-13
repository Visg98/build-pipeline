// vectorDBNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const VectorDBNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const operation = data?.operation || 'query';
  const collection = data?.collection || '';
  const topK = data?.topK || '5';

  const handles = [
    { id: `${id}-input`, type: 'target', position: Position.Left },
    { id: `${id}-results`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Vector DB" color="var(--color-node-storage)" icon="⬡" handles={handles}>
      <label>
        Operation:
        <select value={operation} onChange={(e) => updateNodeField(id, 'operation', e.target.value)}>
          <option value="query">Query</option>
          <option value="upsert">Upsert</option>
          <option value="delete">Delete</option>
        </select>
      </label>
      <label>
        Collection:
        <input
          type="text"
          placeholder="my-collection"
          value={collection}
          onChange={(e) => updateNodeField(id, 'collection', e.target.value)}
        />
      </label>
      {operation === 'query' && (
        <label>
          Top K:
          <input
            type="number"
            min="1"
            max="100"
            value={topK}
            onChange={(e) => updateNodeField(id, 'topK', e.target.value)}
          />
        </label>
      )}
    </BaseNode>
  );
};
