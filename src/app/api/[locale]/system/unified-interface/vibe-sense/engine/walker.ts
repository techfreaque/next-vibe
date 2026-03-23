/**
 * Vibe Sense - DAG Walker
 *
 * Topological sort of a graph's nodes for correct execution order.
 * Deduplicates shared indicator nodes across multiple graphs.
 */

import type { GraphNodeConfig } from "../graph/schema";
import type { GraphConfig } from "../graph/types";

// ─── Topological Sort ─────────────────────────────────────────────────────────

/**
 * Returns nodes in topological order (sources first, actions last).
 * Used by the executor to process nodes in dependency order.
 */
export interface ExecutionOrder {
  order: string[];
  cycleNodes: string[];
}

export function resolveExecutionOrder(config: GraphConfig): ExecutionOrder {
  const nodeIds = Object.keys(config.nodes);
  const nodeIdSet = new Set(nodeIds);
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  // Initialize
  for (const id of nodeIds) {
    inDegree.set(id, 0);
    adjacency.set(id, []);
  }

  // Build adjacency from edges (from → to means "to depends on from")
  // Skip edges referencing unknown nodes to avoid corrupting the sort
  for (const edge of config.edges) {
    const from = edge.from;
    const to = edge.to;
    if (!nodeIdSet.has(from) || !nodeIdSet.has(to)) {
      continue;
    }
    adjacency.get(from)?.push(to);
    inDegree.set(to, (inDegree.get(to) ?? 0) + 1);
  }

  // Kahn's algorithm
  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) {
      queue.push(id);
    }
  }

  const order: string[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    const neighbors = adjacency.get(node) ?? [];
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (order.length !== nodeIds.length) {
    // Cycle detected - identify the cycle nodes for error reporting
    const resolved = new Set(order);
    const cycleNodes = nodeIds.filter((id) => !resolved.has(id));
    return { order, cycleNodes };
  }

  return { order, cycleNodes: [] };
}

// ─── Input Resolution ─────────────────────────────────────────────────────────

/**
 * For a given node, returns the IDs of all nodes that feed into it.
 */
export function getNodeInputIds(nodeId: string, config: GraphConfig): string[] {
  return config.edges.filter((e) => e.to === nodeId).map((e) => e.from);
}

/**
 * For a given node, returns the IDs of all nodes that it feeds into.
 */
export function getNodeOutputIds(
  nodeId: string,
  config: GraphConfig,
): string[] {
  return config.edges.filter((e) => e.from === nodeId).map((e) => e.to);
}

// ─── Deduplication Across Graphs ──────────────────────────────────────────────

export interface SharedNodeKey {
  endpointPath: string;
  graphId: string;
}

/**
 * Given multiple graph configs, returns a deduplicated set of endpoint node paths.
 * Nodes with the same endpointPath can share computed results across graphs.
 */
export function collectSharedEndpointPaths(
  graphs: Array<{ graphId: string; config: GraphConfig }>,
): Map<string, SharedNodeKey[]> {
  const shared = new Map<string, SharedNodeKey[]>();

  for (const { graphId, config } of graphs) {
    for (const node of Object.values(config.nodes)) {
      const endpointPath = node.endpointPath;
      if (!endpointPath) {
        continue;
      }
      const existing = shared.get(endpointPath) ?? [];
      existing.push({ endpointPath, graphId });
      shared.set(endpointPath, existing);
    }
  }

  return shared;
}

// ─── Node Type Helpers ────────────────────────────────────────────────────────

export function isLeafNode(nodeId: string, config: GraphConfig): boolean {
  return !config.edges.some((e) => e.from === nodeId);
}

export function isRootNode(nodeId: string, config: GraphConfig): boolean {
  return !config.edges.some((e) => e.to === nodeId);
}

export function getNodeConfig(
  nodeId: string,
  config: GraphConfig,
): GraphNodeConfig | undefined {
  return config.nodes[nodeId];
}

// ─── Cron Pruning ─────────────────────────────────────────────────────────────

/**
 * Returns the set of node IDs that have a path to at least one sink node
 * (evaluator or endpoint type). Used by the runner to skip chart-only nodes
 * during scheduled cron runs - those nodes are computed on-demand when charting.
 *
 * A node is "sink-reachable" if it IS a sink OR any of its descendants is a sink.
 * Nodes that are NOT sink-reachable are pure chart nodes - no action depends on them.
 */
export function getSinkReachableNodeIds(config: GraphConfig): Set<string> {
  // Build reverse adjacency: child → parents (who feeds into child)
  const reverseAdj = new Map<string, string[]>();
  for (const nodeId of Object.keys(config.nodes)) {
    reverseAdj.set(nodeId, []);
  }
  for (const edge of config.edges) {
    if (reverseAdj.has(edge.to)) {
      reverseAdj.get(edge.to)!.push(edge.from);
    }
  }

  // Find all sink nodes (evaluators produce signals; identified by path containing "evaluator")
  const reachable = new Set<string>();
  const queue: string[] = [];

  for (const [nodeId, nodeConfig] of Object.entries(config.nodes)) {
    if ((nodeConfig.endpointPath ?? "").includes("evaluator")) {
      queue.push(nodeId);
      reachable.add(nodeId);
    }
  }

  // BFS backwards through the graph - mark all ancestors of sinks
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    for (const parentId of reverseAdj.get(nodeId) ?? []) {
      if (!reachable.has(parentId)) {
        reachable.add(parentId);
        queue.push(parentId);
      }
    }
  }

  return reachable;
}
