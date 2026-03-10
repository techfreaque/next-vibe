/**
 * Vibe Sense — Edit Graph Widget
 *
 * Three-panel React Flow builder:
 *   Left sidebar  — Node Palette (indicators, endpoints, transformers, evaluators)
 *   Center        — React Flow canvas (drag, connect, position)
 *   Right panel   — Node Inspector (type-specific config editor)
 *   Bottom bar    — Name, description, trigger config, save
 *
 * Creates a new version (branch) on save — never mutates.
 */

"use client";

import "@xyflow/react/dist/style.css";

import {
  addEdge,
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card } from "next-vibe-ui/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { PanelLeftClose } from "next-vibe-ui/ui/icons/PanelLeftClose";
import { PanelLeftOpen } from "next-vibe-ui/ui/icons/PanelLeftOpen";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Trash } from "next-vibe-ui/ui/icons/Trash";
import { X } from "next-vibe-ui/ui/icons/X";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type {
  EndpointNodeConfig,
  EvaluatorArgs,
  EvaluatorNodeConfig,
  EvaluatorType,
  GraphConfig,
  GraphEdge,
  GraphNodeConfig,
  InputMapping,
  NodePosition,
  SignalInputMapping,
  StaticInputMapping,
  TransformerFn,
  TransformerNodeConfig,
  TriggerConfig,
} from "../../../graph/types";
import { GraphResolution } from "../../../enum";

import parentDefinitions from "../data/definition";
import registryDefinitions from "../../../registry/definition";
import type definition from "./definition";

// ─── i18n helpers ───────────────────────────────────────────────────────────

/** Map TransformerFn → i18n key (avoids template literal assertions) */
const TRANSFORMER_I18N_KEYS: Record<
  TransformerFn,
  | "widget.transformer.field_pick"
  | "widget.transformer.json_path"
  | "widget.transformer.merge"
  | "widget.transformer.window_avg"
  | "widget.transformer.window_sum"
  | "widget.transformer.window_min"
  | "widget.transformer.window_max"
  | "widget.transformer.ratio"
  | "widget.transformer.delta"
  | "widget.transformer.clamp"
  | "widget.transformer.script"
> = {
  field_pick: "widget.transformer.field_pick",
  json_path: "widget.transformer.json_path",
  merge: "widget.transformer.merge",
  window_avg: "widget.transformer.window_avg",
  window_sum: "widget.transformer.window_sum",
  window_min: "widget.transformer.window_min",
  window_max: "widget.transformer.window_max",
  ratio: "widget.transformer.ratio",
  delta: "widget.transformer.delta",
  clamp: "widget.transformer.clamp",
  script: "widget.transformer.script",
} as const;

/** Map EvaluatorType → i18n key */
const EVALUATOR_I18N_KEYS: Record<
  EvaluatorType,
  | "widget.evaluator.threshold"
  | "widget.evaluator.crossover"
  | "widget.evaluator.and"
  | "widget.evaluator.or"
  | "widget.evaluator.not"
  | "widget.evaluator.script"
> = {
  threshold: "widget.evaluator.threshold",
  crossover: "widget.evaluator.crossover",
  and: "widget.evaluator.and",
  or: "widget.evaluator.or",
  not: "widget.evaluator.not",
  script: "widget.evaluator.script",
} as const;

// ─── Constants ──────────────────────────────────────────────────────────────

const NODE_COLORS: Record<string, { badge: string; border: string }> = {
  indicator: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    border: "border-blue-400 dark:border-blue-600",
  },
  "inline-derived": {
    badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    border: "border-cyan-400 dark:border-cyan-600",
  },
  transformer: {
    badge:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    border: "border-purple-400 dark:border-purple-600",
  },
  evaluator: {
    badge:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    border: "border-orange-400 dark:border-orange-600",
  },
  endpoint: {
    badge:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    border: "border-green-400 dark:border-green-600",
  },
};

const DEFAULT_NODE_COLORS = {
  badge: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  border: "border-gray-400 dark:border-gray-600",
};

/** Transformer/evaluator values — labels resolved via i18n at render time */
const TRANSFORMER_VALUES: TransformerFn[] = [
  "field_pick",
  "json_path",
  "merge",
  "window_avg",
  "window_sum",
  "window_min",
  "window_max",
  "ratio",
  "delta",
  "clamp",
  "script",
];

const EVALUATOR_VALUES: EvaluatorType[] = [
  "threshold",
  "crossover",
  "and",
  "or",
  "not",
  "script",
];

function isValidCron(cron: string): boolean {
  return /^(\S+\s){4}\S+$/.test(cron.trim());
}

const TYPE_TIER: Record<string, number> = {
  indicator: 0,
  "inline-derived": 1,
  transformer: 1,
  evaluator: 2,
  endpoint: 3,
};

// ─── Display-override helper ─────────────────────────────────────────────────

interface DisplayOverride {
  color?: string;
  pane?: number;
}

