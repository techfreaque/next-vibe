/**
 * AI Agent Run Widget
 *
 * Custom widget for the AI Agent Run endpoint.
 * - Standard form fields for model, character, prompt, etc.
 * - Pre-calls with inline endpoint rendering (same pattern as execute-tool)
 * - ToolsConfigEdit for allowedTools and tools (same pattern as character edit)
 */

/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import type { AutocompleteOption } from "next-vibe-ui/ui/autocomplete-field";
import { AutocompleteField } from "next-vibe-ui/ui/autocomplete-field";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Sparkles,
  Trash2,
  Zap,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getEndpoint,
  getFullPath,
} from "@/app/api/[locale]/system/generated/endpoint";
import helpDefinitions from "@/app/api/[locale]/system/help/definition";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import type { CountryLanguage } from "@/i18n/core/config";

import { useCharacter } from "../../chat/characters/[id]/hooks";
import { useChatSettings } from "../../chat/settings/hooks";
import {
  type ToolEntry,
  ToolsConfigEdit,
} from "../../tools/tools-config-widget";
import type definition from "./definition";
import type {
  AiStreamRunPostRequestOutput,
  AiStreamRunPostResponseOutput,
} from "./definition";

// ─── Types ──────────────────────────────────────────────────────────────────

type PreCall = NonNullable<AiStreamRunPostRequestOutput["preCalls"]>[number];

interface CustomWidgetProps {
  field: {
    value: AiStreamRunPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

// ─── Pre-Call Row with inline endpoint ──────────────────────────────────────

function PreCallRow({
  call,
  index,
  toolOptions,
  locale,
  user,
  onRouteIdChange,
  onRemove,
}: {
  call: PreCall;
  index: number;
  toolOptions: AutocompleteOption<string>[];
  locale: CountryLanguage;
  user: ReturnType<typeof useWidgetUser>;
  onRouteIdChange: (index: number, routeId: string) => void;
  onRemove: (index: number) => void;
}): JSX.Element {
  const [resolvedEndpoint, setResolvedEndpoint] =
    useState<CreateApiEndpointAny | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);

  // Resolve routeId → endpoint definition (same as execute-tool)
  useEffect((): (() => void) => {
    if (!call.routeId) {
      setResolvedEndpoint(null);
      setResolveError(null);
      return () => undefined;
    }

    let cancelled = false;

    const resolve = async (): Promise<void> => {
      const canonicalId = getFullPath(call.routeId) ?? call.routeId;
      const ep = await getEndpoint(canonicalId);
      if (cancelled) {
        return;
      }
      if (ep) {
        setResolvedEndpoint(ep);
        setResolveError(null);
      } else {
        setResolvedEndpoint(null);
        setResolveError(`Unknown tool: ${call.routeId}`);
      }
    };

    void resolve();

    return () => {
      cancelled = true;
    };
  }, [call.routeId]);

  const method = resolvedEndpoint?.method as
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | undefined;

  // Pre-call args are set via the inline endpoint form (not via endpointOptions prefill)
  // The EndpointsPage renders the target endpoint's form directly.

  return (
    <Div className="rounded-lg border bg-muted/20 flex flex-col gap-2 overflow-hidden">
      {/* Header: autocomplete + remove */}
      <Div className="flex items-center gap-2 p-3 pb-0">
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
          #{index + 1}
        </Badge>
        <Div className="flex-1">
          <AutocompleteField
            value={call.routeId}
            onChange={(val) => onRouteIdChange(index, val)}
            options={toolOptions}
            placeholder="Select endpoint..."
            searchPlaceholder="Search endpoints..."
            allowCustom={true}
          />
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </Div>

      {/* Inline endpoint form */}
      {!call.routeId && (
        <P className="text-xs text-muted-foreground px-3 pb-3">
          Select an endpoint to configure its parameters.
        </P>
      )}

      {resolveError && (
        <P className="text-xs text-destructive px-3 pb-3">{resolveError}</P>
      )}

      {call.routeId && !resolvedEndpoint && !resolveError && (
        <P className="text-xs text-muted-foreground px-3 pb-3">
          Resolving endpoint...
        </P>
      )}

      {resolvedEndpoint && method && (
        <Div className="border-t">
          <EndpointsPage
            endpoint={{ [method]: resolvedEndpoint }}
            locale={locale}
            user={user}
          />
        </Div>
      )}
    </Div>
  );
}

// ─── Pre-Calls Editor ───────────────────────────────────────────────────────

function PreCallsEditor({
  preCalls,
  onChange,
  toolOptions,
  locale,
  user,
}: {
  preCalls: PreCall[];
  onChange: (calls: PreCall[]) => void;
  toolOptions: AutocompleteOption<string>[];
  locale: CountryLanguage;
  user: ReturnType<typeof useWidgetUser>;
}): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(preCalls.length > 0);

