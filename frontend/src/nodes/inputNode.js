// inputNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const currName = data?.inputName || id.replace('customInput-', 'input_');
  const inputType = data?.inputType || 'Text';

  const handles = [
    { id: `${id}-value`, type: 'source', position: Position.Right }
  ];

  return (
    <BaseNode label="Input" color="var(--color-node-data-in)" icon="→" handles={handles}>
      <label>
        Name:
        <input
          type="text"
          value={currName}
          onChange={(e) => updateNodeField(id, 'inputName', e.target.value)}
        />
      </label>
      <label>
        Type:
        <select value={inputType} onChange={(e) => updateNodeField(id, 'inputType', e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </BaseNode>
  );
}
