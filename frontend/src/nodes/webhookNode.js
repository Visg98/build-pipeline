// webhookNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const WebhookNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const method = data?.method || 'POST';
  const path = data?.path || '/webhook';
  const authType = data?.authType || 'none';

  const handles = [
    { id: `${id}-payload`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Webhook" color="var(--color-node-trigger)" icon="⚓" handles={handles}>
      <label>
        Method:
        <select value={method} onChange={(e) => updateNodeField(id, 'method', e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
        </select>
      </label>
      <label>
        Path:
        <input
          type="text"
          placeholder="/webhook"
          value={path}
          onChange={(e) => updateNodeField(id, 'path', e.target.value)}
        />
      </label>
      <label>
        Auth:
        <select value={authType} onChange={(e) => updateNodeField(id, 'authType', e.target.value)}>
          <option value="none">None</option>
          <option value="basicAuth">Basic Auth</option>
          <option value="headerAuth">Header Auth</option>
          <option value="jwtAuth">JWT</option>
        </select>
      </label>
    </BaseNode>
  );
};
