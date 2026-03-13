// baseNode.js

import { Fragment } from 'react';
import { Handle, useNodeId } from 'reactflow';
import { useStore } from '../store';

export const BaseNode = ({ label, color = '#64748B', icon, handles = [], children, nodeStyle = {} }) => {
  const id = useNodeId();
  const deleteNode = useStore((s) => s.deleteNode);

  return (
    <div className="node-wrapper" style={{ '--node-color': color, ...nodeStyle }}>

      {/* Header */}
      <div className="node-header" style={{ backgroundColor: color }}>
        {icon && <span className="node-icon">{icon}</span>}
        <span className="node-label">{label}</span>

        {/* Delete button — fades in on node hover */}
        <button
          className="node-delete-btn"
          onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
          title="Delete node"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="node-body">
        {children}
      </div>

      {/* Handles + optional labels */}
      {handles.map((handle) => (
        <Fragment key={handle.id}>
          <Handle
            type={handle.type}
            position={handle.position}
            id={handle.id}
            className={`node-handle node-handle--${handle.type}`}
            style={handle.style || {}}
          />
          {handle.label && (
            <span
              className={`handle-label handle-label--${handle.type}`}
              style={{ top: handle.style?.top ?? '50%' }}
            >
              {handle.label}
            </span>
          )}
        </Fragment>
      ))}

    </div>
  );
};
