/**
 * AI Agent Run Widget
 *
 * Custom widget for the AI Agent Run endpoint.
 * Uses shared AiFormView for chat-like layout + AiResultView for disabled mode.
 * Adds ai-run-specific: pre-calls, tools config, instructions.
 */

/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import type { AutocompleteOption } from "next-vibe-ui/ui/autocomplete-field";
import { AutocompleteField } from "next-vibe-ui/ui/autocomplete-field";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div, type DivRefObject } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import helpDefinitions from "@/app/api/[locale]/system/help/definition";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useApiMutation } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { getFullPath } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import type { CountryLanguage } from "@/i18n/core/config";
import { scopedTranslation as runScopedTranslation } from "./i18n";

import { DefaultFolderId } from "../../chat/config";
import { ChatMessageRole } from "../../chat/enum";
import {
  ChatNavigationProvider,
  useChatNavigationStore,
} from "../../chat/hooks/use-chat-navigation-store";
import { useChatSettings } from "../../chat/settings/hooks";
import { useSkill } from "../../chat/skills/[id]/hooks";
import messagesDefinition from "../../chat/threads/[threadId]/messages/definition";
import { defaultModel, type ModelId } from "../../models/models";
import {
  type ToolEntry,
  ToolsConfigEdit,
} from "../../tools/widget/tools-config-widget";
import { InputHeightProvider } from "@/app/[locale]/chat/lib/config/constants";
import { platform } from "@/config/env-client";

import cancelEndpoints from "../cancel/definition";
import { WidgetChatInput } from "../stream/widget/chat-input";
import { EmbeddedMessagesView } from "../stream/widget/embedded-messages";
import type definition from "./definition";
import type {
  AiStreamRunPostRequestOutput,
  AiStreamRunPostResponseOutput,
} from "./definition";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useInputHeight(
  inputContainerRef: React.RefObject<DivRefObject | null>,
): number {
  const [inputHeight, setInputHeight] = useState<number>(120);

  useEffect(() => {
    if (platform.isReactNative) {
      return;
    }
    if (!inputContainerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setInputHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(inputContainerRef.current as Element);

    return (): void => {
      resizeObserver.disconnect();
    };
  }, [inputContainerRef]);

  return inputHeight;
}

// ─── Types ──────────────────────────────────────────────────────────────────

type PreCall = NonNullable<AiStreamRunPostRequestOutput["preCalls"]>[number];

interface CustomWidgetProps {
  field: {
    value: AiStreamRunPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

// ─── Hook to read thread ID from navigation store ────────────────────────────

function useAiRunThreadId(): string | null {
  return useChatNavigationStore((s) => s.activeThreadId);
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
  t,
}: {
  call: PreCall;
  index: number;
  toolOptions: AutocompleteOption[];
  locale: CountryLanguage;
  user: ReturnType<typeof useWidgetUser>;
  onRouteIdChange: (index: number, routeId: string) => void;
  onRemove: (index: number) => void;
  t: ReturnType<typeof runScopedTranslation.scopedT>["t"];
}): JSX.Element {
  const [resolvedEndpoint, setResolvedEndpoint] =
    useState<CreateApiEndpointAny | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);

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

  return (
    <Div className="rounded-lg border bg-muted/20 flex flex-col gap-2 overflow-hidden">
      <Div className="flex items-center gap-2 p-3 pb-0">
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
          #{index + 1}
        </Badge>
        <Div className="flex-1">
          <AutocompleteField
            value={call.routeId}
            onChange={(val) => onRouteIdChange(index, val)}
            options={toolOptions}
            placeholder={t("widget.selectEndpoint")}
            searchPlaceholder={t("widget.searchEndpoints")}
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
          <PreCallEndpointsPage
            method={method}
            resolvedEndpoint={resolvedEndpoint}
            locale={locale}
            user={user}
          />
        </Div>
      )}
    </Div>
  );
}

/** Memoized wrapper to stabilize the computed endpoint object */
const PreCallEndpointsPage = React.memo(function PreCallEndpointsPage({
  method,
  resolvedEndpoint,
  locale,
  user,
}: {
  method: string;
  resolvedEndpoint: CreateApiEndpointAny;
  locale: CountryLanguage;
  user: ReturnType<typeof useWidgetUser>;
}): JSX.Element {
  const endpoint = useMemo(
    () => ({ [method]: resolvedEndpoint }),
    [method, resolvedEndpoint],
  );
  return <EndpointsPage endpoint={endpoint} locale={locale} user={user} />;
});

// ─── Pre-Calls Editor ───────────────────────────────────────────────────────

