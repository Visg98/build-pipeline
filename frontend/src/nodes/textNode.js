// textNode.js

import { useState, useEffect, useRef } from 'react';
import { Position, useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

const MIN_WIDTH  = 230;
const MIN_HEIGHT = 60;

// Matches {{ validJsVarName }} — spaces around the name are optional
const VAR_REGEX = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

/** Returns an ordered, de-duplicated list of variable names found in text. */
const extractVariables = (text) => {
  const seen = new Set();
  const vars = [];
  VAR_REGEX.lastIndex = 0;
  let match;
  while ((match = VAR_REGEX.exec(text)) !== null) {
    const name = match[1];
    if (!seen.has(name)) { seen.add(name); vars.push(name); }
  }
  return vars;
};

/** Distribute N handles evenly along the left edge (as percent strings). */
const topPercent = (index, total) =>
  total === 1 ? '50%' : `${((index + 1) / (total + 1)) * 100}%`;

export const TextNode = ({ id, data }) => {
  const updateNodeField    = useStore((s) => s.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();

  const currText = data?.text ?? '{{input}}';

  // Local variable state — updates immediately on every keystroke so handles
  // stay in sync without waiting for the store → ReactFlow data-prop cycle.
  const [variables, setVariables] = useState(() => extractVariables(currText));

  const textareaRef = useRef(null);
  const mirrorRef   = useRef(null);

  // Create the off-screen mirror span once (lives in <body>, never clipped)
  useEffect(() => {
    const span = document.createElement('span');
    span.style.cssText = [
      'position:fixed', 'top:-9999px', 'left:-9999px',
      'font-size:12px', 'font-family:Inter,sans-serif',
      'white-space:pre', 'visibility:hidden', 'pointer-events:none',
    ].join(';');
    document.body.appendChild(span);
    mirrorRef.current = span;
    return () => document.body.removeChild(span);
  }, []);

  // Tell ReactFlow to re-measure handles whenever their count/positions change
  useEffect(() => {
    updateNodeInternals(id);
  }, [variables, id, updateNodeInternals]);

  // Size correctly on first render
  useEffect(() => { resize(currText); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resize = (text) => {
    const ta     = textareaRef.current;
    const mirror = mirrorRef.current;
    if (!ta || !mirror) return;

    // ── Height ───────────────────────────────────────────────────────────
    ta.style.height = 'auto';
    ta.style.height = `${Math.max(MIN_HEIGHT, ta.scrollHeight)}px`;

    // ── Width ────────────────────────────────────────────────────────────
    const longestLine = text
      .split('\n')
      .reduce((a, b) => (a.length > b.length ? a : b), '');
    mirror.textContent = longestLine;
    const newWidth = Math.max(MIN_WIDTH, mirror.offsetWidth + 48);
    ta.style.width = `${newWidth - 24}px`;

    const wrapper = ta.closest('.node-wrapper');
    if (wrapper) wrapper.style.setProperty('--node-width', `${newWidth}px`);
  };

  const handleChange = (e) => {
    const val  = e.target.value;
    const vars = extractVariables(val);

    updateNodeField(id, 'text', val);
    setVariables(vars);   // instant local update → handles re-render immediately
    resize(val);
  };

  // Build handles: one fixed output on the right + one target per variable on the left
  const handles = [
    { id: `${id}-output`, type: 'source', position: Position.Right },
    ...variables.map((varName, i) => ({
      id:       `${id}-${varName}`,
      type:     'target',
      position: Position.Left,
      label:    varName,
      style:    { top: topPercent(i, variables.length) },
    })),
  ];

  return (
    <BaseNode label="Text" color="var(--color-node-util)" icon="Aa" handles={handles}>
      <label>
        Text:
        <textarea
          ref={textareaRef}
          className="nodrag nopan"
          value={currText}
          onChange={handleChange}
          rows={1}
          style={{ overflow: 'hidden', resize: 'none' }}
        />
      </label>
    </BaseNode>
  );
};
