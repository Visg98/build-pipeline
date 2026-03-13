// fileLoaderNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const FileLoaderNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const fileType = data?.fileType || 'PDF';
  const filePath = data?.filePath || '';

  const handles = [
    { id: `${id}-file`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="File Loader" color="var(--color-node-data-in)" icon="📂" handles={handles}>
      <label>
        File Type:
        <select value={fileType} onChange={(e) => updateNodeField(id, 'fileType', e.target.value)}>
          <option value="PDF">PDF</option>
          <option value="CSV">CSV</option>
          <option value="TXT">TXT</option>
          <option value="JSON">JSON</option>
          <option value="DOCX">DOCX</option>
          <option value="XLSX">XLSX</option>
        </select>
      </label>
      <label>
        File Path:
        <input
          type="text"
          placeholder="/path/to/file"
          value={filePath}
          onChange={(e) => updateNodeField(id, 'filePath', e.target.value)}
        />
      </label>
    </BaseNode>
  );
};
