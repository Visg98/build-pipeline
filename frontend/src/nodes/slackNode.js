// slackNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const SlackNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const channel = data?.channel || '';
  const message = data?.message || '';
  const username = data?.username || 'Pipeline Bot';

  const handles = [
    { id: `${id}-input`, type: 'target', position: Position.Left },
    { id: `${id}-response`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Slack Message" color="var(--color-node-external)" icon="💬" handles={handles}>
      <label>
        Channel:
        <input
          type="text"
          placeholder="#general"
          value={channel}
          onChange={(e) => updateNodeField(id, 'channel', e.target.value)}
        />
      </label>
      <label>
        Username:
        <input
          type="text"
          placeholder="Pipeline Bot"
          value={username}
          onChange={(e) => updateNodeField(id, 'username', e.target.value)}
        />
      </label>
      <label>
        Message:
        <textarea
          placeholder="Enter message..."
          value={message}
          onChange={(e) => updateNodeField(id, 'message', e.target.value)}
          rows={3}
        />
      </label>
    </BaseNode>
  );
};
