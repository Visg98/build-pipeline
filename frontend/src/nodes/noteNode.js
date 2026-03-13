// noteNode.js

import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const NoteNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const note = data?.note || '';

  return (
    <BaseNode label="Note" color="var(--color-node-util)" icon="✎" handles={[]}>
      <textarea
        rows={3}
        placeholder="Add a note..."
        value={note}
        onChange={(e) => updateNodeField(id, 'note', e.target.value)}
      />
    </BaseNode>
  );
};
