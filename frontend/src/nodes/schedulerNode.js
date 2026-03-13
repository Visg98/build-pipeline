// schedulerNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const SchedulerNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const interval = data?.interval || 'hourly';
  const cronExpression = data?.cronExpression || '';

  const handles = [
    { id: `${id}-trigger`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Scheduler" color="var(--color-node-trigger)" icon="⏰" handles={handles}>
      <label>
        Interval:
        <select value={interval} onChange={(e) => updateNodeField(id, 'interval', e.target.value)}>
          <option value="minutely">Every Minute</option>
          <option value="hourly">Every Hour</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom (Cron)</option>
        </select>
      </label>
      {interval === 'custom' && (
        <label>
          Cron Expression:
          <input
            type="text"
            placeholder="0 * * * *"
            value={cronExpression}
            onChange={(e) => updateNodeField(id, 'cronExpression', e.target.value)}
          />
        </label>
      )}
    </BaseNode>
  );
};
