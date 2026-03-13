// imageGenNode.js

import { Position } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const ImageGenNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const provider = data?.provider || 'dall-e-3';
  const size = data?.size || '1024x1024';
  const quality = data?.quality || 'standard';

  const handles = [
    { id: `${id}-prompt`, type: 'target', position: Position.Left },
    { id: `${id}-image`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode label="Image Gen" color="var(--color-node-ai)" icon="🖼" handles={handles}>
      <label>
        Provider:
        <select value={provider} onChange={(e) => updateNodeField(id, 'provider', e.target.value)}>
          <option value="dall-e-3">DALL-E 3</option>
          <option value="dall-e-2">DALL-E 2</option>
          <option value="stable-diffusion">Stable Diffusion</option>
          <option value="midjourney">Midjourney</option>
        </select>
      </label>
      <label>
        Size:
        <select value={size} onChange={(e) => updateNodeField(id, 'size', e.target.value)}>
          <option value="256x256">256 × 256</option>
          <option value="512x512">512 × 512</option>
          <option value="1024x1024">1024 × 1024</option>
          <option value="1792x1024">1792 × 1024</option>
          <option value="1024x1792">1024 × 1792</option>
        </select>
      </label>
      <label>
        Quality:
        <select value={quality} onChange={(e) => updateNodeField(id, 'quality', e.target.value)}>
          <option value="standard">Standard</option>
          <option value="hd">HD</option>
        </select>
      </label>
    </BaseNode>
  );
};
