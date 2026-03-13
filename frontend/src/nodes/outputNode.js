// outputNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const currName = data?.outputName || id.replace('customOutput-', 'output_');
  const outputType = data?.outputType || 'Text';

  const handles = [
    { id: `${id}-value`, type: 'target', position: Position.Left }
  ];

  return (
    <BaseNode label="Output" color="var(--color-node-data-out)" icon="⊙" handles={handles}>
      <label>
        Name:
        <input
          type="text"
          value={currName}
          onChange={(e) => updateNodeField(id, 'outputName', e.target.value)}
        />
      </label>
      <label>
        Type:
        <select value={outputType} onChange={(e) => updateNodeField(id, 'outputType', e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </label>
    </BaseNode>
  );
}
