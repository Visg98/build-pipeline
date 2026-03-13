// claudeNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const ClaudeNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const model = data?.model || 'claude-sonnet-4-6';
  const temperature = data?.temperature || '1.0';
  const maxTokens = data?.maxTokens || '8096';

  const handles = [
    { id: `${id}-system`, type: 'target', position: Position.Left, style: { top: '33%' } },
    { id: `${id}-prompt`, type: 'target', position: Position.Left, style: { top: '66%' } },
    { id: `${id}-response`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Claude" color="var(--color-node-ai)" icon="✦" handles={handles}>
      <label>
        Model:
        <select value={model} onChange={(e) => updateNodeField(id, 'model', e.target.value)}>
          <option value="claude-opus-4-6">Claude Opus 4.6</option>
          <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
          <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5</option>
        </select>
      </label>
      <label>
        Temperature:
        <input type="number" min="0" max="1" step="0.1" value={temperature}
          onChange={(e) => updateNodeField(id, 'temperature', e.target.value)} />
      </label>
      <label>
        Max Tokens:
        <input type="number" min="1" max="200000" value={maxTokens}
          onChange={(e) => updateNodeField(id, 'maxTokens', e.target.value)} />
      </label>
    </BaseNode>
  );
};
