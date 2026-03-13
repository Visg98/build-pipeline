// vectorDBLoaderNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const VectorDBLoaderNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const embedModel = data?.embedModel || 'text-embedding-3-small';
  const collection = data?.collection || '';
  const chunkSize = data?.chunkSize || '512';

  const handles = [
    { id: `${id}-document`, type: 'target', position: Position.Left },
    { id: `${id}-stored`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="VectorDB Loader" color="var(--color-node-storage)" icon="⬡" handles={handles}>
      <label>
        Embed Model:
        <select value={embedModel} onChange={(e) => updateNodeField(id, 'embedModel', e.target.value)}>
          <option value="text-embedding-3-small">text-embedding-3-small</option>
          <option value="text-embedding-3-large">text-embedding-3-large</option>
          <option value="text-embedding-ada-002">ada-002</option>
        </select>
      </label>
      <label>
        Collection:
        <input type="text" placeholder="my-collection" value={collection}
          onChange={(e) => updateNodeField(id, 'collection', e.target.value)} />
      </label>
      <label>
        Chunk Size:
        <input type="number" min="64" max="4096" step="64" value={chunkSize}
          onChange={(e) => updateNodeField(id, 'chunkSize', e.target.value)} />
      </label>
    </BaseNode>
  );
};