  const handleAdd = useCallback((): void => {
    onChange([...preCalls, { routeId: "", args: {} }]);
    setIsExpanded(true);
  }, [preCalls, onChange]);

  const handleRemove = useCallback(
    (index: number): void => {
      onChange([...preCalls.slice(0, index), ...preCalls.slice(index + 1)]);
    },
    [preCalls, onChange],
  );

  const handleRouteIdChange = useCallback(
    (index: number, routeId: string): void => {
      const updated = [...preCalls];
      // Reset args when routeId changes
      updated[index] = { routeId, args: {} };
      onChange(updated);
    },
    [preCalls, onChange],
  );

  return (
    <Div className="rounded-xl border bg-card flex flex-col">
      <Div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/30 transition-colors rounded-xl"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <Zap className="h-4 w-4 text-primary flex-shrink-0" />
        <Div className="flex-1 flex flex-col gap-0.5">
          <Span className="text-sm font-semibold">Pre-Calls</Span>
          <Span className="text-xs text-muted-foreground">
            Tool calls executed before the prompt. Results injected as context.
          </Span>
        </Div>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {preCalls.length}
        </Badge>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </Div>

      {isExpanded && (
        <Div className="border-t flex flex-col gap-3 p-4">
          {preCalls.map((call, index) => (
            <PreCallRow
              key={index}
              call={call}
              index={index}
              toolOptions={toolOptions}
              locale={locale}
              user={user}
              onRouteIdChange={handleRouteIdChange}
              onRemove={handleRemove}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleAdd}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Pre-Call
          </Button>
        </Div>
      )}
    </Div>
  );
}

// ─── Main Widget ────────────────────────────────────────────────────────────

export function AiRunWidget({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const t = useWidgetTranslation<typeof definition.POST>();

  // ── Tools cascade: user settings → character → form (explicit) ───────────
  const characterId = form.watch("character") ?? undefined;
  const characterEndpoint = useCharacter(characterId, user, logger);
  const characterData = characterEndpoint.read?.data;

  const settingsOps = useChatSettings(user, logger);
  const settingsData = settingsOps.settings;

  // Fallback tools: character overrides settings, form overrides character
  const fallbackAllowedTools: ToolEntry[] | null =
    characterData?.allowedTools ?? settingsData?.allowedTools ?? null;
  const fallbackPinnedTools: ToolEntry[] | null =
    characterData?.pinnedTools ?? settingsData?.pinnedTools ?? null;

  // Fetch available tools from help endpoint (same as execute-tool)
  const helpState = useEndpoint(
    helpDefinitions,
    {
      read: {
        initialState: { pageSize: 500 },
        queryOptions: {
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000,
        },
      },
    },
    logger,
    user,
  );

  const toolOptions = useMemo((): AutocompleteOption<string>[] => {
    const response = helpState?.read?.response;
    if (!response || response.success !== true) {
      return [];
    }
    return response.data.tools.map((tool) => {
      const alias = tool.aliases?.[0];
      const label = alias ?? tool.toolName;
      return {
        value: tool.toolName,
        label,
        description: tool.description,
        category: tool.category,
      };
    });
  }, [helpState?.read?.response]);

  // Pre-calls form integration
  const preCalls: PreCall[] = form.watch("preCalls") ?? [];
  const handlePreCallsChange = useCallback(
    (calls: PreCall[]): void => {
      form.setValue("preCalls", calls.length > 0 ? calls : undefined, {
        shouldDirty: true,
      });
    },
    [form],
  );

  // Tools config integration
  const allowedTools: ToolEntry[] | null = form.watch("allowedTools") ?? null;
  const tools: ToolEntry[] | null = form.watch("tools") ?? null;

  const handleToolsChange = useCallback(
    ({
      allowedTools: newAllowed,
      pinnedTools: newPinned,
    }: {
      allowedTools: ToolEntry[] | null;
      pinnedTools: ToolEntry[] | null;
    }): void => {
      form.setValue("allowedTools", newAllowed, { shouldDirty: true });
      form.setValue("tools", newPinned, { shouldDirty: true });
    },
    [form],
  );

  const responseData = field.value;

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <Div className="flex-1">
          <Span className="text-base font-semibold">
            {t("run.post.container.title")}
          </Span>
        </Div>
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "run.post.success.title",
            loadingText: "run.post.success.description",
            icon: "sparkles",
            variant: "primary",
          }}
        />
      </Div>

      {/* Scrollable Form */}
      <Div className="overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
        <FormAlertWidget field={{}} />

        <Div className="flex flex-col gap-4 mt-2">
          {/* Model & Character row */}
          <Div className="grid grid-cols-2 gap-4">
            <SelectFieldWidget fieldName="model" field={children.model} />
            <TextFieldWidget fieldName="character" field={children.character} />
          </Div>

          {/* Prompt */}
          <TextareaFieldWidget fieldName="prompt" field={children.prompt} />

          {/* Instructions */}
          <TextareaFieldWidget
            fieldName="instructions"
            field={children.instructions}
          />

          {/* Pre-Calls with inline endpoint rendering */}
          <PreCallsEditor
            preCalls={preCalls}
            onChange={handlePreCallsChange}
            toolOptions={toolOptions}
            locale={locale}
            user={user}
          />

          {/* Allowed Tools & In-Context Tools */}
          {form && (
            <ToolsConfigEdit
              value={{
                allowedTools,
                pinnedTools: tools,
              }}
              onChange={handleToolsChange}
              user={user}
              logger={logger}
              label="Allowed to execute + pinned to context"
              characterAllowedTools={fallbackAllowedTools}
              characterPinnedTools={fallbackPinnedTools}
            />
          )}

          {/* Max Turns & Thread ID */}
          <Div className="grid grid-cols-2 gap-4">
            <NumberFieldWidget fieldName="maxTurns" field={children.maxTurns} />
            <TextFieldWidget
              fieldName="appendThreadId"
              field={children.appendThreadId}
            />
          </Div>

          {/* Folder settings */}
          <Div className="grid grid-cols-2 gap-4">
            <SelectFieldWidget
              fieldName="rootFolderId"
              field={children.rootFolderId}
            />
            <TextFieldWidget
              fieldName="subFolderId"
              field={children.subFolderId}
            />
          </Div>

          {/* ── Response section ────────────────────────────────────────── */}
          {responseData && (
            <Div className="border-t pt-4 flex flex-col gap-3">
              <Span className="text-sm font-semibold text-muted-foreground">
                Response
              </Span>

              <TextWidget
                fieldName="text"
                field={withValue(
                  children.text,
                  responseData.text,
                  responseData,
                )}
              />

              <Div className="grid grid-cols-2 gap-4">
                <TextWidget
                  fieldName="promptTokens"
                  field={withValue(
                    children.promptTokens,
                    responseData.promptTokens,
                    responseData,
                  )}
                />
                <TextWidget
                  fieldName="completionTokens"
                  field={withValue(
                    children.completionTokens,
                    responseData.completionTokens,
                    responseData,
                  )}
                />
              </Div>

              <Div className="grid grid-cols-2 gap-4">
                <TextWidget
                  fieldName="threadId"
                  field={withValue(
                    children.threadId,
                    responseData.threadId,
                    responseData,
                  )}
                />
                <TextWidget
                  fieldName="lastAiMessageId"
                  field={withValue(
                    children.lastAiMessageId,
                    responseData.lastAiMessageId,
                    responseData,
                  )}
                />
              </Div>

              <Div className="grid grid-cols-2 gap-4">
                <TextWidget
                  fieldName="threadTitle"
                  field={withValue(
                    children.threadTitle,
                    responseData.threadTitle,
                    responseData,
                  )}
                />
                <TextWidget
                  fieldName="threadCreatedAt"
                  field={withValue(
                    children.threadCreatedAt,
                    responseData.threadCreatedAt,
                    responseData,
                  )}
                />
              </Div>
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
}
