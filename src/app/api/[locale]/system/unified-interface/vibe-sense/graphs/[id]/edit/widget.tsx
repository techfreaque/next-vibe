/**
 * Vibe Sense — Edit Graph Widget
 *
 * Three-panel React Flow builder:
 *   Left sidebar  — Node Palette (endpoints grouped by category)
 *   Center        — React Flow canvas (drag, connect, position)
 *   Right panel   — Unified Node Inspector OR Graph Settings
 *   Top bar       — Back, palette toggle, unsaved badge, node count, Save
 *
 * Every node is an endpoint. No node type system.
 * Creates a new version (branch) on save — never mutates.
 */

"use client";

import "@xyflow/react/dist/style.css";

import {
  addEdge,
  Background,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  getBezierPath,
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
  type EdgeProps,
  type EdgeTypes,
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
import { Div, type DivDragEvent } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { History } from "next-vibe-ui/ui/icons/History";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Activity } from "next-vibe-ui/ui/icons/Activity";
import { Database } from "next-vibe-ui/ui/icons/Database";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { PanelLeftClose } from "next-vibe-ui/ui/icons/PanelLeftClose";
import { PanelLeftOpen } from "next-vibe-ui/ui/icons/PanelLeftOpen";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { Trash } from "next-vibe-ui/ui/icons/Trash";
import { Wrench } from "next-vibe-ui/ui/icons/Wrench";
import { X } from "next-vibe-ui/ui/icons/X";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type {
  GraphConfig,
  GraphEdge,
  NodePosition,
  TriggerConfig,
} from "../../../graph/types";
import { GraphResolution } from "../../../enum";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { ResolutionValues } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

import { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { pathToAliasMap } from "@/app/api/[locale]/system/generated/alias-map";
import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import { endpointsMeta } from "@/app/api/[locale]/system/generated/endpoints-meta/en";

import parentDefinitions from "../data/definition";
import versionsDefinitions from "../versions/definition";
import type definition from "./definition";
import type { GraphNodeConfig } from "../../../graph/schema";

// ─── Endpoint Node Info ──────────────────────────────────────────────────────

interface HandleInfo {
  inputs: string[];
  outputs: string[];
}

type NodeCategory =
  | "data-source"
  | "indicator"
  | "transformer"
  | "evaluator"
  | "other";

interface EndpointNodeInfo {
  handles: HandleInfo;
  category: NodeCategory;
}

const DEFAULT_HANDLES: HandleInfo = { inputs: ["source"], outputs: ["result"] };
const DEFAULT_INFO: EndpointNodeInfo = {
  handles: DEFAULT_HANDLES,
  category: "other",
};

/**
 * Extract TIME_SERIES handles from an endpoint definition's field tree.
 * Input handles = TIME_SERIES fields with request usage.
 * Output handles = TIME_SERIES fields with response usage.
 */
function extractHandles(
  fields: Record<
    string,
    {
      fieldType?: FieldDataType;
      usage?: { request?: string; response?: boolean };
    }
  >,
): HandleInfo {
  const inputs: string[] = [];
  const outputs: string[] = [];

  let hasAnyResponseField = false;
  for (const [name, field] of Object.entries(fields)) {
    const usage = field.usage;
    if (usage?.response === true) {
      hasAnyResponseField = true;
    }
    if (field.fieldType !== FieldDataType.TIME_SERIES) {
      continue;
    }
    if (!usage) {
      continue;
    }
    if (usage.request === "data" || usage.request === "data&urlPathParams") {
      inputs.push(name);
    }
    if (usage.response === true) {
      outputs.push(name);
    }
  }

  if (inputs.length === 0 && outputs.length === 0) {
    return DEFAULT_HANDLES;
  }
  // If there are inputs but no TIME_SERIES outputs (e.g. evaluators with custom response),
  // add a generic "result" output so the node can be an edge source.
  if (outputs.length === 0 && hasAnyResponseField) {
    outputs.push("result");
  }
  return { inputs, outputs };
}

/** Infer category from the endpoint path (alias or route path segments) */
function categoryFromEndpoint(endpointPath: string): NodeCategory {
  const lower = endpointPath.toLowerCase();
  if (lower.includes("data-source") || lower.includes("datasource")) {
    return "data-source";
  }
  if (lower.includes("evaluator")) {
    return "evaluator";
  }
  if (lower.includes("transformer")) {
    return "transformer";
  }
  if (lower.includes("indicator")) {
    return "indicator";
  }
  return "other";
}

/**
 * Hook: loads handle info + category for all unique endpoint paths in the graph.
 * Returns a Map<endpointPath, EndpointNodeInfo>.
 */
function useEndpointNodeInfo(
  endpointPaths: string[],
): Map<string, EndpointNodeInfo> {
  const [infoMap, setInfoMap] = useState<Map<string, EndpointNodeInfo>>(
    new Map(),
  );

  useEffect(() => {
    const uniquePaths = [...new Set(endpointPaths)];
    let cancelled = false;

    const load = async (): Promise<void> => {
      const results = await Promise.all(
        uniquePaths.map(async (path) => {
          const endpoint = await getEndpoint(path);
          if (!endpoint) {
            return { path, info: DEFAULT_INFO };
          }
          // Follow codebase pattern: "children" in endpoint.fields
          const children =
            "children" in endpoint.fields
              ? (endpoint.fields.children as Record<
                  string,
                  {
                    fieldType?: FieldDataType;
                    usage?: { request?: string; response?: boolean };
                  }
                >)
              : undefined;
          const handles = children ? extractHandles(children) : DEFAULT_HANDLES;
          const endpointCategory = categoryFromEndpoint(path);
          return { path, info: { handles, category: endpointCategory } };
        }),
      );
      if (cancelled) {
        return;
      }
      const next = new Map<string, EndpointNodeInfo>();
      for (const { path, info } of results) {
        next.set(path, info);
      }
      setInfoMap(next);
    };
    void load();

    return (): void => {
      cancelled = true;
    };
  }, [endpointPaths.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return infoMap;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatResolution(resolution: Resolution): string {
  // Resolution enum values are i18n keys like "enums.resolution.1d"
  // Strip the prefix and uppercase for display
  const short = resolution.replace("enums.resolution.", "");
  return short.toUpperCase();
}

function isValidCron(cron: string): boolean {
  return /^(\S+\s){4}\S+$/.test(cron.trim());
}

// ─── Visual tokens per category ──────────────────────────────────────────────

interface NodeVisuals {
  badge: string;
  border: string;
  header: string;
  icon: React.ReactNode;
}

const CATEGORY_VISUALS: Record<NodeCategory, NodeVisuals> = {
  "data-source": {
    badge: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    border: "border-sky-400/70 dark:border-sky-600/70",
    header: "bg-sky-500/10 border-b border-sky-500/20",
    icon: <Database className="h-3 w-3" />,
  },
  indicator: {
    badge:
      "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    border: "border-violet-400/70 dark:border-violet-600/70",
    header: "bg-violet-500/10 border-b border-violet-500/20",
    icon: <Activity className="h-3 w-3" />,
  },
  transformer: {
    badge:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    border: "border-purple-400/70 dark:border-purple-600/70",
    header: "bg-purple-500/10 border-b border-purple-500/20",
    icon: <Wrench className="h-3 w-3" />,
  },
  evaluator: {
    badge:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    border: "border-orange-400/70 dark:border-orange-600/70",
    header: "bg-orange-500/10 border-b border-orange-500/20",
    icon: <Zap className="h-3 w-3" />,
  },
  other: {
    badge:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    border: "border-green-400/70 dark:border-green-600/70",
    header: "bg-green-500/10 border-b border-green-500/20",
    icon: <Globe className="h-3 w-3" />,
  },
};

const PALETTE_BADGE = "bg-muted text-muted-foreground";

function getVisuals(category: NodeCategory): NodeVisuals {
  return CATEGORY_VISUALS[category];
}

// ─── Display-override helper ──────────────────────────────────────────────────

interface DisplayOverride {
  color?: string;
  pane?: number;
}

function withDisplayOverride(
  node: GraphNodeConfig,
  override: DisplayOverride,
): GraphNodeConfig {
  return { ...node, ...override };
}

// ─── Layout helpers ─────────────────────────────────────────────────────────

function autoLayout(
  nodes: Record<string, GraphNodeConfig>,
): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};
  const ids = Object.keys(nodes);
  const cols = Math.max(1, Math.ceil(Math.sqrt(ids.length)));
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (id !== undefined) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      positions[id] = { x: col * 300, y: row * 140 };
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

// ─── Types ───────────────────────────────────────────────────────────────────

type TriggerType = "manual" | "cron";

type EditResponseOutput = typeof definition.PUT.types.ResponseOutput;

interface VibeNodeData {
  nodeId: string;
  nodeConfig: GraphConfig["nodes"][string];
  label: string;
  handles: HandleInfo;
  category: NodeCategory;
  selected?: boolean;
  [key: string]:
    | string
    | GraphConfig["nodes"][string]
    | HandleInfo
    | NodeCategory
    | boolean
    | undefined;
}

type VibeNode = Node<VibeNodeData>;
type VibeEdge = Edge;

interface CustomWidgetProps {
  field: {
    value: EditResponseOutput | null | undefined;
  } & (typeof definition.PUT)["fields"];
}

// ─── Config ↔ Flow ──────────────────────────────────────────────────────────

function configToFlow(
  config: GraphConfig,
  infoMap: Map<string, EndpointNodeInfo>,
): {
  nodes: VibeNode[];
  edges: VibeEdge[];
} {
  const positions =
    config.positions && Object.keys(config.positions).length > 0
      ? config.positions
      : autoLayout(config.nodes);

  const nodes: VibeNode[] = Object.entries(config.nodes).map(
    ([nodeId, nodeConfig]) => {
      const info = infoMap.get(nodeConfig.endpointPath) ?? DEFAULT_INFO;
      return {
        id: nodeId,
        type: "vibeNode",
        position: positions[nodeId] ?? { x: 0, y: 0 },
        data: {
          nodeId,
          nodeConfig,
          label: nodeConfig.endpointPath,
          handles: info.handles,
          category: info.category,
        },
      };
    },
  );

  const edges: VibeEdge[] = config.edges.map((e, idx) => {
    // Resolve missing handle IDs — when there's a single handle, auto-assign it
    // so React Flow can find the handle even if the graph config omits fromHandle/toHandle.
    let sourceHandle: string | null = e.fromHandle ?? null;
    let targetHandle: string | null = e.toHandle ?? null;

    if (!sourceHandle) {
      const srcNode = config.nodes[e.from];
      const srcInfo = srcNode ? infoMap.get(srcNode.endpointPath) : undefined;
      if (srcInfo && srcInfo.handles.outputs.length === 1) {
        sourceHandle = srcInfo.handles.outputs[0];
      }
    }
    if (!targetHandle) {
      const tgtNode = config.nodes[e.to];
      const tgtInfo = tgtNode ? infoMap.get(tgtNode.endpointPath) : undefined;
      if (tgtInfo && tgtInfo.handles.inputs.length === 1) {
        targetHandle = tgtInfo.handles.inputs[0];
      }
    }

    return {
      id: `${e.from}->${e.to}-${String(idx)}`,
      source: e.from,
      target: e.to,
      sourceHandle,
      targetHandle,
      animated: true,
      style: {
        strokeDasharray: "4 2",
        stroke: "hsl(var(--primary))",
        opacity: 0.7,
      },
    };
  });

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
    nodes: { ...original.nodes, ...nodeConfigs } as GraphConfig["nodes"],
    edges: graphEdges,
    positions,
  };
}

// ─── Custom Node Card ─────────────────────────────────────────────────────────

const VibeNodeCard = React.memo(function VibeNodeCard({
  data,
}: NodeProps<VibeNode>): React.JSX.Element {
  const { category, handles } = data;
  const visuals = getVisuals(category);
  const isSelected = data.selected === true;
  const resolution = data.nodeConfig.resolution;
  const { inputs, outputs } = handles;

  return (
    <Div
      className={cn(
        "rounded-xl border-2 bg-card shadow-sm min-w-[190px] max-w-[270px] overflow-hidden transition-shadow",
        visuals.border,
        isSelected
          ? "shadow-lg ring-2 ring-primary/50 ring-offset-1 ring-offset-background"
          : "hover:shadow-md",
      )}
    >
      {/* Colored header strip with category icon + label */}
      <Div
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5",
          visuals.header,
        )}
      >
        <Div
          className={cn(
            "flex-shrink-0",
            visuals.badge.split(" ").slice(2).join(" "),
          )}
        >
          {visuals.icon}
        </Div>
        <Badge
          variant="secondary"
          className={cn("text-[9px] px-1 py-0 leading-none h-4", visuals.badge)}
        >
          {category}
        </Badge>
        {resolution && (
          <Badge
            variant="outline"
            className="text-[9px] px-1 py-0 leading-none h-4 ml-auto"
          >
            {formatResolution(resolution)}
          </Badge>
        )}
      </Div>

      {/* Body with handles */}
      <Div className="relative px-2.5 py-2">
        <P className="text-xs font-mono font-semibold truncate text-foreground leading-tight">
          {data.nodeId}
        </P>
        <P className="text-[10px] text-muted-foreground truncate mt-0.5 leading-tight">
          {data.label}
        </P>

        {/* Handle labels */}
        {(inputs.length > 1 || outputs.length > 1) && (
          <Div className="flex justify-between mt-1.5 gap-2">
            <Div className="flex flex-col gap-0.5">
              {inputs.map((name) => (
                <P
                  key={name}
                  className="text-[8px] font-mono text-muted-foreground leading-tight"
                >
                  {name}
                </P>
              ))}
            </Div>
            <Div className="flex flex-col gap-0.5 items-end">
              {outputs.map((name) => (
                <P
                  key={name}
                  className="text-[8px] font-mono text-muted-foreground leading-tight"
                >
                  {name}
                </P>
              ))}
            </Div>
          </Div>
        )}
      </Div>

      {/* Input handles (left edge) */}
      {inputs.map((name, idx) => (
        <Handle
          key={`in-${name}`}
          id={name}
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-primary/60 !border-2 !border-background !rounded-full"
          style={{
            top: `${String(((idx + 1) / (inputs.length + 1)) * 100)}%`,
          }}
        />
      ))}

      {/* Output handles (right edge) */}
      {outputs.map((name, idx) => (
        <Handle
          key={`out-${name}`}
          id={name}
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-primary/60 !border-2 !border-background !rounded-full"
          style={{
            top: `${String(((idx + 1) / (outputs.length + 1)) * 100)}%`,
          }}
        />
      ))}
    </Div>
  );
});

