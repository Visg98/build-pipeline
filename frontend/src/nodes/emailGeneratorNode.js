// emailGeneratorNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const EmailGeneratorNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const to = data?.to || '';
  const subject = data?.subject || '';
  const bodyTemplate = data?.bodyTemplate || '';
  const tone = data?.tone || 'professional';

  const handles = [
    { id: `${id}-input`, type: 'target', position: Position.Left },
    { id: `${id}-email`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Email Generator" color="var(--color-node-external)" icon="✉" handles={handles}>
      <label>
        To:
        <input
          type="text"
          placeholder="recipient@example.com"
          value={to}
          onChange={(e) => updateNodeField(id, 'to', e.target.value)}
        />
      </label>
      <label>
        Subject:
        <input
          type="text"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => updateNodeField(id, 'subject', e.target.value)}
        />
      </label>
      <label>
        Tone:
        <select value={tone} onChange={(e) => updateNodeField(id, 'tone', e.target.value)}>
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
        </select>
      </label>
      <label>
        Body Template:
        <textarea
          placeholder="Write your email body..."
          value={bodyTemplate}
          onChange={(e) => updateNodeField(id, 'bodyTemplate', e.target.value)}
          rows={3}
        />
      </label>
    </BaseNode>
  );
};