function withDisplayOverride(
  node: GraphNodeConfig,
  override: DisplayOverride,
): GraphNodeConfig {
  switch (node.type) {
    case "indicator":
      return { ...node, ...override };
    case "inline-derived":
      return { ...node, ...override };
    case "transformer":
      return { ...node, ...override };
    case "evaluator":
      return { ...node, ...override };
    case "endpoint":
      return { ...node, ...override };
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getNodeDetail(node: GraphNodeConfig): string {
  switch (node.type) {
    case "indicator":
      return node.indicatorId;
    case "inline-derived":
      return `${node.transformerFn}(${node.inputs.join(", ")})`;
    case "transformer":
      return `${node.fn}(${node.inputs.join(", ")})`;
    case "evaluator":
      if (
        node.evaluatorType === "threshold" &&
        node.args?.type === "threshold"
      ) {
        return `${node.evaluatorType}: ${node.args.op} ${String(node.args.value)}`;
      }
      return node.evaluatorType;
    case "endpoint":
      return `${node.method} ${node.endpointId}`;
  }
}

function autoLayout(
  nodes: Record<string, GraphNodeConfig>,
): Record<string, NodePosition> {
  const tiers: Record<number, string[]> = {};
  for (const [id, node] of Object.entries(nodes)) {
    const tier = TYPE_TIER[node.type] ?? 1;
    const tierNodes = tiers[tier] ?? [];
    tierNodes.push(id);
    tiers[tier] = tierNodes;
  }
  const positions: Record<string, NodePosition> = {};
  for (const [tierStr, ids] of Object.entries(tiers)) {
    const x = Number(tierStr) * 300;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id !== undefined) {
        positions[id] = { x, y: i * 140 };
      }
    }
  }
  return positions;
}

function generateNodeId(
  prefix: string,
  existing: Record<string, GraphNodeConfig>,
): string {
  let idx = 1;
  while (`${prefix}_${String(idx)}` in existing) {
    idx++;
  }
  return `${prefix}_${String(idx)}`;
}

// ─── Types ──────────────────────────────────────────────────────────────────

type ThresholdOp = ">" | "<" | ">=" | "<=" | "==";
type TriggerType = "manual" | "cron";

type EditResponseOutput = typeof definition.PUT.types.ResponseOutput;

interface VibeNodeData {
  nodeId: string;
  nodeConfig: GraphConfig["nodes"][string];
  label: string;
  selected?: boolean;
  [key: string]: string | GraphConfig["nodes"][string] | boolean | undefined;
}

type VibeNode = Node<VibeNodeData>;
type VibeEdge = Edge;

interface CustomWidgetProps {
  field: {
    value: EditResponseOutput | null | undefined;
  } & (typeof definition.PUT)["fields"];
  fieldName: string;
}

type RegistryIndicator = NonNullable<
  typeof registryDefinitions.GET.types.ResponseOutput
>["indicators"][number];

// ─── Config ↔ Flow ──────────────────────────────────────────────────────────

function configToFlow(config: GraphConfig): {
  nodes: VibeNode[];
  edges: VibeEdge[];
} {
  const positions =
    config.positions && Object.keys(config.positions).length > 0
      ? config.positions
      : autoLayout(config.nodes);

  const nodes: VibeNode[] = Object.entries(config.nodes).map(
    ([nodeId, nodeConfig]) => ({
      id: nodeId,
      type: "vibeNode",
      position: positions[nodeId] ?? { x: 0, y: 0 },
      data: { nodeId, nodeConfig, label: getNodeDetail(nodeConfig) },
    }),
  );

  const edges: VibeEdge[] = config.edges.map((e, idx) => ({
    id: `${e.from}->${e.to}-${String(idx)}`,
    source: e.from,
    target: e.to,
    sourceHandle: e.fromHandle ?? null,
    targetHandle: e.toHandle ?? null,
    animated: true,
  }));

  return { nodes, edges };
}

function flowToConfig(
  original: GraphConfig,
  nodes: VibeNode[],
  edges: VibeEdge[],
): GraphConfig {
  const positions: Record<string, NodePosition> = {};
  const nodeConfigs: Record<string, GraphNodeConfig> = {};
  for (const node of nodes) {
    positions[node.id] = { x: node.position.x, y: node.position.y };
    if (node.data.nodeConfig) {
      nodeConfigs[node.id] = node.data.nodeConfig;
    }
  }

  const graphEdges: GraphEdge[] = edges.map((e) => ({
    from: e.source,
    to: e.target,
    ...(e.sourceHandle ? { fromHandle: e.sourceHandle } : {}),
    ...(e.targetHandle ? { toHandle: e.targetHandle } : {}),
  }));

  return {
    ...original,
    nodes: { ...original.nodes, ...nodeConfigs },
    edges: graphEdges,
    positions,
  };
}

// ─── Custom Node ────────────────────────────────────────────────────────────

function getTargetHandles(node: GraphNodeConfig): string[] {
  if (node.type === "indicator") {
    return [];
  }
  if (
    (node.type === "transformer" || node.type === "inline-derived") &&
    node.inputs.length > 1
  ) {
    const handles: string[] = [];
    for (let i = 0; i < node.inputs.length; i++) {
      handles.push(String.fromCharCode(97 + i));
    }
    return handles;
  }
  return [""];
}

function VibeNodeCard({ data }: NodeProps<VibeNode>): React.JSX.Element {
  const colors = NODE_COLORS[data.nodeConfig.type] ?? DEFAULT_NODE_COLORS;
  const targetHandles = getTargetHandles(data.nodeConfig);

  return (
    <Div
      className={`rounded-lg border-2 bg-card px-3 py-2 shadow-sm min-w-[180px] max-w-[260px] transition-shadow ${colors.border} ${data.selected ? "shadow-md ring-2 ring-primary/40" : ""}`}
    >
      {targetHandles.map((handleId, idx) => (
        <Handle
          key={handleId || "target"}
          type="target"
          position={Position.Left}
          id={handleId || undefined}
          className="!w-3 !h-3 !bg-muted-foreground/60 !border-2 !border-background"
          style={
            targetHandles.length > 1
              ? {
                  top: `${((idx + 1) / (targetHandles.length + 1)) * 100}%`,
                }
              : undefined
          }
        />
      ))}
      <Div className="flex items-center gap-1.5 mb-1">
        <Badge
          variant="secondary"
          className={`text-[10px] px-1.5 py-0 ${colors.badge}`}
        >
          {data.nodeConfig.type}
        </Badge>
      </Div>
      <P className="text-xs font-mono font-medium truncate text-foreground">
        {data.nodeId}
      </P>
      <P className="text-[11px] text-muted-foreground truncate mt-0.5">
        {data.label}
      </P>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-muted-foreground/60 !border-2 !border-background"
      />
    </Div>
  );
}

