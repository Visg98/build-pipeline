// databaseNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const DatabaseNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const dbType = data?.dbType || 'PostgreSQL';
  const operation = data?.operation || 'select';
  const query = data?.query || '';

  const handles = [
    { id: `${id}-params`, type: 'target', position: Position.Left },
    { id: `${id}-rows`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Database" color="var(--color-node-storage)" icon="🗄" handles={handles}>
      <label>
        Type:
        <select value={dbType} onChange={(e) => updateNodeField(id, 'dbType', e.target.value)}>
          <option value="PostgreSQL">PostgreSQL</option>
          <option value="MySQL">MySQL</option>
          <option value="SQLite">SQLite</option>
          <option value="MongoDB">MongoDB</option>
          <option value="Redis">Redis</option>
        </select>
      </label>
      <label>
        Operation:
        <select value={operation} onChange={(e) => updateNodeField(id, 'operation', e.target.value)}>
          <option value="select">SELECT</option>
          <option value="insert">INSERT</option>
          <option value="update">UPDATE</option>
          <option value="delete">DELETE</option>
        </select>
      </label>
      <label>
        Query:
        <textarea
          placeholder="SELECT * FROM table WHERE ..."
          value={query}
          onChange={(e) => updateNodeField(id, 'query', e.target.value)}
          rows={3}
        />
      </label>
    </BaseNode>
  );
};