const nodeTypes: NodeTypes = { vibeNode: VibeNodeCard };

// ─── Custom Edge with Delete Button ──────────────────────────────────────────

/** Module-level ref so the edge component can signal dirty state back to the form */
let edgeDirtyCallback: (() => void) | null = null;

function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  selected,
}: EdgeProps): React.JSX.Element {
  const reactFlowInstance = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onDeleteEdge = useCallback(() => {
    reactFlowInstance.setEdges((eds) => eds.filter((e) => e.id !== id));
    edgeDirtyCallback?.();
  }, [id, reactFlowInstance]);

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {selected && (
        <EdgeLabelRenderer>
          <Div
            onClick={onDeleteEdge}
            style={{
              transform: `translate(-50%, -50%) translate(${String(labelX)}px,${String(labelY)}px)`,
              position: "absolute",
              pointerEvents: "all",
              cursor: "pointer",
              width: 20,
              height: 20,
              borderRadius: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "hsl(var(--destructive))",
              color: "hsl(var(--destructive-foreground))",
            }}
          >
            <X className="h-3 w-3" />
          </Div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const edgeTypes: EdgeTypes = { default: DeletableEdge };

// ─── Palette Section ──────────────────────────────────────────────────────────

const PaletteSection = React.memo(function PaletteSection({
  title,
  badge,
  icon,
  children,
  defaultOpen,
}: {
  title: string;
  badge: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}): React.JSX.Element {
  const [open, setOpen] = useState(defaultOpen ?? true);

  return (
    <Div className="border-b border-border/40">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="w-full justify-between px-3 py-2 h-auto text-xs font-medium hover:bg-accent/50"
      >
        <Div className="flex items-center gap-2">
          <Div
            className={cn("flex-shrink-0", badge.split(" ").slice(2).join(" "))}
          >
            {icon}
          </Div>
          <Span className="font-semibold text-[11px] uppercase tracking-wide text-muted-foreground">
            {title}
          </Span>
        </Div>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
      </Button>
      {open && (
        <Div className="px-2 pb-2 flex flex-col gap-0.5">{children}</Div>
      )}
    </Div>
  );
});

const PaletteItem = React.memo(function PaletteItem({
  label,
  detail,
  domain,
  alias,
  onClick,
}: {
  label: string;
  detail: string;
  domain?: string;
  alias: string;
  onClick: () => void;
}): React.JSX.Element {
  const onDragStartCb = useCallback(
    (e: DivDragEvent) => {
      e.dataTransfer.setData("application/vibe-node", alias);
      e.dataTransfer.effectAllowed = "move";
    },
    [alias],
  );

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      draggable
      onDragStart={onDragStartCb}
      className="w-full justify-start h-auto py-1.5 px-2 text-left hover:bg-accent rounded-md cursor-grab active:cursor-grabbing group"
    >
      <Div className="flex flex-col gap-0 min-w-0 w-full">
        <Div className="flex items-center gap-1 min-w-0">
          {domain && (
            <Span className="text-[9px] font-mono text-primary/70 shrink-0">
              {domain}.
            </Span>
          )}
          <P className="text-[11px] font-medium truncate group-hover:text-foreground">
            {domain ? label.replace(`${domain}.`, "") : label}
          </P>
        </Div>
        {detail && (
          <P className="text-[9px] text-muted-foreground truncate">{detail}</P>
        )}
      </Div>
    </Button>
  );
});

// ─── Inspector shared components ──────────────────────────────────────────────

type TFn = (
  key: (typeof definition.PUT)["scopedTranslation"]["ScopedTranslationKey"],
) => string;

function InspectorSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div>
      <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </P>
      {children}
    </Div>
  );
}

