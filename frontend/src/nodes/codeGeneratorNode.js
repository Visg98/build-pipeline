// codeGeneratorNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const CodeGeneratorNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const language = data?.language || 'Python';
  const prompt = data?.prompt || '';
  const framework = data?.framework || '';

  const handles = [
    { id: `${id}-prompt`, type: 'target', position: Position.Left },
    { id: `${id}-code`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Code Generator" color="var(--color-node-ai)" icon="</>" handles={handles}>
      <label>
        Language:
        <select value={language} onChange={(e) => updateNodeField(id, 'language', e.target.value)}>
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Java">Java</option>
          <option value="Go">Go</option>
          <option value="Rust">Rust</option>
          <option value="C++">C++</option>
          <option value="SQL">SQL</option>
          <option value="Bash">Bash</option>
        </select>
      </label>
      <label>
        Framework / Lib:
        <input
          type="text"
          placeholder="e.g. React, FastAPI"
          value={framework}
          onChange={(e) => updateNodeField(id, 'framework', e.target.value)}
        />
      </label>
      <label>
        Prompt:
        <textarea
          placeholder="Describe the code to generate..."
          value={prompt}
          onChange={(e) => updateNodeField(id, 'prompt', e.target.value)}
          rows={3}
        />
      </label>
    </BaseNode>
  );
};
