/**
 * Vibe Frame Admin Test Page — Client
 *
 * Interactive test page for mounting vibe-frame endpoints.
 * Each widget is an independent config: endpoint, placement, styles, trigger, display.
 * Mirrors the original widget-engine test UI where N widgets render independently.
 */

/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization -- Admin dev tool page */
/* eslint-disable oxlint-plugin-i18n/no-literal-string -- Admin dev tool page, not user-facing */

"use client";

import type { AutocompleteOption } from "next-vibe-ui/ui/autocomplete-field";
import { AutocompleteField } from "next-vibe-ui/ui/autocomplete-field";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  Eye,
  Frame,
  Layout,
  Moon,
  MousePointerClick,
  Plus,
  Settings,
  Sun,
  Trash2,
  X,
  Zap,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import helpEndpoints from "@/app/api/[locale]/system/help/definition";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type {
  FrameDisplayMode,
  FrameError,
  FrameTheme,
  FrameTriggerType,
} from "@/app/api/[locale]/system/unified-interface/vibe-frame/types";
import { VibeFrameHost } from "@/app/api/[locale]/system/unified-interface/vibe-frame/VibeFrameHost";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BridgeEvent {
  timestamp: number;
  direction: "in" | "out";
  type: string;
  widgetId?: string;
  data?: Record<string, string>;
}

/** Each widget is a fully independent config — like the original widget engine */
interface WidgetConfig {
  id: string;
  endpoint: string;
  // Display
  theme: FrameTheme;
  displayMode: FrameDisplayMode;
  data: string; // JSON string
  // Placement
  rootType: "body" | "inline";
  rootSelector: string;
  insertPosition: "beforebegin" | "afterbegin" | "beforeend" | "afterend";
  // Trigger
  triggerType: FrameTriggerType;
  triggerDelay: string;
  triggerScrollPercent: string;
  triggerClickSelector: string;
  triggerOnce: boolean;
  // Iframe style
  width: string;
  maxHeight: string;
  borderRadius: string;
  shadow: boolean;
  padding: string;
  sandbox: string;
  // State
  enabled: boolean;
}

function createDefaultWidget(): WidgetConfig {
  return {
    id: String(Date.now()),
    endpoint: "",
    theme: "system",
    displayMode: "inline",
    data: "{}",
    rootType: "inline",
    rootSelector: "",
    insertPosition: "beforeend",
    triggerType: "immediate",
    triggerDelay: "0",
    triggerScrollPercent: "50",
    triggerClickSelector: "",
    triggerOnce: false,
    width: "100%",
    maxHeight: "800",
    borderRadius: "8",
    shadow: true,
    padding: "0",
    sandbox: "allow-scripts allow-same-origin allow-forms allow-popups",
    enabled: true,
  };
}

// ─── Collapsible Section ─────────────────────────────────────────────────────

function Section({
  title,
  icon: Icon,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}): JSX.Element {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Div className="rounded-lg border bg-card/50">
      <Div
        className="cursor-pointer hover:bg-accent/30 transition-colors rounded-lg px-3 py-2 flex items-center gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <Span className="text-xs font-medium flex-1">{title}</Span>
        {badge !== undefined && (
          <Badge variant="secondary" className="text-[9px] px-1 py-0">
            {badge}
          </Badge>
        )}
        {open ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        )}
      </Div>
      {open && <Div className="px-3 pb-3 flex flex-col gap-3">{children}</Div>}
    </Div>
  );
}

// ─── Config Field ────────────────────────────────────────────────────────────

function ConfigField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Div>
      <Span className="text-[10px] font-medium text-muted-foreground mb-1 block">
        {label}
      </Span>
      {children}
    </Div>
  );
}

// ─── Button Group ────────────────────────────────────────────────────────────

function ButtonGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
}): JSX.Element {
  return (
    <Div className="flex gap-1 flex-wrap">
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={value === opt.value ? "default" : "outline"}
          size="sm"
          className="text-[10px] h-6 px-1.5"
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </Div>
  );
}

// ─── Single Widget Config Card ───────────────────────────────────────────────