function InspectorField({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2">
      <Label className="text-[10px] w-14 shrink-0 text-muted-foreground">
        {label}
      </Label>
      <P className="text-[10px] font-mono text-muted-foreground truncate">
        {value}
      </P>
    </Div>
  );
}

// ─── Unified Node Inspector ──────────────────────────────────────────────────

const NodeInspector = React.memo(function NodeInspector({
  nodeId,
  nodeConfig,
  category,
  onUpdate,
  onDelete,
  onClose,
  onOpenEndpoint,
  t,
  deleteConfirmNodeId,
  setDeleteConfirmNodeId,
}: {
  nodeId: string;
  nodeConfig: GraphNodeConfig;
  category: NodeCategory;
  onUpdate: (nodeId: string, updated: GraphNodeConfig) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
  onOpenEndpoint: (endpointId: string) => void;
  t: TFn;
  deleteConfirmNodeId: string | null;
  setDeleteConfirmNodeId: (id: string | null) => void;
}): React.JSX.Element {
  const visuals = getVisuals(category);
  const isConfirmingDelete = deleteConfirmNodeId === nodeId;

  return (
    <Div className="flex flex-col gap-0 h-full">
      {/* Header */}
      <Div
        className={cn(
          "flex items-center justify-between px-3 py-2 border-b",
          visuals.header,
        )}
      >
        <Div className="flex items-center gap-1.5 min-w-0">
          <Div
            className={cn(
              "flex-shrink-0",
              visuals.badge.split(" ").slice(2).join(" "),
            )}
          >
            {visuals.icon}
          </Div>
          <Badge
            variant="secondary"
            className={cn("text-[9px] px-1 py-0 shrink-0", visuals.badge)}
          >
            {category}
          </Badge>
          <P className="text-[11px] font-mono font-semibold truncate text-foreground ml-0.5">
            {nodeId}
          </P>
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

      {/* Body */}
      <Div className="flex flex-col gap-3 p-3 overflow-y-auto flex-1">
        {/* Endpoint info */}
        <InspectorSection label={t("widget.inspector.endpoint")}>
          <Div className="flex flex-col gap-1.5">
            <InspectorField
              label={t("widget.inspector.endpoint")}
              value={nodeConfig.endpointPath}
            />
            <InspectorField
              label={t("widget.inspector.method")}
              value={nodeConfig.method ?? "POST"}
            />
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px] w-full gap-1"
              onClick={() => onOpenEndpoint(nodeConfig.endpointPath)}
            >
              <Globe className="h-2.5 w-2.5" />
              {t("widget.inspector.openEndpoint")}
            </Button>
          </Div>
        </InspectorSection>

        {/* Resolution */}
        <InspectorSection label={t("widget.inspector.resolution")}>
          <Select<Resolution>
            value={nodeConfig.resolution ?? GraphResolution.ONE_DAY}
            onValueChange={(r) => {
              onUpdate(nodeId, { ...nodeConfig, resolution: r });
            }}
          >
            <SelectTrigger className="h-7 text-[11px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ResolutionValues.map((r) => (
                <SelectItem key={r} value={r}>
                  {formatResolution(r)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InspectorSection>

        {/* Lookback */}
        <InspectorSection label={t("widget.inspector.lookback")}>
          <Input
            value={String(nodeConfig.lookback ?? 0)}
            onChangeText={(v) => {
              const num = parseInt(v, 10);
              onUpdate(nodeId, {
                ...nodeConfig,
                lookback: isNaN(num) ? 0 : num,
              });
            }}
            className="h-7 text-[11px] font-mono"
            placeholder="0"
          />
        </InspectorSection>

        {/* Output field */}
        <InspectorSection label={t("widget.inspector.output")}>
          <Input
            value={nodeConfig.outputField ?? "result"}
            onChangeText={(v) => {
              onUpdate(nodeId, {
                ...nodeConfig,
                outputField: v === "result" ? undefined : v || undefined,
              });
            }}
            className="h-7 text-[11px] font-mono"
            placeholder="result"
          />
        </InspectorSection>

        {/* Persist */}
        <InspectorSection label={t("widget.inspector.persist")}>
          <Div className="flex items-center gap-0.5 border rounded-md overflow-hidden bg-muted/30">
            {(["always", "never", "snapshot"] as const).map((mode) => (
              <Button
                key={mode}
                variant="ghost"
                size="sm"
                onClick={() =>
                  onUpdate(nodeId, { ...nodeConfig, persist: mode })
                }
                className={cn(
                  "h-6 flex-1 text-[10px] rounded-none border-0 px-1",
                  (nodeConfig.persist ?? "always") === mode
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {mode}
              </Button>
            ))}
          </Div>
        </InspectorSection>

        {/* Parameters */}
        <InspectorSection label={t("widget.inspector.params")}>
          <Div className="flex flex-col gap-2">
            {Object.entries(nodeConfig.params ?? {}).map(([field, value]) => (
              <Div key={field} className="rounded-lg border bg-muted/20 p-2">
                <Div className="flex items-center justify-between mb-1.5">
                  <P className="text-[10px] font-mono font-semibold text-foreground">
                    {field}
                  </P>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => {
                      const newParams = {
                        ...(nodeConfig.params ?? {}),
                      };
                      delete newParams[field];
                      onUpdate(nodeId, {
                        ...nodeConfig,
                        params:
                          Object.keys(newParams).length > 0
                            ? newParams
                            : undefined,
                      });
                    }}
                  >
                    <X className="h-2.5 w-2.5 text-muted-foreground" />
                  </Button>
                </Div>
                <Input
                  value={value !== null ? String(value) : ""}
                  onChangeText={(v) => {
                    const parsed = Number(v);
                    const typed: string | number | boolean | null =
                      v === "true"
                        ? true
                        : v === "false"
                          ? false
                          : v === ""
                            ? null
                            : !isNaN(parsed) && v.trim() !== ""
                              ? parsed
                              : v;
                    onUpdate(nodeId, {
                      ...nodeConfig,
                      params: {
                        ...(nodeConfig.params ?? {}),
                        [field]: typed,
                      },
                    });
                  }}
                  className="h-6 text-[10px]"
                  placeholder="value"
                />
              </Div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px] w-full border-dashed"
              onClick={() => {
                const newParams = { ...(nodeConfig.params ?? {}) };
                const fieldName = `param_${String(
                  Object.keys(newParams).length + 1,
                )}`;
                newParams[fieldName] = "";
                onUpdate(nodeId, {
                  ...nodeConfig,
                  params: newParams,
                });
              }}
            >
              {t("widget.addField")}
            </Button>
          </Div>
        </InspectorSection>

        {/* Display options */}
        <InspectorSection label={t("widget.inspector.display")}>
          <Div className="flex flex-col gap-2">
            {/* Color picker */}
            <Div className="flex items-center gap-2">
              <Label className="text-[11px] w-14 text-muted-foreground shrink-0">
                {t("widget.inspector.color")}
              </Label>
              <Div className="flex items-center gap-1.5 flex-1">
                <Input
                  type="color"
                  value={nodeConfig.color ?? "#3b82f6"}
                  onChangeText={(v) => {
                    onUpdate(
                      nodeId,
                      withDisplayOverride(nodeConfig, { color: v }),
                    );
                  }}
                  className="h-6 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
                />
                <Input
                  value={nodeConfig.color ?? ""}
                  onChangeText={(v) => {
                    onUpdate(
                      nodeId,
                      withDisplayOverride(nodeConfig, {
                        color: v || undefined,
                      }),
                    );
                  }}
                  className="h-6 text-[10px] flex-1 font-mono"
                  placeholder="#3b82f6"
                />
              </Div>
            </Div>
            {/* Pane selector */}
            <Div className="flex items-center gap-2">
              <Label className="text-[11px] w-14 text-muted-foreground shrink-0">
                {t("widget.inspector.pane")}
              </Label>
              <Div className="flex items-center gap-0.5 border rounded-md overflow-hidden bg-muted/30">
                {[0, 1, 2].map((pane) => {
                  const current = nodeConfig.pane ?? 0;
                  return (
                    <Button
                      key={pane}
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onUpdate(
                          nodeId,
                          withDisplayOverride(nodeConfig, { pane }),
                        )
                      }
                      className={cn(
                        "h-6 w-7 p-0 text-[11px] rounded-none border-0",
                        current === pane
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {pane}
                    </Button>
                  );
                })}
              </Div>
            </Div>
          </Div>
        </InspectorSection>
      </Div>
    </Div>
  );
});

// ─── Graph Settings Panel ─────────────────────────────────────────────────────

const GraphSettingsPanel = React.memo(function GraphSettingsPanel({
  name,
  slug,
  description,
  triggerType,
  cronSchedule,
  onNameChange,
  onSlugChange,
  onDescriptionChange,
  onTriggerTypeChange,
  onCronScheduleChange,
  t,
}: {
  name: string;
  slug: string;
  description: string;
  triggerType: "manual" | "cron";
  cronSchedule: string;
  onNameChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onTriggerTypeChange: (v: TriggerType) => void;
  onCronScheduleChange: (v: string) => void;
  t: TFn;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-0 h-full">
      {/* Header */}
      <Div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
        <P className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {t("widget.graphSettings")}
        </P>
      </Div>

      <Div className="flex flex-col gap-4 p-3 overflow-y-auto flex-1">
        {/* Name */}
        <Div className="flex flex-col gap-1.5">
          <Label className="text-[11px] font-medium">
            {t("widget.nameLabel")}
          </Label>
          <Input
            value={name}
            onChangeText={onNameChange}
            className="h-8 text-xs"
            placeholder={t("widget.namePlaceholder")}
          />
        </Div>

        {/* Slug */}
        <Div className="flex flex-col gap-1.5">
          <Label className="text-[11px] font-medium">
            {t("widget.slugLabel")}
          </Label>
          <Input
            value={slug}
            onChangeText={onSlugChange}
            className="h-8 text-xs font-mono"
            placeholder={t("widget.slugPlaceholder")}
          />
        </Div>

        {/* Description */}
        <Div className="flex flex-col gap-1.5">
          <Label className="text-[11px] font-medium">
            {t("widget.descriptionLabel")}
          </Label>
          <Input
            value={description}
            onChangeText={onDescriptionChange}
            className="h-8 text-xs"
            placeholder={t("widget.descriptionPlaceholder")}
          />
        </Div>

        {/* Trigger */}
        <Div className="flex flex-col gap-1.5">
          <Label className="text-[11px] font-medium">
            {t("widget.trigger")}
          </Label>
          <Select<TriggerType>
            value={triggerType}
            onValueChange={onTriggerTypeChange}
          >
            <SelectTrigger className="h-8 text-xs">
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
            <Div className="flex flex-col gap-1">
              <Input
                value={cronSchedule}
                onChangeText={onCronScheduleChange}
                className={cn(
                  "h-8 text-xs font-mono",
                  !isValidCron(cronSchedule) && "border-destructive",
                )}
                placeholder="0 6 * * *"
              />
              {!isValidCron(cronSchedule) && (
                <P className="text-[10px] text-destructive">
                  {t("widget.cronInvalid")}
                </P>
              )}
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
});

// ─── Node Palette ──────────────────────────────────────────────────────────────

const NodePalette = React.memo(function NodePalette({
  paletteSearch,
  setPaletteSearch,
  paletteGroups,
  onAddNode,
  t,
}: {
  paletteSearch: string;
  setPaletteSearch: (v: string) => void;
  paletteGroups: Array<{ category: string; entries: PaletteEntry[] }>;
  onAddNode: (alias: string) => void;
  t: TFn;
}): React.JSX.Element {
  return (
    <Div className="w-60 border-r bg-muted/10 overflow-y-auto shrink-0 flex flex-col">
      {/* Search */}
      <Div className="px-2 pt-2 pb-1 relative">
        <Input
          value={paletteSearch}
          onChangeText={setPaletteSearch}
          className="h-6 text-[10px] pr-6"
          placeholder={t("widget.palette.searchPlaceholder")}
        />
        {paletteSearch && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 p-0"
            onClick={() => setPaletteSearch("")}
          >
            <X className="h-2.5 w-2.5" />
          </Button>
        )}
      </Div>

      {/* Dynamic category sections from endpointsMeta */}
      {paletteGroups.map((group, idx) => (
        <PaletteSection
          key={group.category}
          title={`${group.category} (${String(group.entries.length)})`}
          badge={PALETTE_BADGE}
          icon={<Globe className="h-3 w-3" />}
          defaultOpen={idx < 3}
        >
          {group.entries.map((entry) => (
            <PaletteItem
              key={entry.alias}
              label={entry.alias}
              detail={entry.alias}
              alias={entry.alias}
              onClick={() => onAddNode(entry.alias)}
            />
          ))}
        </PaletteSection>
      ))}
    </Div>
  );
});

// ─── Canvas Empty Hint ────────────────────────────────────────────────────────

function CanvasEmptyHint({ t }: { t: TFn }): React.JSX.Element {
  return (
    <Div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <Div className="text-center">
        <P className="text-sm text-muted-foreground/50 font-medium mb-1">
          {t("widget.canvasEmpty")}
        </P>
        <P className="text-xs text-muted-foreground/40">
          {t("widget.canvasEmptyHint")}
        </P>
      </Div>
    </Div>
  );
}

function KeyboardHints({ t }: { t: TFn }): React.JSX.Element {
  return (
    <Div className="absolute bottom-12 right-2 flex flex-col items-end gap-0.5 pointer-events-none z-10">
      <P className="text-[10px] text-muted-foreground/50 bg-background/80 px-1.5 py-0.5 rounded border border-border/30">
        <Span className="font-mono">{t("widget.shortcutDelete")}</Span>
      </P>
      <P className="text-[10px] text-muted-foreground/50 bg-background/80 px-1.5 py-0.5 rounded border border-border/30">
        <Span className="font-mono">{t("widget.shortcutSave")}</Span>
      </P>
    </Div>
  );
}

// ─── Palette endpoint grouping ────────────────────────────────────────────────

interface PaletteEntry {
  alias: string;
  category: string; // Real endpoint category from endpointsMeta (e.g. "AI", "Credits")
}

/** Build alias → real category lookup from generated endpointsMeta */
const aliasToCategory: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const meta of endpointsMeta) {
    map[meta.toolName] = meta.category;
    for (const alias of meta.aliases) {
      map[alias] = meta.category;
    }
  }
  return map;
})();

function buildPaletteEntries(): PaletteEntry[] {
  const seen = new Set<string>();
  const entries: PaletteEntry[] = [];
  for (const [, alias] of Object.entries(pathToAliasMap)) {
    if (seen.has(alias)) {
      continue;
    }
    seen.add(alias);
    const category = aliasToCategory[alias] ?? "System";
    entries.push({ alias, category });
  }
  return entries.toSorted((a, b) => a.alias.localeCompare(b.alias));
}

/** Group palette entries by their real category, sorted alphabetically */
function groupByCategory(
  entries: PaletteEntry[],
): Array<{ category: string; entries: PaletteEntry[] }> {
  const groups = new Map<string, PaletteEntry[]>();
  for (const entry of entries) {
    const list = groups.get(entry.category) ?? [];
    list.push(entry);
    groups.set(entry.category, list);
  }
  return [...groups.entries()]
    .map(([category, items]) => ({ category, entries: items }))
    .toSorted((a, b) => a.category.localeCompare(b.category));
}

// ─── Edit Form Inner ──────────────────────────────────────────────────────────

function EditFormInner({
  savedResponse,
}: {
  savedResponse: EditResponseOutput | null | undefined;
}): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.PUT>();
  const navigation = useWidgetNavigation();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const form = useWidgetForm<typeof definition.PUT>();
  const onSubmit = useWidgetOnSubmit();
  const reactFlow = useReactFlow();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
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
  const [paletteSearch, setPaletteSearch] = useState("");

  const graphId = form.getValues("id") ?? "";
  const isNewGraph = !graphId || graphId === "new";

  // ── Version chain for undo/redo ──
  const versionsOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { id: graphId },
        queryOptions: {
          enabled: !isNewGraph,
          refetchOnWindowFocus: false,
          staleTime: 60_000,
        },
      },
    }),
    [graphId, isNewGraph],
  );
  const versionsEndpoint = useEndpoint(
    versionsDefinitions,
    versionsOptions,
    logger,
    user,
  );
  const versionChain = versionsEndpoint.read?.data?.versions ?? [];
  const currentVersionIndex = versionChain.findIndex((v) => v.id === graphId);
  const prevVersionId =
    currentVersionIndex > 0
      ? versionChain[currentVersionIndex - 1]?.id
      : undefined;
  const nextVersionId =
    currentVersionIndex >= 0 && currentVersionIndex < versionChain.length - 1
      ? versionChain[currentVersionIndex + 1]?.id
      : undefined;

  // Register dirty callback for edge delete button
  useEffect((): (() => void) => {
    edgeDirtyCallback = (): void => {
      setDirty(true);
    };
    return (): void => {
      edgeDirtyCallback = null;
    };
  }, []);

  // ── React to successful save ──
  useEffect(() => {
    if (!savedResponse?.newId) {
      return;
    }
    setDirty(false);
    void (async (): Promise<void> => {
      const dataDef = await import("../data/definition");
      navigation.push(dataDef.default.GET, {
        urlPathParams: { id: savedResponse.newId },
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only fire on new save
  }, [savedResponse?.newId]);

  // ── Load parent graph ──
  const parentOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { id: graphId },
        initialState: {
          resolution: GraphResolution.ONE_DAY,
          cursor: undefined,
        },
        queryOptions: {
          enabled: !isNewGraph,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000,
        },
      },
    }),
    [graphId, isNewGraph],
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

  const [workingNodes, setWorkingNodes] = useState<
    Record<string, GraphNodeConfig>
  >({});

  const isLoading = !isNewGraph && (parentEndpoint.read?.isLoading ?? true);

  // Pre-fill when parent data loads
  useEffect(() => {
    if (parentGraph) {
      setName(parentGraph.name);
      setSlug(parentGraph.slug);
      setDescription(parentGraph.description ?? "");
      setWorkingNodes(parentGraph.config.nodes);
      if (parentGraph.config.trigger.type === "cron") {
        setTriggerType("cron");
        setCronSchedule(parentGraph.config.trigger.schedule);
      }
    }
  }, [parentGraph]);

  // ── Endpoint node info (handles + categories) ──
  const endpointPaths = useMemo(
    () => Object.values(workingNodes).map((n) => n.endpointPath),
    [workingNodes],
  );
  const endpointInfoMap = useEndpointNodeInfo(endpointPaths);

  // ── React Flow state ──
  const initial = useMemo(
    () => configToFlow(graphConfig, endpointInfoMap),
    [graphConfig, endpointInfoMap],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const loadingRef = useRef(true);
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;

  // Full reset from server config — only when NOT dirty (no unsaved local changes)
  useEffect(() => {
    if (!isLoading && !dirtyRef.current) {
      loadingRef.current = true;
      const flow = configToFlow(graphConfig, endpointInfoMap);
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setDirty(false);
      setTimeout((): void => {
        reactFlow.fitView({ padding: 0.2 });
        setTimeout((): void => {
          loadingRef.current = false;
          setDirty(false);
        }, 300);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync only on server config change
  }, [graphConfig, isLoading]);

  // When endpointInfoMap resolves new entries (e.g. after adding a node),
  // patch handles/category in-place without wiping unsaved local state.
  useEffect(() => {
    if (endpointInfoMap.size === 0) {
      return;
    }
    setNodes((prev) =>
      prev.map((node) => {
        const info = endpointInfoMap.get(node.data.label);
        if (!info) {
          return node;
        }
        return {
          ...node,
          data: {
            ...node.data,
            handles: info.handles,
            category: info.category,
          },
        };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- patch handles only when map changes
  }, [endpointInfoMap]);

  const selectedNodeConfig = selectedNodeId
    ? workingNodes[selectedNodeId]
    : null;

  const showNodeInspector =
    selectedNodeConfig !== null && selectedNodeId !== null;

  // ── Palette entries ──
  const allPaletteEntries = useMemo(() => buildPaletteEntries(), []);

  // Group by real endpoint category, filtered by search
  const paletteGroups = useMemo(() => {
    if (!paletteSearch.trim()) {
      return groupByCategory(allPaletteEntries);
    }
    const q = paletteSearch.toLowerCase();
    const filtered = allPaletteEntries.filter((e) =>
      e.alias.toLowerCase().includes(q),
    );
    return groupByCategory(filtered);
  }, [allPaletteEntries, paletteSearch]);

  // ── Handlers ──
  const handleNodesChange = useCallback<OnNodesChange<VibeNode>>(
    (changes) => {
      onNodesChange(changes);

      // Batch state updates: only check non-position changes to avoid work per drag frame
      let shouldDirty = false;
      let selectId: string | null = null;

      for (const c of changes) {
        if (c.type === "position" && !c.dragging && !loadingRef.current) {
          shouldDirty = true;
        } else if (c.type === "remove" && !loadingRef.current) {
          shouldDirty = true;
        } else if (c.type === "select" && c.selected) {
          selectId = c.id;
        }
      }

      if (shouldDirty) {
        setDirty(true);
      }
      if (selectId !== null) {
        setSelectedNodeId(selectId);
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
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: {
              strokeDasharray: "4 2",
              stroke: "hsl(var(--primary))",
              opacity: 0.7,
            },
          },
          eds,
        ),
      );
      setDirty(true);
    },
    [setEdges],
  );

  const addNode = useCallback(
    (endpointPath: string, position?: { x: number; y: number }) => {
      const nodeId = generateNodeId(
        endpointPath.replace(/[./]/g, "_"),
        workingNodes,
      );
      const nodeConfig: GraphNodeConfig = {
        endpointPath,
        method: "POST",
      };

      let pos: { x: number; y: number };
      if (position) {
        pos = position;
      } else {
        const viewport = reactFlow.getViewport();
        pos = {
          x: (-viewport.x + 400) / viewport.zoom,
          y: (-viewport.y + 250) / viewport.zoom,
        };
      }

      const info = endpointInfoMap.get(endpointPath) ?? DEFAULT_INFO;
      const newNode: VibeNode = {
        id: nodeId,
        type: "vibeNode",
        position: pos,
        data: {
          nodeId,
          nodeConfig: nodeConfig as GraphConfig["nodes"][string],
          label: endpointPath,
          handles: info.handles,
          category: info.category,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setWorkingNodes((prev) => ({ ...prev, [nodeId]: nodeConfig }));
      setSelectedNodeId(nodeId);
      setDirty(true);
    },
    [reactFlow, setNodes, workingNodes, endpointInfoMap],
  );

  const handlePaneClick = useCallback((): void => {
    setSelectedNodeId(null);
  }, []);

  const handleNameChange = useCallback((v: string): void => {
    setName(v);
    setDirty(true);
  }, []);

  const handleSlugChange = useCallback((v: string): void => {
    setSlug(v);
    setDirty(true);
  }, []);

  const handleDescriptionChange = useCallback((v: string): void => {
    setDescription(v);
    setDirty(true);
  }, []);

  const handleTriggerTypeChange = useCallback((v: TriggerType): void => {
    setTriggerType(v);
    setDirty(true);
  }, []);

  const handleCronScheduleChange = useCallback((v: string): void => {
    setCronSchedule(v);
    setDirty(true);
  }, []);

  // Stable ref wrapper for addNode — prevents palette from re-rendering when workingNodes changes
  const addNodeRef = useRef(addNode);
  addNodeRef.current = addNode;
  const stableAddNode = useCallback(
    (alias: string, position?: { x: number; y: number }): void => {
      addNodeRef.current(alias, position);
    },
    [],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const alias = e.dataTransfer.getData("application/vibe-node");
      if (!alias) {
        return;
      }
      const position = reactFlow.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });
      stableAddNode(alias, position);
    },
    [stableAddNode, reactFlow],
  );

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
                  nodeConfig: updated as GraphConfig["nodes"][string],
                  label: updated.endpointPath,
                },
              }
            : n,
        ),
      );
      setDirty(true);
    },
    [setNodes],
  );

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

  const handleOpenEndpoint = useCallback(
    (endpointId: string): void => {
      void getEndpoint(endpointId).then((endpoint) => {
        if (!endpoint) {
          return undefined;
        }
        navigation.push(endpoint, { renderInModal: true });
        return undefined;
      });
    },
    [navigation],
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

  const handleVersionUndo = useCallback((): void => {
    if (!prevVersionId) {
      return;
    }
    void (async (): Promise<void> => {
      const editDef = await import("./definition");
      navigation.push(editDef.default.PUT, {
        urlPathParams: { id: prevVersionId },
      });
    })();
  }, [prevVersionId, navigation]);

  const handleVersionRedo = useCallback((): void => {
    if (!nextVersionId) {
      return;
    }
    void (async (): Promise<void> => {
      const editDef = await import("./definition");
      navigation.push(editDef.default.PUT, {
        urlPathParams: { id: nextVersionId },
      });
    })();
  }, [nextVersionId, navigation]);

  const handleConfirmLeave = useCallback((): void => {
    setConfirmBackOpen(false);
    if (navigation.canGoBack) {
      navigation.pop();
    }
  }, [navigation]);

  const syncFormValues = useCallback((): void => {
    if (!form) {
      return;
    }
    const configWithWorkingNodes: GraphConfig = {
      ...graphConfig,
      nodes: workingNodes as GraphConfig["nodes"],
    };
    const newConfig = flowToConfig(configWithWorkingNodes, nodes, edges);
    const trigger: TriggerConfig =
      triggerType === "cron"
        ? { type: "cron", schedule: cronSchedule }
        : { type: "manual" };
    newConfig.trigger = trigger;
    form.setValue("name", name || undefined);
    form.setValue("slug", slug || undefined);
    form.setValue("description", description || undefined);
    form.setValue("config", newConfig);
  }, [
    form,
    nodes,
    edges,
    graphConfig,
    workingNodes,
    name,
    slug,
    description,
    triggerType,
    cronSchedule,
  ]);

  // Keyboard shortcut: Cmd+S / Ctrl+S → save
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        syncFormValues();
        // Schedule submit after form values are synced
        setTimeout(() => onSubmit?.(), 0);
      }
    };
    window.addEventListener("keydown", handler);
    return (): void => window.removeEventListener("keydown", handler);
  }, [syncFormValues, onSubmit]);

  if (isLoading) {
    return (
      <Div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  const nodeCount = Object.keys(workingNodes).length;

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
          className="gap-1 h-7 shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("widget.back")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPaletteOpen(!paletteOpen)}
          className="h-7 w-7 p-0 shrink-0"
          title={t("widget.palette.toggle")}
        >
          {paletteOpen ? (
            <PanelLeftClose className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          )}
        </Button>
        <Div className="flex-1" />
        {/* Version history navigation */}
        {versionChain.length > 1 && (
          <>
            <Div
              className="flex items-center gap-0 shrink-0"
              title="Version history"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVersionUndo}
                disabled={!prevVersionId}
                className="h-7 w-7 p-0"
                title="Undo to previous version"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Div className="flex items-center gap-0.5 px-1">
                <History className="h-3 w-3 text-muted-foreground/50" />
                <Span className="text-[10px] text-muted-foreground/70 tabular-nums">
                  {/* eslint-disable-next-line i18n/no-literal-string -- UI label */}
                  {`${String(currentVersionIndex + 1)}/${String(versionChain.length)}`}
                </Span>
              </Div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVersionRedo}
                disabled={!nextVersionId}
                className="h-7 w-7 p-0"
                title="Redo to next version"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Div>
            <Div className="h-4 w-px bg-border shrink-0" />
          </>
        )}
        {dirty && (
          <Badge
            variant="outline"
            className="text-[10px] text-orange-500 border-orange-300 shrink-0"
          >
            {t("widget.unsaved")}
          </Badge>
        )}
        <Badge variant="outline" className="text-[10px] shrink-0">
          {String(nodeCount)} {t("widget.nodes")}
        </Badge>
        <Button
          type="submit"
          variant="default"
          size="sm"
          onClick={syncFormValues}
          className="gap-1 h-7 shrink-0"
        >
          <Save className="h-3.5 w-3.5" />
          {t("widget.save")}
        </Button>
      </Div>

      {/* Three-panel layout */}
      <Div className="flex flex-1 min-h-0">
        {/* Left Sidebar — Node Palette (240px) */}
        {paletteOpen && (
          <NodePalette
            paletteSearch={paletteSearch}
            setPaletteSearch={setPaletteSearch}
            paletteGroups={paletteGroups}
            onAddNode={stableAddNode}
            t={t}
          />
        )}

        {/* Center — React Flow Canvas */}
        <Div className="flex-1 min-w-0 relative">
          {nodeCount === 0 && <CanvasEmptyHint t={t} />}
          <KeyboardHints t={t} />
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            colorMode="system"
            deleteKeyCode={["Delete", "Backspace"]}
            style={{ width: "100%", height: "100%" }}
            onPaneClick={handlePaneClick}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Div>

        {/* Right Panel — Node Inspector or Graph Settings (280px) */}
        <Card className="w-70 border-l border-t-0 border-b-0 border-r-0 rounded-none overflow-hidden shrink-0 flex flex-col">
          {showNodeInspector ? (
            <NodeInspector
              nodeId={selectedNodeId}
              nodeConfig={selectedNodeConfig}
              category={
                endpointInfoMap.get(selectedNodeConfig.endpointPath)
                  ?.category ?? "other"
              }
              onUpdate={updateNodeConfig}
              onDelete={deleteNode}
              onClose={handlePaneClick}
              onOpenEndpoint={handleOpenEndpoint}
              t={t}
              deleteConfirmNodeId={deleteConfirmNodeId}
              setDeleteConfirmNodeId={setDeleteConfirmNodeId}
            />
          ) : (
            <GraphSettingsPanel
              name={name}
              slug={slug}
              description={description}
              triggerType={triggerType}
              cronSchedule={cronSchedule}
              onNameChange={handleNameChange}
              onSlugChange={handleSlugChange}
              onDescriptionChange={handleDescriptionChange}
              onTriggerTypeChange={handleTriggerTypeChange}
              onCronScheduleChange={handleCronScheduleChange}
              t={t}
            />
          )}
        </Card>
      </Div>
    </Div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function EditGraphWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  return (
    <ReactFlowProvider>
      <EditFormInner savedResponse={field.value} />
    </ReactFlowProvider>
  );
}
