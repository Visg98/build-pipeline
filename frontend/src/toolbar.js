// toolbar.js — Categorized sidebar panel

import { DraggableNode } from './draggableNode';

const NODE_CATALOG = [
  // ── Data ──────────────────────────────────────────────────────────────
  { type: 'customInput',    label: 'Input',           cat: 'Data',      icon: '→',  desc: 'Pipeline entry point' },
  { type: 'customOutput',   label: 'Output',          cat: 'Data',      icon: '⊙',  desc: 'Pipeline output' },
  { type: 'fileLoader',     label: 'File Loader',     cat: 'Data',      icon: '📂', desc: 'Reads data from a file' },
  { type: 'text',           label: 'Text',            cat: 'Data',      icon: '✎',  desc: 'Static text value' },
  { type: 'transform',      label: 'Transform',       cat: 'Data',      icon: '↺',  desc: 'Transform text values' },
  { type: 'database',       label: 'Database',        cat: 'Data',      icon: '🗄', desc: 'Query a database' },
  { type: 'emailGenerator', label: 'Email Generator', cat: 'Data',      icon: '✉',  desc: 'Generate emails' },
  { type: 'note',           label: 'Note',            cat: 'Data',      icon: '📝', desc: 'Add a note' },
  // ── LLMs ──────────────────────────────────────────────────────────────
  { type: 'openai',         label: 'OpenAI',          cat: 'LLMs',      icon: '✦',  desc: 'GPT-4o / GPT-4 / o1' },
  { type: 'claude',         label: 'Claude',          cat: 'LLMs',      icon: '✦',  desc: 'Anthropic Claude' },
  { type: 'gemini',         label: 'Gemini',          cat: 'LLMs',      icon: '✦',  desc: 'Google Gemini' },
  { type: 'llm',            label: 'LLM',             cat: 'LLMs',      icon: '✦',  desc: 'Generic LLM node' },
  { type: 'codeGenerator',  label: 'Code Generator',  cat: 'LLMs',      icon: '⌥',  desc: 'Generate code in any language' },
  // ── Multimodal ────────────────────────────────────────────────────────
  { type: 'imageGen',       label: 'Image Gen',       cat: 'Multimodal',icon: '🖼', desc: 'Generate images from prompt' },
  // ── VectorDB ──────────────────────────────────────────────────────────
  { type: 'vectorDBLoader', label: 'VectorDB Loader', cat: 'VectorDB',  icon: '⬡',  desc: 'Vectorize & store documents' },
  { type: 'vectorDBReader', label: 'VectorDB Reader', cat: 'VectorDB',  icon: '⬡',  desc: 'Retrieve from vector store' },
  { type: 'vectorDB',       label: 'Vector DB',       cat: 'VectorDB',  icon: '⬡',  desc: 'Query / upsert / delete' },
  // ── Logic ─────────────────────────────────────────────────────────────
  { type: 'conditional',    label: 'Conditional',     cat: 'Logic',     icon: '⊗',  desc: 'Branch on condition' },
  { type: 'filter',         label: 'Filter',          cat: 'Logic',     icon: '⊘',  desc: 'Filter by condition' },
  { type: 'merge',          label: 'Merge',           cat: 'Logic',     icon: '⊕',  desc: 'Merge multiple inputs' },
  { type: 'api',            label: 'API',             cat: 'Logic',     icon: '⚡', desc: 'HTTP API request' },
  { type: 'webhook',        label: 'Webhook',         cat: 'Logic',     icon: '⚓', desc: 'Webhook trigger' },
  { type: 'scheduler',      label: 'Scheduler',       cat: 'Logic',     icon: '⏰', desc: 'Schedule trigger' },
  // ── Chat ──────────────────────────────────────────────────────────────
  { type: 'chatMemory',     label: 'Chat Memory',     cat: 'Chat',      icon: '💭', desc: 'Stores conversation history' },
  { type: 'slack',          label: 'Slack',           cat: 'Chat',      icon: '💬', desc: 'Send Slack messages' },
];

export const PipelineToolbar = ({ activeCat }) => {
  const visible =
    activeCat === 'All'
      ? NODE_CATALOG
      : NODE_CATALOG.filter((n) => n.cat === activeCat);

  return (
    <aside className="sidebar">
      <div className="sidebar-hint">Drag nodes to canvas</div>
      <div className="sidebar-list">
        {visible.map((node, i) => (
          <DraggableNode key={node.type + i} {...node} />
        ))}
      </div>
    </aside>
  );
};
