// conditionalNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const ConditionalNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const condition = data?.condition || '';
  const operator = data?.operator || 'equals';

  const handles = [
    { id: `${id}-input`, type: 'target', position: Position.Left },
    { id: `${id}-true`, type: 'source', position: Position.Right, style: { top: '35%' } },
    { id: `${id}-false`, type: 'source', position: Position.Right, style: { top: '65%' } },
  ];

  return (
    <BaseNode label="Conditional" color="var(--color-node-process)" icon="⊗" handles={handles}>
      <label>
        Operator:
        <select value={operator} onChange={(e) => updateNodeField(id, 'operator', e.target.value)}>
          <option value="equals">equals</option>
          <option value="not_equals">not equals</option>
          <option value="greater_than">greater than</option>
          <option value="less_than">less than</option>
          <option value="contains">contains</option>
          <option value="not_contains">not contains</option>
        </select>
      </label>
      <label>
        Value:
        <input type="text" placeholder="Compare value" value={condition}
          onChange={(e) => updateNodeField(id, 'condition', e.target.value)} />
      </label>
      <div className="node-branch-labels">
        <span>True →</span>
        <span>False →</span>
      </div>
    </BaseNode>
  );
};