function PreCallsEditor({
  preCalls,
  onChange,
  toolOptions,
  locale,
  user,
  t,
}: {
  preCalls: PreCall[];
  onChange: (calls: PreCall[]) => void;
  toolOptions: AutocompleteOption[];
  locale: CountryLanguage;
  user: ReturnType<typeof useWidgetUser>;
  t: ReturnType<typeof runScopedTranslation.scopedT>["t"];
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
              t={t}
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

// ─── Form mode (used in both active and disabled states) ─────────────────────

function AiRunFormView({ field }: CustomWidgetProps): JSX.Element {
  const { children } = field;
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const { t } = runScopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const isDisabled = useWidgetDisabled();
  const cancelMutation = useApiMutation(cancelEndpoints.POST, logger, user);

  const inputContainerRef = useRef<DivRefObject>(null);
  const inputHeight = useInputHeight(inputContainerRef);

  // ── Tools cascade: user settings → skill → form (explicit) ───────────
  const skillId = form.watch("skill") ?? undefined;
  const skillEndpoint = useSkill(skillId, user, logger);
  const skillData = skillEndpoint.read?.data;

  const settingsOps = useChatSettings(user, logger);
  const settingsData = settingsOps.settings;

  const fallbackAllowedTools: ToolEntry[] | null =
    skillData?.availableTools ?? settingsData?.availableTools ?? null;
  const fallbackPinnedTools: ToolEntry[] | null =
    skillData?.pinnedTools ?? settingsData?.pinnedTools ?? null;

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

  const toolOptions = useMemo((): AutocompleteOption[] => {
    const response = helpState?.read?.response;
    if (!response || response.success !== true) {
      return [];
    }
    return response.data.tools.map((tool) => {
      const alias = tool.aliases?.[0];
      const label = alias ?? tool.name;
      return {
        value: tool.name,
        label: t("widget.value", { value: label }),
        description: tool.description
          ? t("widget.value", { value: tool.description })
          : undefined,
        category: tool.category
          ? t("widget.value", { value: tool.category })
          : undefined,
      };
    });
  }, [helpState?.read?.response, t]);

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
  const availableTools = form.watch("availableTools") ?? null;
  const pinnedTools = form.watch("pinnedTools") ?? null;

  const toolsValue = useMemo(
    () => ({ availableTools, pinnedTools }),
    [availableTools, pinnedTools],
  );

  const handleToolsChange = useCallback(
    ({
      availableTools: newAllowed,
      pinnedTools: newPinned,
    }: {
      availableTools: ToolEntry[] | null;
      pinnedTools: ToolEntry[] | null;
    }): void => {
      form.setValue("availableTools", newAllowed, { shouldDirty: true });
      form.setValue("pinnedTools", newPinned, { shouldDirty: true });
    },
    [form],
  );

  const promptValue = form.watch("prompt") ?? "";
  const modelValue = form.watch("model") ?? defaultModel;
  const skillValue = form.watch("skill") ?? "";

  const handleContentChange = useCallback(
    (val: string) => form.setValue("prompt", val, { shouldDirty: true }),
    [form],
  );
  const handleModelChange = useCallback(
    (id: ModelId) => form.setValue("model", id, { shouldDirty: true }),
    [form],
  );
  const handleSkillChange = useCallback(
    (id: string) => form.setValue("skill", id, { shouldDirty: true }),
    [form],
  );
  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit]);

  const responseData = field.value;
  const contextThreadId = useAiRunThreadId();
  // Show messages from appendThreadId while submitting (before POST response arrives)
  const appendThreadId = form.watch("appendThreadId") ?? undefined;
  const displayThreadId =
    responseData?.threadId ??
    contextThreadId ??
    (isSubmitting ? appendThreadId : undefined);
  const rootFolderValue = form.watch("rootFolderId") ?? "cron";
  const threadHref = displayThreadId
    ? `/${locale}/threads/${rootFolderValue}/${displayThreadId}`
    : undefined;

  const handleCancel = useCallback(() => {
    const tid = displayThreadId;
    if (!tid) {
      return;
    }
    cancelMutation.mutate({ requestData: { threadId: tid } });
  }, [cancelMutation, displayThreadId]);

  const emptyField = useMemo(() => ({}), []);

  // Use mock messages when disabled and no real threadId in response.
  // When responseData.threadId exists, leave undefined so DB fetch fires.
  const mockMessagesInitialData = useMemo(() => {
    if (!isDisabled || !responseData?.text || responseData.threadId) {
      return undefined;
    }
    const now = new Date();
    const base = {
      threadId: "mock",
      parentId: null,
      sequenceId: null,
      authorId: null,
      authorName: null,
      skill: null,
      model: null,
      upvotes: 0,
      downvotes: 0,
      errorType: null,
      errorMessage: null,
      errorCode: null,
      searchVector: null,
      createdAt: now,
      updatedAt: now,
    };
    const userMsgId = "mock-user";
    const messages = [
      {
        ...base,
        id: userMsgId,
        role: ChatMessageRole.USER,
        content: promptValue,
        isAI: false,
        model: null,
        skill: null,
        metadata: {},
      },
      {
        ...base,
        id: responseData.lastAiMessageId ?? "mock-ai",
        role: ChatMessageRole.ASSISTANT,
        content: responseData.text,
        isAI: true,
        parentId: userMsgId,
        model: modelValue ?? null,
        skill: skillValue || null,
        metadata: {
          promptTokens: responseData.promptTokens ?? undefined,
          completionTokens: responseData.completionTokens ?? undefined,
        },
      },
    ];
    return { backgroundTasks: [], messages };
  }, [isDisabled, responseData, promptValue, modelValue, skillValue]);

  // When a real run completes, invalidate the messages cache so EmbeddedMessagesView refetches.
  const completedThreadId = isDisabled ? responseData?.threadId : undefined;
  useEffect(() => {
    if (!completedThreadId) {
      return;
    }
    void apiClient.refetchEndpoint(messagesDefinition.GET, logger, {
      urlPathParams: { threadId: completedThreadId },
      requestData: { rootFolderId: rootFolderValue },
    });
  }, [completedThreadId, rootFolderValue, logger]);

  return (
    <InputHeightProvider height={inputHeight}>
      <Div className="relative h-[600px]">
        <FormAlertWidget field={emptyField} />

        {/* Messages area - full height, scrollable, padded below floating input */}
        <Div className="h-full overflow-y-auto">
          <Div style={{ paddingBottom: `${inputHeight + 16}px` }}>
            {/* Loading state */}
            {isSubmitting && !displayThreadId && (
              <Div className="flex items-center justify-center h-full">
                <Div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
              </Div>
            )}

            {/* Response thread messages - real threadId OR mock incognito data */}
            {(displayThreadId ?? mockMessagesInitialData) && (
              <ChatNavigationProvider
                activeThreadId={displayThreadId ?? "mock"}
                currentRootFolderId={DefaultFolderId.PRIVATE}
                currentSubFolderId={null}
                leafMessageId={null}
                isEmbedded
              >
                <EmbeddedMessagesView
                  threadId={displayThreadId ?? "mock"}
                  rootFolderId={rootFolderValue}
                  locale={locale}
                  user={user}
                  className="rounded-lg bg-background"
                  refetchInterval={isSubmitting ? 2000 : false}
                  initialData={mockMessagesInitialData}
                />
              </ChatNavigationProvider>
            )}
          </Div>
        </Div>

        {/* Chat-like input - absolute overlay at bottom */}
        <Div
          ref={inputContainerRef}
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
        >
          <Div className="pointer-events-auto">
            <WidgetChatInput
              content={promptValue}
              onContentChange={handleContentChange}
              modelId={modelValue}
              skillId={skillValue}
              onModelChange={handleModelChange}
              onSkillChange={handleSkillChange}
              locale={locale}
              user={user}
              logger={logger}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting ?? false}
              disabled={isDisabled}
              threadHref={threadHref}
              onCancel={handleCancel}
              className="rounded-b-lg"
              advancedContent={
                <>
                  {/* Instructions */}
                  <TextareaFieldWidget
                    fieldName="instructions"
                    field={children.instructions}
                  />

                  {/* Pre-Calls */}
                  <PreCallsEditor
                    preCalls={preCalls}
                    onChange={handlePreCallsChange}
                    toolOptions={toolOptions}
                    locale={locale}
                    user={user}
                    t={t}
                  />

                  {/* Tools config */}
                  <ToolsConfigEdit
                    value={toolsValue}
                    onChange={handleToolsChange}
                    user={user}
                    logger={logger}
                    label="Allowed to execute + pinned to context"
                    skillAvailableTools={fallbackAllowedTools}
                    skillPinnedTools={fallbackPinnedTools}
                  />

                  {/* Max Turns & Thread ID */}
                  <Div className="grid grid-cols-2 gap-3">
                    <NumberFieldWidget
                      fieldName="maxTurns"
                      field={children.maxTurns}
                    />
                    <TextFieldWidget
                      fieldName="appendThreadId"
                      field={children.appendThreadId}
                    />
                  </Div>

                  {/* Folder settings */}
                  <Div className="grid grid-cols-2 gap-3">
                    <SelectFieldWidget
                      fieldName="rootFolderId"
                      field={children.rootFolderId}
                    />
                    <TextFieldWidget
                      fieldName="subFolderId"
                      field={children.subFolderId}
                    />
                  </Div>
                </>
              }
            />
          </Div>
        </Div>
      </Div>
    </InputHeightProvider>
  );
}

// ─── Main Widget (entry point) ───────────────────────────────────────────────

export function AiRunWidget({ field }: CustomWidgetProps): JSX.Element {
  const threadId = field.value?.threadId ?? null;
  return (
    <ChatNavigationProvider
      activeThreadId={threadId}
      currentRootFolderId={DefaultFolderId.PRIVATE}
      currentSubFolderId={null}
      leafMessageId={null}
    >
      <AiRunFormView field={field} />
    </ChatNavigationProvider>
  );
}
