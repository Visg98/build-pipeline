// geminiNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const GeminiNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const model = data?.model || 'gemini-2.0-flash';
  const maxTokens = data?.maxTokens || '8192';

  const handles = [
    { id: `${id}-system`, type: 'target', position: Position.Left, style: { top: '33%' } },
    { id: `${id}-prompt`, type: 'target', position: Position.Left, style: { top: '66%' } },
    { id: `${id}-response`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Gemini" color="var(--color-node-ai)" icon="✦" handles={handles}>
      <label>
        Model:
        <select value={model} onChange={(e) => updateNodeField(id, 'model', e.target.value)}>
          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
          <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
          <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
          <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
        </select>
      </label>
      <label>
        Max Tokens:
        <input type="number" min="1" max="1048576" value={maxTokens}
          onChange={(e) => updateNodeField(id, 'maxTokens', e.target.value)} />
      </label>
    </BaseNode>
  );
};
