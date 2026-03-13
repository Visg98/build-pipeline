# VectorShift — Frontend Technical Assessment

## Table of Contents
1. [Project Overview](#project-overview)
2. [How to Run](#how-to-run)
3. [Part 1 — Node Abstraction](#part-1--node-abstraction)
4. [Part 2 — Styling](#part-2--styling)
5. [Part 3 — Text Node Logic](#part-3--text-node-logic)
6. [Part 4 — Backend Integration](#part-4--backend-integration)
7. [Full Node Catalogue](#full-node-catalogue)
8. [File Structure](#file-structure)

---

## Project Overview

A visual pipeline builder built with **React + ReactFlow** on the frontend and **Python + FastAPI** on the backend. Users drag nodes from a categorised sidebar onto a canvas, connect them with edges, and submit the pipeline to the backend for analysis.

---

## How to Run

### Frontend
```bash
cd frontend
npm install
npm start
```
Runs at **http://localhost:3000**

### Backend
```bash
cd backend
uvicorn main:app --reload
```
Runs at **http://localhost:8000**

Both must be running simultaneously for the Submit button to communicate with the backend.

---

## Part 1 — Node Abstraction

### Problem

The original codebase had four node types (`InputNode`, `LLMNode`, `OutputNode`, `TextNode`), each repeating the same structural boilerplate:
- A wrapper `div` with hardcoded inline styles
- A title label rendered manually
- `Handle` components declared individually inside every node

Adding a new node meant copying and modifying the same boilerplate. Any visual change had to be applied to every file individually.

---

### Solution — `BaseNode` (`frontend/src/nodes/baseNode.js`)

A single shared `BaseNode` component that every node is built on top of.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Title shown in the node header |
| `color` | `string` | CSS variable reference for the header accent color |
| `icon` | `string` | Small icon/emoji shown beside the label |
| `handles` | `array` | List of handle config objects |
| `children` | `ReactNode` | Node-specific body content |
| `nodeStyle` | `object` | Optional inline style overrides on the wrapper (e.g. dynamic width) |

**Handle config shape:**
```js
{
  id:       string,    // unique ID required by ReactFlow
  type:     string,    // 'source' or 'target'
  position: Position,  // Position.Left or Position.Right
  style:    object,    // optional — e.g. { top: '33%' } for vertical offset
  label:    string,    // optional — renders a label next to the handle
}
```

**Additional features built into BaseNode:**
- **Delete button** — a red `×` button fades in on hover in the node header. Uses ReactFlow's `useNodeId()` hook internally so no node file needs to pass its own ID down.
- **Handle labels** — if a handle has a `label` field, a small text label is rendered outside the node boundary next to that handle.
- **Theme-aware styling** — the `--node-color` CSS custom property is set on the wrapper so handles automatically inherit the correct accent color for both light and dark mode.

**Anatomy of a rendered node:**
```
              label
          ┌──────────────────────┐
  ●───    │  icon   LABEL      × │  ← header (accent color)
  ●───    ├──────────────────────┤
          │   node-specific      │  ← body (children)
     ───● │   fields/content     │
          └──────────────────────┘
```

**Benefits:**
- A new node is created in ~15 lines of code — just define `label`, `handles`, and body content
- Style changes to the node shell apply everywhere automatically
- No boilerplate to copy or maintain per node

---

### Original Nodes Refactored

| Node | Handles | Body |
|---|---|---|
| `InputNode` | 1 source (right) | Name input, type dropdown |
| `LLMNode` | 2 targets (system, prompt) + 1 source (response) | Static description |
| `OutputNode` | 1 target (left) | Name input, type dropdown |
| `TextNode` | Dynamic (see Part 3) | Auto-resizing textarea |

---

### New Nodes Created

Five initial nodes were added to demonstrate the abstraction, then expanded significantly. See the [Full Node Catalogue](#full-node-catalogue) for all 26 nodes.

---

## Part 2 — Styling

### Approach

A unified design system was built from scratch using **CSS custom properties (variables)**, inspired by the VectorShift pipeline builder aesthetic. The design supports both a **dark mode** (default) and a **light mode**, toggled via a button in the header.

---

### Design System (`variables.css`)

All design tokens are defined as CSS custom properties in two blocks:

- `:root` — light theme defaults
- `[data-theme="dark"]` — dark theme overrides (applied to `<html>` via `document.documentElement.setAttribute`)

**Token categories:**

| Category | Examples |
|---|---|
| App shell | `--app-bg`, `--header-bg`, `--header-border` |
| Sidebar | `--sidebar-bg`, `--sidebar-card-bg`, `--sidebar-card-text` |
| Category tabs | `--tab-active-bg`, `--tab-active-text`, `--tab-text` |
| Node shell | `--node-bg`, `--node-border`, `--node-shadow`, `--node-width` |
| Node header | `--node-header-text`, `--node-header-height` |
| Form controls | `--input-bg`, `--input-border`, `--input-color` |
| Handles | `--handle-color`, `--handle-size` |
| Edges | `--edge-color` |
| Node category accents | `--color-node-ai`, `--color-node-data-in`, `--color-node-storage`, etc. |

**Dark mode specifics:**
- Canvas background: `linear-gradient(135deg, #1a0533, #0f0a2e, #0c1445)`
- Nodes render as translucent dark glass cards (`rgba(30,20,60,0.88)` + `backdrop-filter: blur`)
- All node header accents unify to `rgba(124,58,237,0.4)` — a consistent purple across all categories
- Handles are always solid `#8b5cf6` purple

**Light mode specifics:**
- Canvas background: soft `#f5f3ff`
- Nodes are clean white cards with a subtle purple border
- Node headers use their individual category accent color

---

### Layout

The app is structured as a single-page shell with three zones:

```
┌─────────────────────────────────────────────────────┐
│  Header: Logo | Category Tabs | Panel Toggle | Theme | Submit │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │              Canvas (ReactFlow)          │
│ (nodes)  │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Header** — contains:
- Brand logo + "Build Pipeline" title
- Category filter tabs (All / LLMs / Multimodal / Data / VectorDB / Logic / Chat)
- Hide/Show Panel toggle button
- Light/Dark theme toggle (`☀ / ☾`)
- Submit button

**Sidebar** — collapsible left panel showing draggable node cards filtered by the active category tab. Each card shows the node's icon, name, description, and category badge.

**Canvas** — ReactFlow canvas with:
- Dot grid background (color adapts to theme)
- Purple animated dashed edges
- Node/edge count info bar (bottom-right)
- Empty state hint when canvas is empty

---

### Components Styled

| Component | Key styles |
|---|---|
| `.app-header` | Backdrop blur, border, two-row layout |
| `.tab-btn` | Pill shape, active state with background + color change |
| `.btn-primary` | Purple gradient, glow shadow |
| `.btn-ghost` | Translucent border, theme-aware |
| `.btn-theme` | Square icon button |
| `.sidebar-card` | Hover lift + border highlight animation |
| `.node-wrapper` | Glass effect in dark, clean white in light |
| `.node-delete-btn` | Hidden by default, red circle on node hover |
| `.node-handle` | Solid purple (dark) / category color (light) |
| `.react-flow__edge` | Red on hover/select (clickable feedback) |
| `.react-flow__controls` | Themed to match the header |
| `.modal` | Slide-up animation, blurred overlay |

---

## Part 3 — Text Node Logic

### Requirement 1 — Auto-resize

**Problem:** The original `TextNode` used a fixed-width `<input>` field. Long text was hidden and the node size never changed.

**Solution:** The `<input>` was replaced with a `<textarea>`, and two resize mechanisms were implemented:

**Height:**
```js
ta.style.height = 'auto';
ta.style.height = `${Math.max(MIN_HEIGHT, ta.scrollHeight)}px`;
```
On every keystroke, height is reset to `auto` then set to `scrollHeight`, causing it to grow line by line.

**Width:**
An off-screen mirror `<span>` is created once and appended to `document.body` (so it is never clipped by parent overflow). On every keystroke, the longest line of text is measured via the mirror span's `offsetWidth`, and the node's `--node-width` CSS custom property is updated directly on the wrapper element.

```js
mirror.textContent = longestLine;
const newWidth = Math.max(MIN_WIDTH, mirror.offsetWidth + 48);
wrapper.style.setProperty('--node-width', `${newWidth}px`);
```

The `nodrag nopan` classes are applied to the textarea so ReactFlow doesn't interpret typing or scrolling as canvas interaction.

---

### Requirement 2 — `{{ variable }}` → Dynamic Handles

**Problem:** We needed handles to appear/disappear on the left side of the Text node as users type `{{ varName }}` into the textarea.

**Solution:**

**Regex for detection:**
```js
/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g
```
This matches any `{{ name }}` where the name is a valid JavaScript identifier (starts with a letter or `_`, followed by letters, digits, or `_`). Invalid names like `{{ 123abc }}` or `{{ my var }}` are ignored.

**Variable extraction:**
```js
const extractVariables = (text) => {
  // Returns ordered, de-duplicated list of variable names found in text
};
```

**Dynamic handles:**
One `target` handle is created per unique variable, spread evenly along the left edge:
```js
variables.map((varName, i) => ({
  id:       `${id}-${varName}`,
  type:     'target',
  position: Position.Left,
  label:    varName,           // renders outside the node to the left
  style:    { top: topPercent(i, variables.length) },
}))
```

**Instant reactivity:**
Variables are tracked in **local React state** (`useState`) and updated synchronously on every keystroke inside `handleChange`, avoiding the store → ReactFlow data-prop round-trip delay.

**ReactFlow handle sync:**
ReactFlow's `useUpdateNodeInternals(id)` is called via `useEffect` whenever the variable list changes. This tells ReactFlow to re-scan the node's handles so edge connections remain valid.

```js
useEffect(() => {
  updateNodeInternals(id);
}, [variables, id, updateNodeInternals]);
```

**Handle labels** are rendered outside the node boundary to the left so they never overlap with the textarea content:
```css
.handle-label--target {
  left: -8px;
  transform: translate(-100%, -50%);
}
```

---

## Part 4 — Backend Integration

### Backend (`backend/main.py`)

**Endpoint:** `POST /pipelines/parse`

**Request body:**
```json
{
  "nodes": [ ...ReactFlow node objects... ],
  "edges": [ ...ReactFlow edge objects... ]
}
```

**Response:**
```json
{
  "num_nodes": 4,
  "num_edges": 3,
  "is_dag": true
}
```

**CORS** is enabled via `CORSMiddleware` so the React frontend (port 3000) can call the FastAPI backend (port 8000).

**DAG Detection — Kahn's Algorithm (Topological Sort):**

Kahn's algorithm processes nodes with in-degree 0 first, decrementing the in-degree of their neighbors. If every node is visited, there are no cycles and the graph is a DAG.

```python
def check_is_dag(nodes, edges):
    in_degree = {n["id"]: 0 for n in nodes}
    graph = defaultdict(list)

    for edge in edges:
        graph[edge["source"]].append(edge["target"])
        in_degree[edge["target"]] += 1

    queue = deque(nid for nid in in_degree if in_degree[nid] == 0)
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(nodes)
```

---

### Frontend Integration (`App.js` + `resultModal.js`)

**Submit flow:**
1. User clicks **▶ Submit** — button shows `...` and is disabled to prevent double-submission
2. `POST /pipelines/parse` is called with the current nodes and edges from the Zustand store
3. On success — the `ResultModal` opens with the backend response
4. On failure (backend unreachable) — the modal opens with frontend-computed counts and `is_dag: null`

**Result Modal** displays three stat cards:

| Stat | Visual |
|---|---|
| Node count | Purple icon card |
| Edge count | Purple icon card |
| Valid DAG | Green ✓ card if true / Red ✕ card if false |

A yellow warning message is shown if `is_dag` is `false`, explaining that the pipeline contains a cycle.

The modal has a slide-up entrance animation, a blurred backdrop overlay, and can be closed by clicking the overlay, the `×` button, or the **Done** button.

---

### Edge Deletion

Connections (edges) can be removed three ways:
1. **Click the edge** — instantly deletes it (`onEdgeClick` handler)
2. **Select + Delete key** — click to select (edge turns red), then press `Delete`
3. **Select + Backspace** — same as above with `Backspace`

Edges turn **red on hover** to indicate they are interactive and deletable.

---

## Full Node Catalogue

26 nodes across 6 categories, all built on `BaseNode`:

### Data
| Node | Description |
|---|---|
| `Input` | Pipeline entry point — name + type (Text/File) |
| `Output` | Pipeline result — name + type |
| `File Loader` | Reads a file by path — supports PDF, CSV, TXT, JSON, DOCX, XLSX |
| `Text` | Static or templated text with auto-resize and `{{ variable }}` handles |
| `Transform` | String transformation — uppercase, lowercase, trim, reverse |
| `Database` | Query a database — PostgreSQL, MySQL, SQLite, MongoDB, Redis |
| `Email Generator` | Compose emails with To, Subject, Tone, and Body template |
| `Note` | Canvas annotation — no handles, free-form text |

### LLMs
| Node | Description |
|---|---|
| `OpenAI` | GPT-4o / GPT-4 / o1 — model, temperature, max tokens |
| `Claude` | Anthropic Claude Opus/Sonnet/Haiku — model, temperature, max tokens |
| `Gemini` | Google Gemini 2.0/1.5 — model, max tokens |
| `LLM` | Generic LLM node — system + prompt inputs, response output |
| `Code Generator` | Generate code in any language with framework hint |

### Multimodal
| Node | Description |
|---|---|
| `Image Gen` | DALL-E / Stable Diffusion / Midjourney — size + quality |

### VectorDB
| Node | Description |
|---|---|
| `VectorDB Loader` | Embed and store documents — embedding model, collection, chunk size |
| `VectorDB Reader` | Retrieve from vector store — collection, top K, similarity threshold |
| `Vector DB` | Query / upsert / delete — operation, collection, top K |

### Logic
| Node | Description |
|---|---|
| `Conditional` | Branch on condition — operator + value, True/False outputs |
| `Filter` | Filter data by a condition expression |
| `Merge` | Combine two inputs into one output |
| `API` | HTTP request — URL + method (GET/POST/PUT/DELETE) |
| `Webhook` | Webhook trigger — method, path, auth type |
| `Scheduler` | Schedule trigger — interval presets or custom cron expression |

### Chat
| Node | Description |
|---|---|
| `Chat Memory` | Conversation history — Buffer / Window / Summary / Vector Store |
| `Slack` | Send Slack messages — channel, username, message body |

---

## File Structure

```
frontend_technical_assessment/
├── backend/
│   └── main.py                  # FastAPI app — /pipelines/parse endpoint + DAG check
│
└── frontend/src/
    ├── App.js                   # Root layout — theme, sidebar, submit, modal state
    ├── ui.js                    # ReactFlow canvas — all nodeTypes registered
    ├── store.js                 # Zustand store — nodes, edges, addNode, deleteNode, deleteEdge
    ├── toolbar.js               # Categorised sidebar panel with NODE_CATALOG
    ├── draggableNode.js         # Sidebar node card component
    ├── resultModal.js           # Pipeline analysis result modal
    ├── submit.js                # Legacy submit component (submit logic moved to App.js)
    ├── variables.css            # Design tokens — light + dark theme CSS custom properties
    ├── index.css                # All component styles
    │
    └── nodes/
        ├── baseNode.js          # Shared node abstraction (delete button, handle labels)
        ├── inputNode.js
        ├── outputNode.js
        ├── llmNode.js
        ├── textNode.js          # Auto-resize + {{ variable }} dynamic handles
        ├── filterNode.js
        ├── mergeNode.js
        ├── apiNode.js
        ├── transformNode.js
        ├── noteNode.js
        ├── fileLoaderNode.js
        ├── vectorDBNode.js
        ├── vectorDBLoaderNode.js
        ├── vectorDBReaderNode.js
        ├── slackNode.js
        ├── emailGeneratorNode.js
        ├── codeGeneratorNode.js
        ├── webhookNode.js
        ├── databaseNode.js
        ├── schedulerNode.js
        ├── openAINode.js
        ├── claudeNode.js
        ├── geminiNode.js
        ├── imageGenNode.js
        ├── conditionalNode.js
        ├── chatMemoryNode.js
        └── vectorDBReaderNode.js
```
