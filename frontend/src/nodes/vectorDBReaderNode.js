// vectorDBReaderNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const VectorDBReaderNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const collection = data?.collection || '';
  const topK = data?.topK || '5';
  const threshold = data?.threshold || '0.7';

  const handles = [
    { id: `${id}-query`, type: 'target', position: Position.Left },
    { id: `${id}-results`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="VectorDB Reader" color="var(--color-node-storage)" icon="⬡" handles={handles}>
      <label>
        Collection:
        <input type="text" placeholder="my-collection" value={collection}
          onChange={(e) => updateNodeField(id, 'collection', e.target.value)} />
      </label>
      <label>
        Top K:
        <input type="number" min="1" max="100" value={topK}
          onChange={(e) => updateNodeField(id, 'topK', e.target.value)} />
      </label>
      <label>
        Min Similarity:
        <input type="number" min="0" max="1" step="0.05" value={threshold}
          onChange={(e) => updateNodeField(id, 'threshold', e.target.value)} />
      </label>
    </BaseNode>
  );
};
