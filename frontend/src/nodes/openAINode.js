// openAINode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const OpenAINode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const model = data?.model || 'gpt-4o';
  const temperature = data?.temperature || '0.7';
  const maxTokens = data?.maxTokens || '1024';

  const handles = [
    { id: `${id}-system`, type: 'target', position: Position.Left, style: { top: '33%' } },
    { id: `${id}-prompt`, type: 'target', position: Position.Left, style: { top: '66%' } },
    { id: `${id}-response`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="OpenAI" color="var(--color-node-ai)" icon="✦" handles={handles}>
      <label>
        Model:
        <select value={model} onChange={(e) => updateNodeField(id, 'model', e.target.value)}>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="o1">o1</option>
          <option value="o3-mini">o3-mini</option>
        </select>
      </label>
      <label>
        Temperature:
        <input type="number" min="0" max="2" step="0.1" value={temperature}
          onChange={(e) => updateNodeField(id, 'temperature', e.target.value)} />
      </label>
      <label>
        Max Tokens:
        <input type="number" min="1" max="128000" value={maxTokens}
          onChange={(e) => updateNodeField(id, 'maxTokens', e.target.value)} />
      </label>
    </BaseNode>
  );
};
