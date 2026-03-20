from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import defaultdict, deque

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://build-pipeline.netlify.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request schema ────────────────────────────────────────────────────────────

class PipelineRequest(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


# ── DAG check (Kahn's algorithm / topological sort) ──────────────────────────
# If every node can be visited by processing nodes with in-degree 0 first,
# there is no cycle → the graph is a DAG.

def check_is_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    node_ids = {n["id"] for n in nodes}

    in_degree: Dict[str, int] = {nid: 0 for nid in node_ids}
    graph: Dict[str, List[str]] = defaultdict(list)

    for edge in edges:
        src = edge.get("source", "")
        tgt = edge.get("target", "")
        if src in node_ids and tgt in node_ids:
            graph[src].append(tgt)
            in_degree[tgt] += 1

    # Start with all nodes that have no incoming edges
    queue = deque(nid for nid in node_ids if in_degree[nid] == 0)
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If every node was visited there is no cycle
    return visited == len(node_ids)


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(data: PipelineRequest):
    num_nodes = len(data.nodes)
    num_edges = len(data.edges)
    is_dag    = check_is_dag(data.nodes, data.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag":    is_dag,
    }