function WidgetConfigCard({
  widget,
  index,
  toolOptions,
  onUpdate,
  onRemove,
  canRemove,
}: {
  widget: WidgetConfig;
  index: number;
  toolOptions: AutocompleteOption<string>[];
  onUpdate: (id: string, updates: Partial<WidgetConfig>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}): JSX.Element {
  const set = useCallback(
    (updates: Partial<WidgetConfig>): void => onUpdate(widget.id, updates),
    [widget.id, onUpdate],
  );

  return (
    <Card className={!widget.enabled ? "opacity-50" : ""}>
      {/* Widget header */}
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-xs font-semibold flex items-center gap-2">
          <Badge variant="outline" className="text-[9px] px-1 py-0">
            #{index + 1}
          </Badge>
          <Span className="flex-1 truncate text-xs">
            {widget.endpoint || "No endpoint"}
          </Span>
          <Button
            variant={widget.enabled ? "default" : "outline"}
            size="sm"
            className="h-5 text-[9px] px-1.5"
            onClick={() => set({ enabled: !widget.enabled })}
          >
            {widget.enabled ? "ON" : "OFF"}
          </Button>
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(widget.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 pb-3 flex flex-col gap-2">
        {/* Endpoint selector */}
        <AutocompleteField
          value={widget.endpoint}
          onChange={(val) => set({ endpoint: val })}
          options={toolOptions}
          placeholder="Select endpoint..."
          searchPlaceholder="Search..."
          allowCustom={true}
        />

        {/* Display */}
        <Section title="Display" icon={Layout} defaultOpen={false}>
          <ConfigField label="Theme">
            <Div className="flex gap-1">
              {(["system", "light", "dark"] as const).map((t) => (
                <Button
                  key={t}
                  variant={widget.theme === t ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-[10px] h-6"
                  onClick={() => set({ theme: t })}
                >
                  {t === "system" ? (
                    <Settings className="h-3 w-3 mr-1" />
                  ) : t === "light" ? (
                    <Sun className="h-3 w-3 mr-1" />
                  ) : (
                    <Moon className="h-3 w-3 mr-1" />
                  )}
                  {t}
                </Button>
              ))}
            </Div>
          </ConfigField>

          <ConfigField label="Display Mode">
            <ButtonGroup
              value={widget.displayMode}
              onChange={(v) => set({ displayMode: v })}
              options={[
                { value: "inline", label: "Inline" },
                { value: "modal", label: "Modal" },
                { value: "slideIn", label: "Slide" },
                { value: "bottomSheet", label: "Sheet" },
              ]}
            />
          </ConfigField>

          <ConfigField label="Pre-fill Data (JSON)">
            <textarea
              value={widget.data}
              onChange={(e) => set({ data: e.target.value })}
              className="w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono min-h-[40px] resize-y focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder='{"name": "John"}'
              spellCheck={false}
            />
          </ConfigField>
        </Section>

        {/* Placement */}
        <Section title="Placement" icon={Layout} defaultOpen={false}>
          <ConfigField label="Root Type">
            <ButtonGroup
              value={widget.rootType}
              onChange={(v) => set({ rootType: v })}
              options={[
                { value: "inline", label: "Inline" },
                { value: "body", label: "Body (Overlay)" },
              ]}
            />
          </ConfigField>

          {widget.rootType === "inline" && (
            <ConfigField label="Root Selector">
              <input
                type="text"
                value={widget.rootSelector}
                onChange={(e) => set({ rootSelector: e.target.value })}
                className="w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="#my-container"
              />
            </ConfigField>
          )}

          <ConfigField label="Insert Position">
            <ButtonGroup
              value={widget.insertPosition}
              onChange={(v) => set({ insertPosition: v })}
              options={[
                { value: "beforebegin", label: "Before" },
                { value: "afterbegin", label: "Prepend" },
                { value: "beforeend", label: "Append" },
                { value: "afterend", label: "After" },
              ]}
            />
          </ConfigField>
        </Section>

        {/* Trigger */}
        <Section title="Trigger" icon={MousePointerClick} defaultOpen={false}>
          <ConfigField label="Trigger Type">
            <ButtonGroup
              value={widget.triggerType}
              onChange={(v) => set({ triggerType: v })}
              options={[
                { value: "immediate", label: "Immediate" },
                { value: "scroll", label: "Scroll" },
                { value: "time", label: "Time" },
                { value: "exitIntent", label: "Exit" },
                { value: "click", label: "Click" },
              ]}
            />
          </ConfigField>

          {widget.triggerType === "scroll" && (
            <ConfigField label={`Scroll: ${widget.triggerScrollPercent}%`}>
              <input
                type="range"
                min="0"
                max="100"
                value={widget.triggerScrollPercent}
                onChange={(e) => set({ triggerScrollPercent: e.target.value })}
                className="w-full"
              />
            </ConfigField>
          )}

          {(widget.triggerType === "time" ||
            widget.triggerType === "exitIntent") && (
            <ConfigField label="Delay (ms)">
              <input
                type="number"
                value={widget.triggerDelay}
                onChange={(e) => set({ triggerDelay: e.target.value })}
                className="w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                min="0"
                step="500"
              />
            </ConfigField>
          )}

          {widget.triggerType === "click" && (
            <ConfigField label="Click Selector">
              <input
                type="text"
                value={widget.triggerClickSelector}
                onChange={(e) => set({ triggerClickSelector: e.target.value })}
                className="w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="#my-button"
              />
            </ConfigField>
          )}

          <ConfigField label="Once per session">
            <Button
              variant={widget.triggerOnce ? "default" : "outline"}
              size="sm"
              className="h-5 text-[9px]"
              onClick={() => set({ triggerOnce: !widget.triggerOnce })}
            >
              {widget.triggerOnce ? "Yes" : "No"}
            </Button>
          </ConfigField>
        </Section>

        {/* Iframe Style */}
        <Section title="Iframe Style" icon={Frame} defaultOpen={false}>
          <Div className="grid grid-cols-2 gap-2">
            <ConfigField label="Width">
              <input
                type="text"
                value={widget.width}
                onChange={(e) => set({ width: e.target.value })}
                className="w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="100%"
              />
            </ConfigField>
            <ConfigField label="Max Height">
              <input
                type="number"
                value={widget.maxHeight}
                onChange={(e) => set({ maxHeight: e.target.value })}
                className="w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                min="100"
                step="50"
              />
            </ConfigField>
            <ConfigField label="Radius">
              <input
                type="number"
                value={widget.borderRadius}
                onChange={(e) => set({ borderRadius: e.target.value })}
                className="w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                min="0"
              />
            </ConfigField>
            <ConfigField label="Padding">
              <input
                type="number"
                value={widget.padding}
                onChange={(e) => set({ padding: e.target.value })}
                className="w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                min="0"
              />
            </ConfigField>
          </Div>

          <Div className="flex gap-2">
            <ConfigField label="Shadow">
              <Button
                variant={widget.shadow ? "default" : "outline"}
                size="sm"
                className="h-5 text-[9px]"
                onClick={() => set({ shadow: !widget.shadow })}
              >
                {widget.shadow ? "On" : "Off"}
              </Button>
            </ConfigField>
          </Div>

          <ConfigField label="Sandbox">
            <input
              type="text"
              value={widget.sandbox}
              onChange={(e) => set({ sandbox: e.target.value })}
              className="w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </ConfigField>
        </Section>
      </CardContent>
    </Card>
  );
}

// ─── Widget Frame (per-widget iframe with display-mode styling) ──────────────

function WidgetFrame({
  widget,
  serverUrl,
  locale,
  handlers,
}: {
  widget: WidgetConfig;
  serverUrl: string;
  locale: CountryLanguage;
  handlers: WidgetHandlers;
}): JSX.Element {
  // Memoize parsed data to avoid creating new object refs on every render
  const parsedData = useMemo((): Record<string, string> | undefined => {
    try {
      const d: Record<string, string> = JSON.parse(widget.data);
      if (Object.keys(d).length > 0) {
        return d;
      }
    } catch {
      // skip
    }
    return undefined;
  }, [widget.data]);
  const maxH = Number.parseInt(widget.maxHeight, 10) || 800;

  return (
    <Div
      className={`w-full max-w-full overflow-hidden bg-background ${
        widget.shadow ? "shadow-md" : ""
      } ${widget.borderRadius !== "0" ? "rounded-lg" : ""}`}
    >
      <VibeFrameHost
        serverUrl={serverUrl}
        endpoint={widget.endpoint}
        locale={locale}
        theme={widget.theme}
        data={parsedData}
        maxHeight={maxH}
        sandbox={widget.sandbox}
        onReady={handlers.onReady}
        onSuccess={handlers.onSuccess}
        onError={handlers.onError}
        onNavigate={handlers.onNavigate}
        onClose={handlers.onClose}
        onAuthRequired={handlers.onAuthRequired}
      />
    </Div>
  );
}

// ─── Widget handler types ────────────────────────────────────────────────────

interface WidgetHandlers {
  onReady: () => void;
  onSuccess: (data: Record<string, string>) => void;
  onError: (error: FrameError) => void;
  onNavigate: (path: string) => void;
  onClose: () => void;
  onAuthRequired: () => void;
}

type MakeHandlersFn = (wId: string) => WidgetHandlers;

// ─── Mock Host Page (simulates a real website with widgets) ──────────────────

/** Placeholder lines for the mock page background content */
const MOCK_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.",
];

function MockHostPage({
  widgets,
  mountKey,
  serverUrl,
  locale,
  makeHandlers,
}: {
  widgets: WidgetConfig[];
  mountKey: number;
  serverUrl: string;
  locale: CountryLanguage;
  makeHandlers: MakeHandlersFn;
}): JSX.Element {
  const [closedOverlays, setClosedOverlays] = useState<Set<string>>(new Set());

  // Reset closed overlays on remount
  useEffect(() => {
    setClosedOverlays(new Set());
  }, [mountKey]);

  const inlineWidgets = widgets.filter((w) => w.displayMode === "inline");
  const overlayWidgets = widgets.filter(
    (w) => w.displayMode !== "inline" && !closedOverlays.has(w.id),
  );

  const closeOverlay = useCallback((id: string) => {
    setClosedOverlays((prev) => new Set(prev).add(id));
  }, []);

  return (
    <Div className="relative rounded-b-lg overflow-hidden min-h-[600px]">
      {/* ── Mock page content ─────────────────────────────────────── */}
      <Div className="bg-white dark:bg-slate-900 p-8">
        {/* Mock nav */}
        <Div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
          <Div className="h-8 w-8 rounded bg-slate-300 dark:bg-slate-600" />
          <Div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <Div className="flex-1" />
          <Div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          <Div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          <Div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        </Div>

        {/* Mock hero */}
        <Div className="mb-8">
          <Div className="h-6 w-64 rounded bg-slate-300 dark:bg-slate-600 mb-3" />
          <Div className="h-4 w-96 max-w-full rounded bg-slate-200 dark:bg-slate-700 mb-2" />
          <Div className="h-4 w-80 max-w-full rounded bg-slate-200 dark:bg-slate-700" />
        </Div>

        {/* Mock content paragraphs — inline widgets injected between them */}
        {MOCK_PARAGRAPHS.map((text, pIdx) => (
          <Div key={pIdx}>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 leading-relaxed">
              {text}
            </p>

            {/* Insert inline widget matching this paragraph index */}
            {pIdx < inlineWidgets.length && (
              <Div key={inlineWidgets[pIdx].id} className="my-4 relative">
                {/* Label floating above */}
                <Div className="absolute -top-2.5 left-2 z-10">
                  <Badge className="text-[8px] px-1 py-0 bg-blue-600 text-white">
                    inline: {inlineWidgets[pIdx].endpoint}
                  </Badge>
                </Div>
                <Div className="border border-blue-400/30 rounded-lg">
                  <WidgetFrame
                    widget={inlineWidgets[pIdx]}
                    serverUrl={serverUrl}
                    locale={locale}
                    handlers={makeHandlers(inlineWidgets[pIdx].id)}
                  />
                </Div>
              </Div>
            )}
          </Div>
        ))}

        {/* Remaining inline widgets that exceed paragraph count */}
        {inlineWidgets.slice(MOCK_PARAGRAPHS.length).map((widget) => (
          <Div key={widget.id} className="my-4 relative">
            <Div className="absolute -top-2.5 left-2 z-10">
              <Badge className="text-[8px] px-1 py-0 bg-blue-600 text-white">
                inline: {widget.endpoint}
              </Badge>
            </Div>
            <Div className="border border-blue-400/30 rounded-lg">
              <WidgetFrame
                widget={widget}
                serverUrl={serverUrl}
                locale={locale}
                handlers={makeHandlers(widget.id)}
              />
            </Div>
          </Div>
        ))}
      </Div>

      {/* ── Overlay widgets (modal / slideIn / bottomSheet) ────────── */}
      {overlayWidgets.map((widget) => {
        const handlers = makeHandlers(widget.id);
        const isModal = widget.displayMode === "modal";
        const isSlideIn = widget.displayMode === "slideIn";
        const isBottomSheet = widget.displayMode === "bottomSheet";

        const overlayAlign = isBottomSheet ? "items-end" : "items-center";
        const overlayJustify = isSlideIn ? "justify-end" : "justify-center";

        const dialogClass = [
          "relative bg-white dark:bg-slate-800 overflow-auto",
          isModal && "w-[90%] max-w-[600px] max-h-[90%] rounded-lg",
          isSlideIn && "w-[400px] max-w-[90%] h-full",
          isBottomSheet && "w-full max-h-[80%] rounded-t-xl",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <Div
            key={widget.id}
            className={`absolute inset-0 z-20 flex bg-black/40 ${overlayAlign} ${overlayJustify}`}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeOverlay(widget.id);
                handlers.onClose();
              }
            }}
          >
            {/* Dialog container */}
            <Div className={dialogClass}>
              {/* Label + Close button */}
              <Div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                <Badge className="text-[8px] px-1 py-0 bg-purple-600 text-white">
                  {widget.displayMode}: {widget.endpoint}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    closeOverlay(widget.id);
                    handlers.onClose();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Div>

              <WidgetFrame
                widget={widget}
                serverUrl={serverUrl}
                locale={locale}
                handlers={handlers}
              />
            </Div>
          </Div>
        );
      })}

      {/* No widgets message */}
      {widgets.length === 0 && (
        <Div className="absolute inset-0 flex items-center justify-center">
          <P className="text-sm text-muted-foreground">
            No enabled widgets with endpoints
          </P>
        </Div>
      )}
    </Div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function VibeFrameTestPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { ...createDefaultWidget(), endpoint: "contact_POST" },
  ]);
  const [events, setEvents] = useState<BridgeEvent[]>([]);
  const [copied, setCopied] = useState(false);

  const serverUrl = envClient.NEXT_PUBLIC_APP_URL;

  // ── Fetch endpoints from help ─────────────────────────────────────────

  const endpointLogger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const helpState = useEndpoint(
    helpEndpoints,
    {
      read: {
        initialState: { pageSize: 500 },
        queryOptions: {
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000,
        },
      },
    },
    endpointLogger,
    user,
  );

  const toolOptions = useMemo((): AutocompleteOption<string>[] => {
    const response = helpState?.read?.response;
    if (!response || response.success !== true) {
      return [];
    }
    return response.data.tools.map((tool) => {
      const alias = tool.aliases?.[0];
      const label = alias ?? tool.name;
      return {
        value: tool.name,
        label,
        description: tool.description,
        category: tool.category,
      };
    });
  }, [helpState?.read?.response]);

  // ── Event logging ──────────────────────────────────────────────────

  const logEventRef = useRef(
    (
      direction: "in" | "out",
      type: string,
      widgetId?: string,
      data?: Record<string, string>,
    ): void => {
      setEvents((prev) => [
        { timestamp: Date.now(), direction, type, widgetId, data },
        ...prev.slice(0, 199),
      ]);
    },
  );

  // ── Widget CRUD ───────────────────────────────────────────────────

  const updateWidget = useCallback(
    (id: string, updates: Partial<WidgetConfig>): void => {
      setWidgets((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...updates } : w)),
      );
    },
    [],
  );

  const removeWidget = useCallback((id: string): void => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const addWidget = useCallback((): void => {
    setWidgets((prev) => [...prev, createDefaultWidget()]);
  }, []);

  // ── Per-widget callback factories (stable refs) ───────────────────

  const handlersCache = useRef(new Map<string, WidgetHandlers>());

  const makeHandlers = useCallback((wId: string): WidgetHandlers => {
    const cached = handlersCache.current.get(wId);
    if (cached) {
      return cached;
    }
    const log = logEventRef.current;
    const handlers: WidgetHandlers = {
      onReady: (): void => log("in", "vf:ready", wId),
      onSuccess: (d: Record<string, string>): void =>
        log("in", "vf:success", wId, d),
      onError: (error: FrameError): void =>
        log("in", "vf:error", wId, {
          message: error.message,
          errorType: error.errorType,
        }),
      onNavigate: (path: string): void =>
        log("in", "vf:navigate", wId, { path }),
      onClose: (): void => log("in", "vf:close", wId),
      onAuthRequired: (): void => log("in", "vf:authRequired", wId),
    };
    handlersCache.current.set(wId, handlers);
    return handlers;
  }, []);

  // ── Embed snippet ─────────────────────────────────────────────────────

  const embedSnippet = useMemo((): string => {
    const active = widgets.filter((w) => w.enabled && w.endpoint);
    if (active.length === 0) {
      return "// No enabled widgets with endpoints";
    }

    const widgetConfigs = active
      .map((w) => {
        let parsedData: Record<string, string> | undefined;
        try {
          const d: Record<string, string> = JSON.parse(w.data);
          if (Object.keys(d).length > 0) {
            parsedData = d;
          }
        } catch {
          // skip
        }

        const lines: string[] = [];
        lines.push(`    endpoint: "${w.endpoint}"`);
        if (w.rootType === "inline" && w.rootSelector) {
          lines.push(`    target: "${w.rootSelector}"`);
        }
        lines.push(`    theme: "${w.theme}"`);
        lines.push(`    display: "${w.displayMode}"`);
        if (w.insertPosition !== "beforeend") {
          lines.push(`    insertPosition: "${w.insertPosition}"`);
        }
        if (parsedData) {
          lines.push(`    data: ${JSON.stringify(parsedData)}`);
        }
        if (w.triggerType !== "immediate") {
          const tLines = [`type: "${w.triggerType}"`];
          if (w.triggerType === "scroll") {
            tLines.push(`scrollPercent: ${w.triggerScrollPercent}`);
          }
          if (w.triggerType === "time" || w.triggerType === "exitIntent") {
            tLines.push(`delayMs: ${w.triggerDelay}`);
          }
          if (w.triggerType === "click" && w.triggerClickSelector) {
            tLines.push(`clickSelector: "${w.triggerClickSelector}"`);
          }
          if (w.triggerOnce) {
            tLines.push(`once: true`);
          }
          lines.push(`    trigger: { ${tLines.join(", ")} }`);
        }
        if (w.width !== "100%" || w.maxHeight !== "800" || !w.shadow) {
          const sLines: string[] = [];
          if (w.width !== "100%") {
            sLines.push(`width: "${w.width}"`);
          }
          if (w.maxHeight !== "800") {
            sLines.push(`maxHeight: ${w.maxHeight}`);
          }
          if (!w.shadow) {
            sLines.push(`shadow: false`);
          }
          lines.push(`    style: { ${sLines.join(", ")} }`);
        }
        return `  {\n${lines.join(",\n")}\n  }`;
      })
      .join(",\n");

    return `<script src="${serverUrl}/vibe-frame.js"></script>
<script>
  VibeFrame.mount([
${widgetConfigs}
  ], {
    serverUrl: "${serverUrl}",
    locale: "${locale}",
  });
</script>`;
  }, [widgets, serverUrl, locale]);

  const handleCopy = useCallback((): void => {
    void navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [embedSnippet]);

  const active = useMemo(
    () => widgets.filter((w) => w.enabled && w.endpoint),
    [widgets],
  );

  return (
    <Div className="p-6 max-w-[1600px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <Div className="flex items-center gap-3">
        <Frame className="h-7 w-7 text-primary" />
        <Div>
          <H2 className="text-xl font-bold">Vibe Frame Test</H2>
          <P className="text-sm text-muted-foreground">
            Configure N independent widgets — each with its own endpoint,
            placement, trigger, and style.
          </P>
        </Div>
      </Div>

      {/* Top row: Widget configs + Events + Embed */}
      <Div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* ── Widget Configs ──────────────────────────────────────── */}
        <Div className="flex flex-col gap-3">
          <Div className="flex items-center justify-between">
            <Span className="text-sm font-semibold">Widgets</Span>
            <Badge variant="secondary" className="text-[10px]">
              {widgets.length} configured / {active.length} enabled
            </Badge>
          </Div>

          <Div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {widgets.map((widget, idx) => (
              <WidgetConfigCard
                key={widget.id}
                widget={widget}
                index={idx}
                toolOptions={toolOptions}
                onUpdate={updateWidget}
                onRemove={removeWidget}
                canRemove={widgets.length > 1}
              />
            ))}
          </Div>

          <Button variant="outline" className="w-full" onClick={addWidget}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Widget
          </Button>
        </Div>

        {/* ── Events + Embed (sidebar) ────────────────────────────── */}
        <Div className="flex flex-col gap-4">
          {/* Bridge Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <Span className="flex-1">Bridge Events</Span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {events.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {events.length > 0 && (
                <Div className="flex justify-end px-3 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 text-[10px]"
                    onClick={() => setEvents([])}
                  >
                    <Trash2 className="h-2.5 w-2.5 mr-1" />
                    Clear
                  </Button>
                </Div>
              )}
              <Div className="max-h-[400px] overflow-auto">
                {events.length === 0 ? (
                  <Div className="p-6 text-center text-xs text-muted-foreground">
                    No events yet
                  </Div>
                ) : (
                  <Div className="divide-y">
                    {events.map((event, i) => (
                      <Div
                        key={`${event.timestamp}-${i}`}
                        className={`px-2 py-1 flex items-start gap-1.5 text-[10px] font-mono ${
                          event.direction === "in"
                            ? "bg-blue-50/50 dark:bg-blue-950/20"
                            : "bg-amber-50/50 dark:bg-amber-950/20"
                        }`}
                      >
                        <Badge
                          variant={
                            event.direction === "in" ? "default" : "secondary"
                          }
                          className="text-[8px] px-0.5 py-0 shrink-0"
                        >
                          {event.direction === "in" ? "IN" : "OUT"}
                        </Badge>
                        <Span className="font-semibold shrink-0">
                          {event.type}
                        </Span>
                        {event.widgetId ? (
                          <Badge
                            variant="outline"
                            className="text-[8px] px-0.5 py-0 shrink-0"
                          >
                            {widgets
                              .findIndex((w) => w.id === event.widgetId)
                              .toString()}
                          </Badge>
                        ) : null}
                        {event.data ? (
                          <Span className="text-muted-foreground truncate">
                            {JSON.stringify(event.data).slice(0, 60)}
                          </Span>
                        ) : null}
                      </Div>
                    ))}
                  </Div>
                )}
              </Div>
            </CardContent>
          </Card>

          {/* Embed Code */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                Embed Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Div className="relative">
                <pre className="rounded-md bg-slate-900 dark:bg-slate-950 text-slate-100 p-3 text-[10px] font-mono overflow-auto whitespace-pre-wrap max-h-[300px]">
                  {embedSnippet}
                </pre>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 h-6 text-[10px]"
                  onClick={handleCopy}
                >
                  <Copy className="h-2.5 w-2.5 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </Div>
            </CardContent>
          </Card>
        </Div>
      </Div>

      {/* ── Full-width Live Preview — simulated example page ──────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            Live Preview
            {active.length > 0 && (
              <Badge
                variant="default"
                className="text-[10px] px-1.5 py-0 bg-green-600"
              >
                {active.length} Active
              </Badge>
            )}
            <Span className="text-[10px] text-muted-foreground ml-auto">
              Simulated host page — widgets render in their configured display
              mode
            </Span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <MockHostPage
            widgets={active}
            mountKey={0}
            serverUrl={serverUrl}
            locale={locale}
            makeHandlers={makeHandlers}
          />
        </CardContent>
      </Card>
    </Div>
  );
}
