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

  // Map color names to RGB values for inline styles
  const colorMap: Record<string, { r: number; g: number; b: number }> = {
    sky: { r: 14, g: 165, b: 233 }, // sky-500
    purple: { r: 168, g: 85, b: 247 }, // purple-500
    teal: { r: 20, g: 184, b: 166 }, // teal-500
    amber: { r: 245, g: 158, b: 11 }, // amber-500
    blue: { r: 59, g: 130, b: 246 }, // blue-500
  };

  const rgb = colorMap[color] || colorMap.blue;

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
        <Div
          style={{
            maxWidth: "48rem",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
            paddingTop: "5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Folder icon */}
          <Div
            style={{
              width: "5rem",
              height: "5rem",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
              backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
            }}
          >
            <Div
              style={{
                fontSize: "2.25rem",
                color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
              }}
            >
              {React.createElement(
                getIconComponent(folderConfig?.icon || "message-circle"),
              )}
            </Div>
          </Div>

          {/* Title and description */}
          <H1
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            {getTitle()}
          </H1>
          <P
            style={{
              color: "var(--muted-foreground)",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            {getDescription()}
          </P>

          {/* Horizontal persona selector */}
          <Div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              justifyContent: "center",
              marginBottom: "1.5rem",
              width: "100%",
            }}
          >
            {getDisplayedPersonas().map((persona) => (
              <Button
                key={persona.id}
                onClick={(): void => handlePersonaClick(persona)}
                variant="ghost"
                size="sm"
                style={
                  selectedPersona.id === persona.id
                    ? {
                        display: "flex",
                        gap: "0.5rem",
                        backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
                        borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }
                    : {
                        display: "flex",
                        gap: "0.5rem",
                        borderColor: "transparent",
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }
                }
              >
                <Div style={{ fontSize: "1rem" }}>
                  {React.createElement(getIconComponent(persona.icon))}
                </Div>
                <span style={{ fontSize: "0.875rem" }}>{t(persona.name)}</span>
              </Button>
            ))}

            {/* More button - opens modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    borderColor: "transparent",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                >
                  <Div style={{ height: "1rem", width: "1rem" }}>
                    <MoreHorizontal />
                  </Div>
                  <span style={{ fontSize: "0.875rem" }}>
                    {t("app.chat.suggestedPrompts.more")}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent style={{ maxWidth: "48rem", maxHeight: "85vh" }}>
                <DialogHeader>
                  <DialogTitle>
                    {t("app.chat.suggestedPrompts.selectPersona")}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea style={{ height: "70vh", paddingRight: "1rem" }}>
                  <Div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
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
                          style={
                            selectedPersona.id === persona.id
                              ? {
                                  borderRadius: "0.5rem",
                                  border: "1px solid",
                                  transition: "all 0.2s",
                                  borderColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                                  backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`,
                                }
                              : {
                                  borderRadius: "0.5rem",
                                  border: "1px solid var(--border)",
                                  transition: "all 0.2s",
                                }
                          }
                        >
                          {/* Header - clickable to select persona */}
                          <Button
                            onClick={(): void => handlePersonaSelect(persona)}
                            variant="ghost"
                            size="unset"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "1rem",
                              borderRadius: "0.5rem",
                            }}
                          >
                            <Div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "1rem",
                                width: "100%",
                              }}
                            >
                              <Div
                                style={{
                                  fontSize: "1.875rem",
                                  flexShrink: 0,
                                }}
                              >
                                {React.createElement(
                                  getIconComponent(persona.icon),
                                )}
                              </Div>
                              <Div style={{ flex: 1, minWidth: 0 }}>
                                <H3
                                  style={{
                                    fontSize: "1.125rem",
                                    fontWeight: 600,
                                    marginBottom: "0.25rem",
                                  }}
                                >
                                  {t(persona.name)}
                                </H3>
                                <P
                                  style={{
                                    fontSize: "0.875rem",
                                    color: "var(--muted-foreground)",
                                  }}
                                >
                                  {t(persona.description)}
                                </P>
                                {/* Category and Model badges */}
                                <Div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "0.5rem",
                                    marginTop: "0.5rem",
                                  }}
                                >
                                  {categoryConfig && (
                                    <Div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.375rem",
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "0.375rem",
                                        backgroundColor: "var(--muted)",
                                        opacity: 0.5,
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      <Div style={{ fontSize: "0.875rem" }}>
                                        {React.createElement(
                                          getIconComponent(categoryConfig.icon),
                                        )}
                                      </Div>
                                      <Span>{t(categoryConfig.name)}</Span>
                                    </Div>
                                  )}
                                  {modelConfig && (
                                    <Div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.375rem",
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "0.375rem",
                                        backgroundColor: "var(--muted)",
                                        opacity: 0.5,
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      <Div style={{ fontSize: "0.875rem" }}>
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
                          <Div
                            style={{
                              paddingLeft: "1rem",
                              paddingRight: "1rem",
                              paddingBottom: "0.5rem",
                            }}
                          >
                            <Button
                              onClick={(): void => toggleExpanded(persona.id)}
                              variant="ghost"
                              size="sm"
                              style={{
                                width: "100%",
                                justifyContent: "flex-start",
                                fontSize: "0.75rem",
                                gap: "0.5rem",
                                height: "2rem",
                              }}
                            >
                              <Div
                                style={{
                                  height: "0.875rem",
                                  width: "0.875rem",
                                  flexShrink: 0,
                                }}
                              >
                                {React.createElement(
                                  isExpanded ? ChevronUp : ChevronDown,
                                )}
                              </Div>
                              <Span
                                style={{ color: "var(--muted-foreground)" }}
                              >
                                {isExpanded
                                  ? t("app.chat.suggestedPrompts.hideDetails")
                                  : t("app.chat.suggestedPrompts.showDetails")}
                              </Span>
                            </Button>
                          </Div>

                          {/* Expanded details */}
                          {isExpanded && (
                            <Div
                              style={{
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                paddingBottom: "1rem",
                                paddingTop: "0.5rem",
                                borderTop: "1px solid var(--border)",
                              }}
                            >
                              <Div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "1rem",
                                }}
                              >
                                {/* System Prompt with Markdown */}
                                {persona.systemPrompt && (
                                  <Div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <Span
                                      style={{
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {t(
                                        "app.chat.suggestedPrompts.systemPromptLabel",
                                      )}
                                    </Span>
                                    <Div
                                      style={{
                                        maxWidth: "none",
                                        backgroundColor: "var(--muted)",
                                        opacity: 0.3,
                                        padding: "0.75rem",
                                        borderRadius: "0.375rem",
                                        border: "1px solid var(--border)",
                                      }}
                                    >
                                      <Markdown
                                        content={persona.systemPrompt}
                                      />
                                    </Div>
                                  </Div>
                                )}

                                {/* Suggested Prompts - Same style as outside modal */}
                                {persona.suggestedPrompts &&
                                  persona.suggestedPrompts.length > 0 && (
                                    <Div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.5rem",
                                      }}
                                    >
                                      <Span
                                        style={{
                                          fontSize: "0.875rem",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {t(
                                          "app.chat.suggestedPrompts.suggestedPromptsLabel",
                                        )}
                                      </Span>
                                      <Div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "0.5rem",
                                        }}
                                      >
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
                                              style={{
                                                width: "100%",
                                                textAlign: "left",
                                                padding: "0.75rem",
                                                borderRadius: "0.5rem",
                                                transition: "all 0.2s",
                                                border:
                                                  "1px solid var(--border)",
                                                fontSize: "0.875rem",
                                              }}
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
          <Div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {(selectedPersona.suggestedPrompts || [])
              .slice(0, 4)
              .map((promptKey, idx) => (
                <Button
                  key={idx}
                  onClick={(): void => handlePromptClick(promptKey)}
                  variant="ghost"
                  size="unset"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <span style={{ fontSize: "0.875rem" }}>{t(promptKey)}</span>
                </Button>
              ))}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