const nodeTypes: NodeTypes = { vibeNode: VibeNodeCard };

// ─── Palette Section ────────────────────────────────────────────────────────

function PaletteSection({
  title,
  badge,
  children,
  defaultOpen,
}: {
  title: string;
  badge: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}): React.JSX.Element {
  const [open, setOpen] = useState(defaultOpen ?? true);

  return (
    <Div className="border-b border-border/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="w-full justify-between px-3 py-2 h-auto text-xs font-medium"
      >
        <Div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={`text-[9px] px-1 py-0 ${badge}`}
          >
            {title}
          </Badge>
        </Div>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </Button>
      {open && <Div className="px-2 pb-2 flex flex-col gap-1">{children}</Div>}
    </Div>
  );
}

function PaletteItem({
  label,
  detail,
  onClick,
}: {
  label: string;
  detail: string;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="w-full justify-start h-auto py-1.5 px-2 text-left hover:bg-accent border border-transparent hover:border-border/50 rounded"
    >
      <Div className="flex flex-col gap-0 min-w-0">
        <P className="text-xs font-medium truncate">{label}</P>
        <P className="text-[10px] text-muted-foreground truncate">{detail}</P>
      </Div>
    </Button>
  );
}

// ─── Node Inspector ─────────────────────────────────────────────────────────

type TFn = (
  key: (typeof definition.PUT)["scopedTranslation"]["ScopedTranslationKey"],
) => string;

