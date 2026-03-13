// resultModal.js

export const ResultModal = ({ result, onClose }) => {
  if (!result) return null;

  const { num_nodes, num_edges, is_dag } = result;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-icon">📊</span>
            Pipeline Analysis
          </div>
          <button className="modal-close" onClick={onClose} title="Close">×</button>
        </div>

        {/* Stats */}
        <div className="modal-body">
          <div className="modal-stat">
            <div className="modal-stat__icon">⬡</div>
            <div className="modal-stat__info">
              <span className="modal-stat__label">Nodes</span>
              <span className="modal-stat__value">{num_nodes}</span>
            </div>
          </div>

          <div className="modal-stat">
            <div className="modal-stat__icon">→</div>
            <div className="modal-stat__info">
              <span className="modal-stat__label">Edges</span>
              <span className="modal-stat__value">{num_edges}</span>
            </div>
          </div>

          <div className={`modal-stat modal-stat--dag ${is_dag ? 'modal-stat--pass' : 'modal-stat--fail'}`}>
            <div className="modal-stat__icon">{is_dag ? '✓' : '✕'}</div>
            <div className="modal-stat__info">
              <span className="modal-stat__label">Valid DAG</span>
              <span className="modal-stat__value">{is_dag ? 'Yes' : 'No'}</span>
            </div>
          </div>

          {!is_dag && (
            <p className="modal-warning">
              ⚠ Pipeline contains a cycle. Execution may loop indefinitely.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Done</button>
        </div>

      </div>
    </div>
  );
};
