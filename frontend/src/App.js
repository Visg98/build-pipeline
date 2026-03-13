import { useState, useEffect } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { ResultModal } from './resultModal';
import { useStore } from './store';

const CATEGORIES = ['All', 'LLMs', 'Multimodal', 'Data', 'VectorDB', 'Logic', 'Chat'];

function App() {
  const [darkMode,     setDarkMode]     = useState(true);
  const [sidebarOpen,  setSidebarOpen]  = useState(true);
  const [activeCat,    setActiveCat]    = useState('All');
  const [result,       setResult]       = useState(null);   // modal data
  const [submitting,   setSubmitting]   = useState(false);  // loading state

  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/pipelines/parse`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nodes, edges }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setResult(data);          // open modal with real backend response
    } catch (err) {
      // Fallback: show frontend-computed stats if backend is unreachable
      setResult({
        num_nodes: nodes.length,
        num_edges: edges.length,
        is_dag:    null,         // unknown without backend
        error:     err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-root">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-row">

          <div className="header-left">
            <div className="brand-logo">V</div>
            <h1 className="brand-title">Build Pipeline</h1>
          </div>

          <div className="header-right">
            <button className="btn-ghost" onClick={() => setSidebarOpen((p) => !p)}>
              {sidebarOpen ? '← Hide Panel' : '→ Show Panel'}
            </button>
            <button
              className="btn-theme"
              onClick={() => setDarkMode((p) => !p)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '☀' : '☾'}
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? '...' : '▶ Submit'}
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="header-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tab-btn${activeCat === cat ? ' tab-btn--active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="app-body">
        {sidebarOpen && <PipelineToolbar activeCat={activeCat} />}
        <PipelineUI />
      </div>

      {/* ── Result Modal ────────────────────────────────────────────────── */}
      <ResultModal result={result} onClose={() => setResult(null)} />

    </div>
  );
}

export default App;