function NodeInspector({
  nodeId,
  nodeConfig,
  graphConfig,
  onUpdate,
  onDelete,
  onClose,
  t,
  deleteConfirmNodeId,
  setDeleteConfirmNodeId,
}: {
  nodeId: string;
  nodeConfig: GraphNodeConfig;
  graphConfig: GraphConfig;
  onUpdate: (nodeId: string, updated: GraphNodeConfig) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
  t: TFn;
  deleteConfirmNodeId: string | null;
  setDeleteConfirmNodeId: (id: string | null) => void;
}): React.JSX.Element {
  const colors = NODE_COLORS[nodeConfig.type] ?? DEFAULT_NODE_COLORS;
  const isConfirmingDelete = deleteConfirmNodeId === nodeId;

  return (
    <Div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <Div className="flex items-center justify-between">
        <Div className="flex items-center gap-2 min-w-0">
          <Badge
            variant="secondary"
            className={`text-[10px] px-1.5 py-0 shrink-0 ${colors.badge}`}
          >
            {nodeConfig.type}
          </Badge>
          <P className="text-xs font-mono font-medium truncate">{nodeId}</P>
        </Div>
        <Div className="flex items-center gap-1 shrink-0">
          {isConfirmingDelete ? (
            <>
              <Button
                variant="destructive"
                size="sm"
                className="h-6 px-2 text-[10px]"
                onClick={() => {
                  setDeleteConfirmNodeId(null);
                  onDelete(nodeId);
                }}
              >
                {t("widget.inspector.deleteConfirmYes")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px]"
                onClick={() => setDeleteConfirmNodeId(null)}
              >
                {t("widget.inspector.deleteConfirmNo")}
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              title={t("widget.inspector.deleteConfirm")}
              onClick={() => setDeleteConfirmNodeId(nodeId)}
            >
              <Trash className="h-3 w-3 text-destructive" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        </Div>
      </Div>

      {/* Type-specific config */}
      <Div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {nodeConfig.type === "indicator" && (
          <InspectorIndicator nodeConfig={nodeConfig} t={t} />
        )}
        {nodeConfig.type === "endpoint" && (
          <InspectorEndpoint
            nodeId={nodeId}
            nodeConfig={nodeConfig}
            graphConfig={graphConfig}
            onUpdate={onUpdate}
            t={t}
          />
        )}
        {nodeConfig.type === "transformer" && (
          <InspectorTransformer
            nodeId={nodeId}
            nodeConfig={nodeConfig}
            onUpdate={onUpdate}
            t={t}
          />
        )}
        {nodeConfig.type === "evaluator" && (
          <InspectorEvaluator
            nodeId={nodeId}
            nodeConfig={nodeConfig}
            onUpdate={onUpdate}
            t={t}
          />
        )}
        {nodeConfig.type === "inline-derived" && (
          <InspectorInlineDerived nodeConfig={nodeConfig} t={t} />
        )}

        {/* Display options (shared) */}
        <Div className="border-t pt-2 mt-1">
          <P className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {t("widget.inspector.display")}
          </P>
          <Div className="flex flex-col gap-1.5">
            <Div className="flex items-center gap-2">
              <Label className="text-[11px] w-12">
                {t("widget.inspector.color")}
              </Label>
              <Input
                value={"color" in nodeConfig ? (nodeConfig.color ?? "") : ""}
                onChangeText={(v) => {
                  onUpdate(
                    nodeId,
                    withDisplayOverride(nodeConfig, { color: v || undefined }),
                  );
                }}
                className="h-6 text-[11px] flex-1"
                placeholder="#3b82f6"
              />
            </Div>
            <Div className="flex items-center gap-2">
              <Label className="text-[11px] w-12">
                {t("widget.inspector.pane")}
              </Label>
              <Input
                value={
                  "pane" in nodeConfig && nodeConfig.pane !== undefined
                    ? String(nodeConfig.pane)
                    : ""
                }
                onChangeText={(v) => {
                  const num = parseInt(v, 10);
                  onUpdate(
                    nodeId,
                    withDisplayOverride(nodeConfig, {
                      pane: isNaN(num) ? undefined : num,
                    }),
                  );
                }}
                className="h-6 text-[11px] w-12"
                placeholder="0"
              />
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

function InspectorIndicator({
  nodeConfig,
  t,
}: {
  nodeConfig: GraphNodeConfig;
  t: TFn;
}): React.JSX.Element {
  if (nodeConfig.type !== "indicator") {
    return <Div />;
  }
  return (
    <Div className="flex flex-col gap-1.5">
      <InspectorField
        label={t("widget.inspector.indicator")}
        value={nodeConfig.indicatorId}
        readOnly
      />
      <P className="text-[10px] text-muted-foreground">
        {t("widget.inspector.indicatorHint")}
      </P>
    </Div>
  );
}

function InspectorEndpoint({
  nodeId,
  nodeConfig,
  graphConfig,
  onUpdate,
  t,
}: {
  nodeId: string;
  nodeConfig: EndpointNodeConfig;
  graphConfig: GraphConfig;
  onUpdate: (nodeId: string, updated: GraphNodeConfig) => void;
  t: TFn;
}): React.JSX.Element {
  const upstreamNodes = Object.keys(graphConfig.nodes).filter(
    (id) => id !== nodeId,
  );

  return (
    <Div className="flex flex-col gap-1.5">
      <InspectorField
        label={t("widget.inspector.endpoint")}
        value={nodeConfig.endpointId}
        readOnly
      />
      <InspectorField
        label={t("widget.inspector.method")}
        value={nodeConfig.method}
        readOnly
      />

      {nodeConfig.outputField !== undefined && (
        <Div className="flex items-center gap-2">
          <Label className="text-[11px] w-16 shrink-0">
            {t("widget.inspector.output")}
          </Label>
          <Input
            value={nodeConfig.outputField}
            onChangeText={(v) => {
              onUpdate(nodeId, { ...nodeConfig, outputField: v || undefined });
            }}
            className="h-6 text-[11px] flex-1"
            placeholder="response field"
          />
        </Div>
      )}

      {/* Input Mapping Editor */}
      <Div className="border-t pt-2 mt-1">
        <P className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {t("widget.inspector.inputMapping")}
        </P>
        {Object.entries(nodeConfig.inputMapping).map(([field, mapping]) => (
          <Div key={field} className="mb-2 rounded border p-1.5 bg-muted/20">
            <P className="text-[10px] font-mono font-medium mb-1">{field}</P>
            <Select
              value={mapping.source}
              onValueChange={(source) => {
                const newMapping: InputMapping = { ...nodeConfig.inputMapping };
                if (source === "static") {
                  newMapping[field] = { source: "static", value: "" };
                } else if (source === "node") {
                  newMapping[field] = {
                    source: "node",
                    nodeId: upstreamNodes[0] ?? "",
                    field: "value",
                  };
                } else {
                  newMapping[field] = { source: "signal", field: "fired" };
                }
                onUpdate(nodeId, { ...nodeConfig, inputMapping: newMapping });
              }}
            >
              <SelectTrigger className="h-6 text-[11px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">
                  {t("widget.inspector.sourceStatic")}
                </SelectItem>
                <SelectItem value="node">
                  {t("widget.inspector.sourceNode")}
                </SelectItem>
                <SelectItem value="signal">
                  {t("widget.inspector.sourceSignal")}
                </SelectItem>
              </SelectContent>
            </Select>
            {mapping.source === "static" && (
              <Input
                value={mapping.value !== null ? String(mapping.value) : ""}
                onChangeText={(v) => {
                  const newMapping = { ...nodeConfig.inputMapping };
                  const staticMapping: StaticInputMapping = {
                    source: "static",
                    value: v,
                  };
                  newMapping[field] = staticMapping;
                  onUpdate(nodeId, { ...nodeConfig, inputMapping: newMapping });
                }}
                className="h-6 text-[11px] mt-1"
                placeholder="value"
              />
            )}
            {mapping.source === "node" && (
              <Div className="flex gap-1 mt-1">
                <Select
                  value={mapping.nodeId}
                  onValueChange={(nid) => {
                    const newMapping = { ...nodeConfig.inputMapping };
                    newMapping[field] = { ...mapping, nodeId: nid };
                    onUpdate(nodeId, {
                      ...nodeConfig,
                      inputMapping: newMapping,
                    });
                  }}
                >
                  <SelectTrigger className="h-6 text-[11px] flex-1">
                    <SelectValue placeholder="node" />
                  </SelectTrigger>
                  <SelectContent>
                    {upstreamNodes.map((nid) => (
                      <SelectItem key={nid} value={nid}>
                        {nid}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={mapping.field}
                  onChangeText={(v) => {
                    const newMapping = { ...nodeConfig.inputMapping };
                    newMapping[field] = { ...mapping, field: v };
                    onUpdate(nodeId, {
                      ...nodeConfig,
                      inputMapping: newMapping,
                    });
                  }}
                  className="h-6 text-[11px] w-16"
                  placeholder="field"
                />
              </Div>
            )}
            {mapping.source === "signal" && (
              <Input
                value={mapping.field}
                onChangeText={(v) => {
                  const newMapping = { ...nodeConfig.inputMapping };
                  const signalMapping: SignalInputMapping = {
                    source: "signal",
                    field: v,
                  };
                  newMapping[field] = signalMapping;
                  onUpdate(nodeId, { ...nodeConfig, inputMapping: newMapping });
                }}
                className="h-6 text-[11px] mt-1"
                placeholder="meta.field"
              />
            )}
          </Div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[10px] w-full"
          onClick={() => {
            const newMapping = { ...nodeConfig.inputMapping };
            const fieldName = `field_${String(Object.keys(newMapping).length + 1)}`;
            newMapping[fieldName] = { source: "static", value: "" };
            onUpdate(nodeId, { ...nodeConfig, inputMapping: newMapping });
          }}
        >
          {t("widget.addField")}
        </Button>
      </Div>
    </Div>
  );
}

function InspectorTransformer({
  nodeId,
  nodeConfig,
  onUpdate,
  t,
}: {
  nodeId: string;
  nodeConfig: TransformerNodeConfig;
  onUpdate: (nodeId: string, updated: GraphNodeConfig) => void;
  t: TFn;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-1.5">
      <Div className="flex items-center gap-2">
        <Label className="text-[11px] w-16 shrink-0">
          {t("widget.inspector.function")}
        </Label>
        <Select<TransformerFn>
          value={nodeConfig.fn}
          onValueChange={(fn) => {
            onUpdate(nodeId, { ...nodeConfig, fn });
          }}
        >
          <SelectTrigger className="h-6 text-[11px] flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRANSFORMER_VALUES.map((val) => (
              <SelectItem key={val} value={val}>
                {t(TRANSFORMER_I18N_KEYS[val])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Div>
      <InspectorField
        label={t("widget.inspector.inputs")}
        value={nodeConfig.inputs.join(", ")}
        readOnly
      />
      {(nodeConfig.fn === "window_avg" ||
        nodeConfig.fn === "window_sum" ||
        nodeConfig.fn === "window_min" ||
        nodeConfig.fn === "window_max") && (
        <Div className="flex items-center gap-2">
          <Label className="text-[11px] w-16 shrink-0">
            {t("widget.inspector.size")}
          </Label>
          <Input
            value={
              nodeConfig.args?.size !== undefined
                ? String(nodeConfig.args.size)
                : "7"
            }
            onChangeText={(v) => {
              const size = parseInt(v, 10);
              onUpdate(nodeId, {
                ...nodeConfig,
                args: { ...nodeConfig.args, size: isNaN(size) ? 7 : size },
              });
            }}
            className="h-6 text-[11px] w-16"
          />
        </Div>
      )}
      {nodeConfig.fn === "field_pick" && (
        <Div className="flex items-center gap-2">
          <Label className="text-[11px] w-16 shrink-0">
            {t("widget.inspector.field")}
          </Label>
          <Input
            value={
              nodeConfig.args?.field !== undefined
                ? String(nodeConfig.args.field)
                : ""
            }
            onChangeText={(v) => {
              onUpdate(nodeId, {
                ...nodeConfig,
                args: { ...nodeConfig.args, field: v },
              });
            }}
            className="h-6 text-[11px] flex-1"
            placeholder="fieldName"
          />
        </Div>
      )}
      {nodeConfig.fn === "json_path" && (
        <Div className="flex items-center gap-2">
          <Label className="text-[11px] w-16 shrink-0">
            {t("widget.inspector.path")}
          </Label>
          <Input
            value={
              nodeConfig.args?.path !== undefined
                ? String(nodeConfig.args.path)
                : ""
            }
            onChangeText={(v) => {
              onUpdate(nodeId, {
                ...nodeConfig,
                args: { ...nodeConfig.args, path: v },
              });
            }}
            className="h-6 text-[11px] flex-1"
            placeholder="data.stats.total"
          />
        </Div>
      )}
    </Div>
  );
}

function InspectorEvaluator({
  nodeId,
  nodeConfig,
  onUpdate,
  t,
}: {
  nodeId: string;
  nodeConfig: EvaluatorNodeConfig;
  onUpdate: (nodeId: string, updated: GraphNodeConfig) => void;
  t: TFn;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-1.5">
      <Div className="flex items-center gap-2">
        <Label className="text-[11px] w-16 shrink-0">
          {t("widget.inspector.type")}
        </Label>
        <Select<EvaluatorType>
          value={nodeConfig.evaluatorType}
          onValueChange={(et) => {
            let args: EvaluatorArgs | undefined;
            if (et === "threshold") {
              args = { type: "threshold", op: ">", value: 0 };
            } else if (et === "crossover") {
              args = { type: "crossover" };
            } else if (et === "and" || et === "or" || et === "not") {
              args = { type: et };
            }
            onUpdate(nodeId, { ...nodeConfig, evaluatorType: et, args });
          }}
        >
          <SelectTrigger className="h-6 text-[11px] flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EVALUATOR_VALUES.map((val) => (
              <SelectItem key={val} value={val}>
                {t(EVALUATOR_I18N_KEYS[val])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Div>
      {nodeConfig.evaluatorType === "threshold" &&
        nodeConfig.args?.type === "threshold" &&
        (() => {
          const tArgs = nodeConfig.args;
          return (
            <Div className="flex items-center gap-1">
              <Select<ThresholdOp>
                value={tArgs.op}
                onValueChange={(op) => {
                  onUpdate(nodeId, {
                    ...nodeConfig,
                    args: { type: "threshold", op, value: tArgs.value },
                  });
                }}
              >
                <SelectTrigger className="h-6 text-[11px] w-14">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {([">", "<", ">=", "<=", "=="] satisfies ThresholdOp[]).map(
                    (op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <Input
                value={String(tArgs.value)}
                onChangeText={(v) => {
                  const num = parseFloat(v);
                  if (!isNaN(num)) {
                    onUpdate(nodeId, {
                      ...nodeConfig,
                      args: { type: "threshold", op: tArgs.op, value: num },
                    });
                  }
                }}
                className="h-6 text-[11px] flex-1"
              />
            </Div>
          );
        })()}
      <InspectorField
        label={t("widget.inspector.inputs")}
        value={nodeConfig.inputs.join(", ")}
        readOnly
      />
    </Div>
  );
}

function InspectorInlineDerived({
  nodeConfig,
  t,
}: {
  nodeConfig: GraphNodeConfig;
  t: TFn;
}): React.JSX.Element {
  if (nodeConfig.type !== "inline-derived") {
    return <Div />;
  }
  return (
    <Div className="flex flex-col gap-1.5">
      <InspectorField
        label={t("widget.inspector.function")}
        value={nodeConfig.transformerFn}
        readOnly
      />
      <InspectorField
        label={t("widget.inspector.inputs")}
        value={nodeConfig.inputs.join(", ")}
        readOnly
      />
      <InspectorField
        label={t("widget.inspector.resolution")}
        value={nodeConfig.resolution}
        readOnly
      />
    </Div>
  );
}

function InspectorField({
  label,
  value,
  readOnly,
}: {
  label: string;
  value: string;
  readOnly?: boolean;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2">
      <Label className="text-[11px] w-16 shrink-0 text-muted-foreground">
        {label}
      </Label>
      <P
        className={`text-[11px] font-mono truncate ${readOnly ? "text-muted-foreground" : ""}`}
      >
        {value}
      </P>
    </Div>
  );
}

// ─── Edit Form Inner ────────────────────────────────────────────────────────

function EditFormInner(): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.PUT>();
  const navigation = useWidgetNavigation();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const form = useWidgetForm<typeof definition.PUT>();
  const reactFlow = useReactFlow();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dirty, setDirty] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [triggerType, setTriggerType] = useState<"manual" | "cron">("manual");
  const [cronSchedule, setCronSchedule] = useState("0 6 * * *");
  const [confirmBackOpen, setConfirmBackOpen] = useState(false);
  const [deleteConfirmNodeId, setDeleteConfirmNodeId] = useState<string | null>(
    null,
  );
  const [indicatorSearch, setIndicatorSearch] = useState("");

  const graphId = form?.getValues("id") ?? "";

  // ── Load parent graph ──
  const parentOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { id: graphId },
        queryOptions: {
          enabled: !!graphId,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000,
        },
      },
      create: { urlPathParams: { id: graphId } },
    }),
    [graphId],
  );

  const parentEndpoint = useEndpoint(
    parentDefinitions,
    parentOptions,
    logger,
    user,
  );

  const parentGraph = parentEndpoint.read?.data?.graph;

  const graphConfig = useMemo<GraphConfig>(
    () =>
      parentGraph?.config ?? {
        nodes: {},
        edges: [],
        trigger: { type: "manual" },
      },
    [parentGraph?.config],
  );

  // Current mutable graph config (tracks node additions/deletions)
  const [workingNodes, setWorkingNodes] = useState<
    Record<string, GraphNodeConfig>
  >({});

  const isLoading = parentEndpoint.read?.isLoading ?? true;

  // ── Load registry ──
  const registryOptions = useMemo(
    () => ({
      read: {
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
          staleTime: 10 * 60 * 1000,
        },
      },
    }),
    [],
  );

  const registryEndpoint = useEndpoint(
    registryDefinitions,
    registryOptions,
    logger,
    user,
  );
  const indicators: RegistryIndicator[] =
    registryEndpoint.read?.data?.indicators ?? [];

  // Pre-fill when parent data loads
  useEffect(() => {
    if (parentGraph) {
      setName(parentGraph.name);
      setDescription(parentGraph.description ?? "");
      setWorkingNodes(parentGraph.config.nodes);
      if (parentGraph.config.trigger.type === "cron") {
        setTriggerType("cron");
        setCronSchedule(parentGraph.config.trigger.schedule);
      }
    }
  }, [parentGraph]);

  // ── React Flow state ──
  const initial = useMemo(() => configToFlow(graphConfig), [graphConfig]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);

  useEffect(() => {
    if (!isLoading) {
      const flow = configToFlow(graphConfig);
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setTimeout((): void => {
        reactFlow.fitView({ padding: 0.2 });
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync after load
  }, [graphConfig, isLoading]);

  // Get the selected node config
  const selectedNodeConfig = selectedNodeId
    ? workingNodes[selectedNodeId]
    : null;

  // ── Handlers ──
  const handleNodesChange = useCallback<OnNodesChange<VibeNode>>(
    (changes) => {
      onNodesChange(changes);
      if (changes.some((c) => c.type === "position")) {
        setDirty(true);
      }
      // Track selection
      for (const change of changes) {
        if (change.type === "select" && change.selected) {
          setSelectedNodeId(change.id);
        }
      }
    },
    [onNodesChange],
  );

  const handleEdgesChange = useCallback<OnEdgesChange<VibeEdge>>(
    (changes) => {
      onEdgesChange(changes);
      if (changes.some((c) => c.type === "remove")) {
        setDirty(true);
      }
    },
    [onEdgesChange],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
      setDirty(true);
    },
    [setEdges],
  );

  // ── Add node from palette ──
  const addNode = useCallback(
    (nodeConfig: GraphNodeConfig, nodeId: string) => {
      const viewport = reactFlow.getViewport();
      const centerX = (-viewport.x + 400) / viewport.zoom;
      const centerY = (-viewport.y + 250) / viewport.zoom;

      const newNode: VibeNode = {
        id: nodeId,
        type: "vibeNode",
        position: { x: centerX, y: centerY },
        data: { nodeId, nodeConfig, label: getNodeDetail(nodeConfig) },
      };

      setNodes((nds) => [...nds, newNode]);
      setWorkingNodes((prev) => ({ ...prev, [nodeId]: nodeConfig }));
      setSelectedNodeId(nodeId);
      setDirty(true);
    },
    [reactFlow, setNodes],
  );

  const addIndicatorNode = useCallback(
    (indicatorId: string) => {
      const nodeId = generateNodeId(
        indicatorId.replace(/\./g, "_"),
        workingNodes,
      );
      addNode({ type: "indicator", indicatorId }, nodeId);
    },
    [addNode, workingNodes],
  );

  const addEndpointNode = useCallback(
    (endpointId: string, method: "GET" | "POST") => {
      const nodeId = generateNodeId(
        endpointId.replace(/\./g, "_"),
        workingNodes,
      );
      const config: EndpointNodeConfig = {
        type: "endpoint",
        id: nodeId,
        endpointId,
        method,
        inputMapping: {},
      };
      addNode(config, nodeId);
    },
    [addNode, workingNodes],
  );

  const addTransformerNode = useCallback(
    (fn: TransformerFn) => {
      const nodeId = generateNodeId(fn, workingNodes);
      const config: TransformerNodeConfig = {
        type: "transformer",
        id: nodeId,
        inputs: [],
        fn,
      };
      addNode(config, nodeId);
    },
    [addNode, workingNodes],
  );

  const addEvaluatorNode = useCallback(
    (evaluatorType: EvaluatorType) => {
      const nodeId = generateNodeId(`eval_${evaluatorType}`, workingNodes);
      let args: EvaluatorArgs | undefined;
      if (evaluatorType === "threshold") {
        args = { type: "threshold", op: ">", value: 0 };
      } else if (evaluatorType === "crossover") {
        args = { type: "crossover" };
      }
      const config: EvaluatorNodeConfig = {
        type: "evaluator",
        id: nodeId,
        inputs: [],
        inputCount:
          evaluatorType === "and" || evaluatorType === "or"
            ? "variadic"
            : evaluatorType === "not"
              ? 1
              : 2,
        evaluatorType,
        resolution: GraphResolution.ONE_DAY,
        args,
      };
      addNode(config, nodeId);
    },
    [addNode, workingNodes],
  );

  // ── Update node config from inspector ──
  const updateNodeConfig = useCallback(
    (nodeId: string, updated: GraphNodeConfig) => {
      setWorkingNodes((prev) => ({ ...prev, [nodeId]: updated }));
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  nodeConfig: updated,
                  label: getNodeDetail(updated),
                },
              }
            : n,
        ),
      );
      setDirty(true);
    },
    [setNodes],
  );

  // ── Delete node ──
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId),
      );
      setWorkingNodes((prev) => {
        const next = { ...prev };
        delete next[nodeId];
        return next;
      });
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
      setDirty(true);
    },
    [setNodes, setEdges, selectedNodeId],
  );

  const handleBack = useCallback((): void => {
    if (dirty) {
      setConfirmBackOpen(true);
      return;
    }
    if (navigation.canGoBack) {
      navigation.pop();
    }
  }, [navigation, dirty]);

  const handleConfirmLeave = useCallback((): void => {
    setConfirmBackOpen(false);
    if (navigation.canGoBack) {
      navigation.pop();
    }
  }, [navigation]);

  // ── Sync form values before submit ──
  const syncFormValues = useCallback((): void => {
    if (!form) {
      return;
    }
    const configWithWorkingNodes: GraphConfig = {
      ...graphConfig,
      nodes: workingNodes,
    };
    const newConfig = flowToConfig(configWithWorkingNodes, nodes, edges);
    const trigger: TriggerConfig =
      triggerType === "cron"
        ? { type: "cron", schedule: cronSchedule }
        : { type: "manual" };
    newConfig.trigger = trigger;
    form.setValue("name", name || undefined);
    form.setValue("description", description || undefined);
    form.setValue("config", newConfig);
  }, [
    form,
    nodes,
    edges,
    graphConfig,
    workingNodes,
    name,
    description,
    triggerType,
    cronSchedule,
  ]);

  // ── Render ──
  if (isLoading) {
    return (
      <Div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  return (
    <Div className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
      {/* Unsaved changes dialog */}
      <Dialog open={confirmBackOpen} onOpenChange={setConfirmBackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("widget.confirmBackTitle")}</DialogTitle>
          </DialogHeader>
          <P className="text-sm text-muted-foreground">
            {t("widget.confirmBackDescription")}
          </P>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmBackOpen(false)}>
              {t("widget.confirmBackStay")}
            </Button>
            <Button variant="destructive" onClick={handleConfirmLeave}>
              {t("widget.confirmBackLeave")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Top Toolbar */}
      <Div className="flex items-center gap-2 px-3 py-1.5 border-b bg-background shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-1 h-7"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("widget.back")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPaletteOpen(!paletteOpen)}
          className="h-7 w-7 p-0"
        >
          {paletteOpen ? (
            <PanelLeftClose className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          )}
        </Button>
        <Div className="flex-1" />
        {dirty && (
          <Badge
            variant="outline"
            className="text-[10px] text-orange-500 border-orange-300"
          >
            {t("widget.unsaved")}
          </Badge>
        )}
        <Badge variant="outline" className="text-[10px]">
          {String(Object.keys(workingNodes).length)} {t("widget.nodes")}
        </Badge>
        <Button
          type="submit"
          variant="default"
          size="sm"
          onClick={syncFormValues}
          className="gap-1 h-7"
        >
          <Save className="h-3.5 w-3.5" />
          {t("widget.save")}
        </Button>
      </Div>

      {/* Three-panel layout */}
      <Div className="flex flex-1 min-h-0">
        {/* Left Sidebar — Node Palette */}
        {paletteOpen && (
          <Div className="w-52 border-r bg-muted/10 overflow-y-auto shrink-0">
            <PaletteSection
              title={t("widget.palette.indicators")}
              badge={NODE_COLORS.indicator?.badge ?? ""}
              defaultOpen
            >
              {/* Search input */}
              <Input
                value={indicatorSearch}
                onChangeText={setIndicatorSearch}
                className="h-6 text-[10px] mb-1"
                placeholder={t("widget.palette.searchPlaceholder")}
              />
              {(registryEndpoint.read?.isLoading ?? false) ? (
                <P className="text-[10px] text-muted-foreground px-2">
                  {t("widget.palette.loadingIndicators")}
                </P>
              ) : indicators.length === 0 ? (
                <P className="text-[10px] text-muted-foreground px-2">
                  {t("widget.palette.noIndicators")}
                </P>
              ) : (
                indicators
                  .filter((ind) =>
                    ind.id
                      .toLowerCase()
                      .includes(indicatorSearch.toLowerCase()),
                  )
                  .map((ind) => (
                    <PaletteItem
                      key={ind.id}
                      label={ind.id}
                      detail={`${ind.resolution} · ${ind.persist}`}
                      onClick={() => addIndicatorNode(ind.id)}
                    />
                  ))
              )}
            </PaletteSection>

            <PaletteSection
              title={t("widget.palette.endpoints")}
              badge={NODE_COLORS.endpoint?.badge ?? ""}
              defaultOpen={false}
            >
              <PaletteItem
                label={t("widget.customEndpoint")}
                detail={t("widget.customEndpointDesc")}
                onClick={() => addEndpointNode("custom", "GET")}
              />
            </PaletteSection>

            <PaletteSection
              title={t("widget.palette.transformers")}
              badge={NODE_COLORS.transformer?.badge ?? ""}
              defaultOpen={false}
            >
              {TRANSFORMER_VALUES.map((val) => (
                <PaletteItem
                  key={val}
                  label={t(TRANSFORMER_I18N_KEYS[val])}
                  detail={val}
                  onClick={() => addTransformerNode(val)}
                />
              ))}
            </PaletteSection>

            <PaletteSection
              title={t("widget.palette.evaluators")}
              badge={NODE_COLORS.evaluator?.badge ?? ""}
              defaultOpen={false}
            >
              {EVALUATOR_VALUES.map((val) => (
                <PaletteItem
                  key={val}
                  label={t(EVALUATOR_I18N_KEYS[val])}
                  detail={val}
                  onClick={() => addEvaluatorNode(val)}
                />
              ))}
            </PaletteSection>
          </Div>
        )}

        {/* Center — React Flow Canvas */}
        <Div className="flex-1 min-w-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            colorMode="system"
            deleteKeyCode="Delete"
            style={{ width: "100%", height: "100%" }}
            onPaneClick={() => setSelectedNodeId(null)}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Div>

        {/* Right Panel — Node Inspector */}
        {selectedNodeConfig && selectedNodeId && (
          <Card className="w-60 border-l border-t-0 border-b-0 border-r-0 rounded-none p-3 overflow-y-auto shrink-0">
            <NodeInspector
              nodeId={selectedNodeId}
              nodeConfig={selectedNodeConfig}
              graphConfig={{ ...graphConfig, nodes: workingNodes }}
              onUpdate={updateNodeConfig}
              onDelete={deleteNode}
              onClose={() => setSelectedNodeId(null)}
              t={t}
              deleteConfirmNodeId={deleteConfirmNodeId}
              setDeleteConfirmNodeId={setDeleteConfirmNodeId}
            />
          </Card>
        )}
      </Div>

      {/* Bottom Bar — Name, Description, Trigger, Save */}
      <Div className="flex flex-wrap items-center gap-3 px-3 py-2 border-t bg-muted/20 shrink-0">
        <Div className="flex items-center gap-1.5 flex-1">
          <Label className="text-xs shrink-0">{t("widget.nameLabel")}</Label>
          <Input
            value={name}
            onChangeText={(v) => {
              setName(v);
              setDirty(true);
            }}
            className="h-8 text-xs min-w-[120px] flex-1"
            placeholder={t("widget.namePlaceholder")}
          />
        </Div>
        <Div className="flex items-center gap-1.5 flex-1">
          <Label className="text-xs shrink-0">
            {t("widget.descriptionLabel")}
          </Label>
          <Input
            value={description}
            onChangeText={(v) => {
              setDescription(v);
              setDirty(true);
            }}
            className="h-8 text-xs min-w-[120px] flex-1"
            placeholder={t("widget.descriptionPlaceholder")}
          />
        </Div>
        <Div className="flex flex-col gap-0.5">
          <Div className="flex items-center gap-1.5">
            <Label className="text-xs shrink-0">{t("widget.trigger")}</Label>
            <Select<TriggerType>
              value={triggerType}
              onValueChange={(v) => {
                setTriggerType(v);
                setDirty(true);
              }}
            >
              <SelectTrigger className="h-8 text-xs w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">
                  {t("widget.triggerManual")}
                </SelectItem>
                <SelectItem value="cron">{t("widget.triggerCron")}</SelectItem>
              </SelectContent>
            </Select>
            {triggerType === "cron" && (
              <Input
                value={cronSchedule}
                onChangeText={(v) => {
                  setCronSchedule(v);
                  setDirty(true);
                }}
                className={`h-8 text-xs w-32 font-mono ${!isValidCron(cronSchedule) ? "border-destructive" : ""}`}
                placeholder="0 6 * * *"
              />
            )}
          </Div>
          {triggerType === "cron" && !isValidCron(cronSchedule) && (
            <P className="text-[10px] text-destructive">
              {t("widget.cronInvalid")}
            </P>
          )}
        </Div>
      </Div>
    </Div>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export function EditGraphWidget(props: CustomWidgetProps): React.JSX.Element {
  void props;
  return (
    <ReactFlowProvider>
      <EditFormInner />
    </ReactFlowProvider>
  );
}
