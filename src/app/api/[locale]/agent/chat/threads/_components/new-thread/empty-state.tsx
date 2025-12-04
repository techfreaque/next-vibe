"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { H1, H3, P } from "next-vibe-ui/ui/typography";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Span } from "next-vibe-ui/ui/span";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { ChevronDown, ChevronUp, MoreHorizontal } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useState } from "react";
import { envClient } from "@/config/env-client";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import { DOM_IDS, LAYOUT } from "@/app/[locale]/chat/lib/config/constants";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import {
  DEFAULT_PERSONAS,
  DEFAULT_CATEGORIES,
  type Persona,
} from "@/app/api/[locale]/agent/chat/personas/config";
import { getDefaultFolderConfig } from "@/app/api/[locale]/agent/chat/config";
import { getModelById } from "@/app/api/[locale]/agent/chat/model-access/models";

interface ChatEmptyStateProps {
  locale: CountryLanguage;
  inputHeight: number;
}

/**
 * Empty state display for new threads.
 * Centered layout with folder-specific colors.
 */
export function ChatEmptyState({
  locale,
  inputHeight,
}: ChatEmptyStateProps): JSX.Element {
  const { t } = simpleT(locale);
  const {
    currentRootFolderId: rootFolderId,
    handleFillInputWithPrompt,
    selectedPersona: selectedPersonaId,
    setSelectedPersona: setSelectedPersonaId,
    handleModelChange,
  } = useChatContext();

  // Get the actual persona object from the ID
  const selectedPersona: Persona =
    DEFAULT_PERSONAS.find((p) => p.id === selectedPersonaId) ||
    DEFAULT_PERSONAS[0];

  const [modalOpen, setModalOpen] = useState(false);
  const [expandedPersonaId, setExpandedPersonaId] = useState<string | null>(
    null,
  );

  const folderConfig = getDefaultFolderConfig(rootFolderId);
  const color = folderConfig?.color || "blue";

  // Map color names to Tailwind classes
  const getColorClasses = (
    variant: "bg" | "border" | "text" | "hover-bg",
  ): string => {
    const colorMap: Record<
      string,
      Record<"bg" | "border" | "text" | "hover-bg", string>
    > = {
      sky: {
        bg: "bg-sky-500/20",
        border: "border-sky-500/50",
        text: "text-sky-500",
        "hover-bg": "hover:bg-sky-500/10",
      },
      purple: {
        bg: "bg-purple-500/20",
        border: "border-purple-500/50",
        text: "text-purple-500",
        "hover-bg": "hover:bg-purple-500/10",
      },
      teal: {
        bg: "bg-teal-500/20",
        border: "border-teal-500/50",
        text: "text-teal-500",
        "hover-bg": "hover:bg-teal-500/10",
      },
      amber: {
        bg: "bg-amber-500/20",
        border: "border-amber-500/50",
        text: "text-amber-500",
        "hover-bg": "hover:bg-amber-500/10",
      },
      blue: {
        bg: "bg-blue-500/20",
        border: "border-blue-500/50",
        text: "text-blue-500",
        "hover-bg": "hover:bg-blue-500/10",
      },
    };

    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  // Get personas to display in tabs - always include selected persona
  const getDisplayedPersonas = (): Persona[] => {
    const firstSix = DEFAULT_PERSONAS.slice(0, 6);
    const selectedIsInFirstSix = firstSix.some(
      (p) => p.id === selectedPersona.id,
    );

    if (selectedIsInFirstSix) {
      return firstSix;
    }

    // Replace the last one with the selected persona
    return [...firstSix.slice(0, 5), selectedPersona];
  };

  const handlePersonaClick = (persona: Persona): void => {
    setSelectedPersonaId(persona.id);
    // If persona has a preferred model, switch to it
    if (persona.preferredModel) {
      handleModelChange(persona.preferredModel);
    }
  };

  const handlePersonaSelect = (persona: Persona): void => {
    setSelectedPersonaId(persona.id);
    // If persona has a preferred model, switch to it
    if (persona.preferredModel) {
      handleModelChange(persona.preferredModel);
    }
    setModalOpen(false);
  };

  const handlePromptClick = (
    promptKey: TranslationKey,
    persona?: Persona,
  ): void => {
    const prompt = t(promptKey);
    const personaToUse = persona || selectedPersona;

    // Update persona and model when clicking a prompt
    setSelectedPersonaId(personaToUse.id);
    if (personaToUse.preferredModel) {
      handleModelChange(personaToUse.preferredModel);
    }

    handleFillInputWithPrompt(
      prompt,
      personaToUse.id,
      personaToUse.preferredModel,
    );
  };

  const toggleExpanded = (personaId: string): void => {
    setExpandedPersonaId((prev) => (prev === personaId ? null : personaId));
  };

  const getTitle = (): string => {
    switch (rootFolderId) {
      case "private":
        return t("app.chat.suggestedPrompts.privateTitle");
      case "shared":
        return t("app.chat.suggestedPrompts.sharedTitle");
      case "incognito":
        return t("app.chat.suggestedPrompts.incognitoTitle");
      case "public":
        return t("app.chat.suggestedPrompts.publicTitle");
      default:
        return t("app.chat.suggestedPrompts.title");
    }
  };

  const getDescription = (): string => {
    switch (rootFolderId) {
      case "private":
        return t("app.chat.suggestedPrompts.privateDescription");
      case "shared":
        return t("app.chat.suggestedPrompts.sharedDescription");
      case "incognito":
        return t("app.chat.suggestedPrompts.incognitoDescription");
      case "public":
        return t("app.chat.suggestedPrompts.publicDescription");
      default:
        return "";
    }
  };

  return (
    <Div
      className="h-screen h-max-screen overflow-y-auto"
      id={DOM_IDS.MESSAGES_CONTAINER}
    >
      <Div
        style={
          envClient.platform.isReactNative
            ? { paddingBottom: LAYOUT.MESSAGES_BOTTOM_PADDING }
            : {
                paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
              }
        }
      >
        <Div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10 pt-20 flex flex-col items-center">
          {/* Folder icon */}
          <Div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${getColorClasses("bg").replace("/20", "/10")}`}
          >
            <Div className={`text-4xl ${getColorClasses("text")}`}>
              {React.createElement(
                getIconComponent(folderConfig?.icon || "message-circle"),
              )}
            </Div>
          </Div>

          {/* Title and description */}
          <H1 className="text-3xl font-bold mb-2 text-center">{getTitle()}</H1>
          <P className="text-muted-foreground text-center mb-8">
            {getDescription()}
          </P>

          {/* Horizontal persona selector */}
          <Div className="flex flex-wrap gap-2 justify-center mb-6 w-full">
            {getDisplayedPersonas().map((persona) => (
              <Button
                key={persona.id}
                onClick={(): void => handlePersonaClick(persona)}
                variant="ghost"
                size="sm"
                className={`flex gap-2 border ${
                  selectedPersona.id === persona.id
                    ? `${getColorClasses("bg")} ${getColorClasses("border")}`
                    : "border-transparent"
                }`}
              >
                <Div className="text-base">
                  {React.createElement(getIconComponent(persona.icon))}
                </Div>
                <span className="text-sm">{t(persona.name)}</span>
              </Button>
            ))}

            {/* More button - opens modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex gap-2 border border-transparent"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="text-sm">
                    {t("app.chat.suggestedPrompts.more")}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[85vh]">
                <DialogHeader>
                  <DialogTitle>
                    {t("app.chat.suggestedPrompts.selectPersona")}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[70vh] pr-4">
                  <Div className="flex flex-col gap-4">
                    {DEFAULT_PERSONAS.map((persona: Persona) => {
                      const isExpanded = expandedPersonaId === persona.id;
                      const categoryConfig = DEFAULT_CATEGORIES.find(
                        (cat) => cat.id === persona.category,
                      );
                      const modelConfig = persona.preferredModel
                        ? getModelById(persona.preferredModel)
                        : null;

                      return (
                        <Div
                          key={persona.id}
                          className={`rounded-lg border transition-all ${
                            selectedPersona.id === persona.id
                              ? `${getColorClasses("border").replace("/50", "")} ${getColorClasses("bg").replace("/20", "/5")}`
                              : ""
                          }`}
                        >
                          {/* Header - clickable to select persona */}
                          <Button
                            onClick={(): void => handlePersonaSelect(persona)}
                            variant="ghost"
                            size="unset"
                            className="w-full text-left p-4 rounded-lg"
                          >
                            <Div className="flex items-start gap-4 w-full">
                              <Div className="text-3xl shrink-0">
                                {React.createElement(
                                  getIconComponent(persona.icon),
                                )}
                              </Div>
                              <Div className="flex-1 min-w-0">
                                <H3 className="text-lg font-semibold mb-1">
                                  {t(persona.name)}
                                </H3>
                                <P className="text-sm text-muted-foreground">
                                  {t(persona.description)}
                                </P>
                                {/* Category and Model badges */}
                                <Div className="flex flex-wrap gap-2 mt-2">
                                  {categoryConfig && (
                                    <Div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs">
                                      <Div className="text-sm">
                                        {React.createElement(
                                          getIconComponent(categoryConfig.icon),
                                        )}
                                      </Div>
                                      <Span>{t(categoryConfig.name)}</Span>
                                    </Div>
                                  )}
                                  {modelConfig && (
                                    <Div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs">
                                      <Div className="text-sm">
                                        {React.createElement(
                                          getIconComponent(modelConfig.icon),
                                        )}
                                      </Div>
                                      <Span>{modelConfig.name}</Span>
                                    </Div>
                                  )}
                                </Div>
                              </Div>
                            </Div>
                          </Button>

                          {/* Toggle button for more details */}
                          <Div className="px-4 pb-2">
                            <Button
                              onClick={(): void => toggleExpanded(persona.id)}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs gap-2 h-8"
                            >
                              <Div className="h-3.5 w-3.5 shrink-0">
                                {React.createElement(
                                  isExpanded ? ChevronUp : ChevronDown,
                                )}
                              </Div>
                              <Span className="text-muted-foreground">
                                {isExpanded
                                  ? t("app.chat.suggestedPrompts.hideDetails")
                                  : t("app.chat.suggestedPrompts.showDetails")}
                              </Span>
                            </Button>
                          </Div>

                          {/* Expanded details */}
                          {isExpanded && (
                            <Div className="px-4 pb-4 pt-2 border-t border-border">
                              <Div className="flex flex-col gap-4">
                                {/* System Prompt with Markdown */}
                                {persona.systemPrompt && (
                                  <Div className="flex flex-col gap-2">
                                    <Span className="text-sm font-semibold">
                                      {t(
                                        "app.chat.suggestedPrompts.systemPromptLabel",
                                      )}
                                    </Span>
                                    <Div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 p-3 rounded-md border border-border">
                                      <Markdown
                                        content={persona.systemPrompt}
                                      />
                                    </Div>
                                  </Div>
                                )}

                                {/* Suggested Prompts - Same style as outside modal */}
                                {persona.suggestedPrompts &&
                                  persona.suggestedPrompts.length > 0 && (
                                    <Div className="flex flex-col gap-2">
                                      <Span className="text-sm font-semibold">
                                        {t(
                                          "app.chat.suggestedPrompts.suggestedPromptsLabel",
                                        )}
                                      </Span>
                                      <Div className="flex flex-col gap-2">
                                        {persona.suggestedPrompts.map(
                                          (promptKey, idx) => (
                                            <Button
                                              key={idx}
                                              onClick={(): void => {
                                                handlePromptClick(
                                                  promptKey,
                                                  persona,
                                                );
                                                setModalOpen(false);
                                              }}
                                              variant="ghost"
                                              size="unset"
                                              className="w-full text-left p-3 rounded-lg hover:bg-accent transition-all border border-border text-sm"
                                            >
                                              {t(promptKey)}
                                            </Button>
                                          ),
                                        )}
                                      </Div>
                                    </Div>
                                  )}
                              </Div>
                            </Div>
                          )}
                        </Div>
                      );
                    })}
                  </Div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </Div>

          {/* Selected persona prompts */}
          <Div className="w-full space-y-2">
            {(selectedPersona.suggestedPrompts || [])
              .slice(0, 4)
              .map((promptKey, idx) => (
                <Button
                  key={idx}
                  onClick={(): void => handlePromptClick(promptKey)}
                  variant="ghost"
                  size="unset"
                  className={`w-full p-4 border ${getColorClasses("border").replace("/50", "/20")} ${getColorClasses("hover-bg")}`}
                >
                  <span className="text-sm">{t(promptKey)}</span>
                </Button>
              ))}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
