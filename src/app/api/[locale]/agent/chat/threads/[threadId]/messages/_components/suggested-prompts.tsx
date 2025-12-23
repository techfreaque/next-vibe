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
import { ChevronDown, ChevronUp, MoreHorizontal } from "next-vibe-ui/ui/icons";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H3 } from "next-vibe-ui/ui/typography";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React, { useState } from "react";

import {
  CategoryOptions,
  type Character,
  DEFAULT_CHARACTERS,
} from "@/app/api/[locale]/agent/chat/characters/config";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import { getModelById } from "@/app/api/[locale]/agent/chat/model-access/models";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

interface SuggestedPromptsProps {
  locale: CountryLanguage;
}

// Get first 5 characters for tabs
const FEATURED_CHARACTERS = DEFAULT_CHARACTERS.slice(0, 5);

export function SuggestedPrompts({
  locale,
}: SuggestedPromptsProps): JSX.Element {
  // Get callbacks and state from context
  const {
    handleFillInputWithPrompt: onSelectPrompt,
    currentRootFolderId: rootFolderId,
  } = useChatContext();

  const { t } = simpleT(locale);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(
    FEATURED_CHARACTERS[0],
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedCharacterId, setExpandedCharacterId] = useState<string | null>(
    null,
  );

  const handleCharacterSelect = (character: Character): void => {
    setSelectedCharacter(character);
    setModalOpen(false);
  };

  const handlePromptClick = (prompt: string): void => {
    onSelectPrompt(
      prompt,
      selectedCharacter.id,
      selectedCharacter.preferredModel,
    );
  };

  const toggleExpanded = (characterId: string): void => {
    setExpandedCharacterId((prev) =>
      prev === characterId ? null : characterId,
    );
  };

  const prompts = selectedCharacter.suggestedPrompts || [];

  // Get title based on root folder
  const getTitleKey = (): TranslationKey => {
    switch (rootFolderId) {
      case "private":
        return "app.chat.suggestedPrompts.privateTitle";
      case "shared":
        return "app.chat.suggestedPrompts.sharedTitle";
      case "public":
        return "app.chat.suggestedPrompts.publicTitle";
      case "incognito":
        return "app.chat.suggestedPrompts.incognitoTitle";
      default:
        return "app.chat.suggestedPrompts.title";
    }
  };

  // Get description based on root folder
  const getDescriptionKey = (): TranslationKey => {
    switch (rootFolderId) {
      case "private":
        return "app.chat.suggestedPrompts.privateDescription";
      case "shared":
        return "app.chat.suggestedPrompts.sharedDescription";
      case "public":
        return "app.chat.suggestedPrompts.publicDescription";
      case "incognito":
        return "app.chat.suggestedPrompts.incognitoDescription";
      default:
        return "app.chat.suggestedPrompts.title";
    }
  };

  return (
    <Div className="w-full flex flex-col gap-6 sm:gap-8">
      <Div className="text-center flex flex-col gap-2">
        <H1 className="text-3xl sm:text-4xl font-semibold text-center">
          {t(getTitleKey())}
        </H1>
        <P className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto text-center">
          {t(getDescriptionKey())}
        </P>
      </Div>

      {/* Character Tabs */}
      <Div className="flex flex-row gap-2 justify-center flex-wrap">
        {FEATURED_CHARACTERS.map((character) => (
          <Button
            key={character.id}
            onClick={(): void => handleCharacterSelect(character)}
            variant="ghost"
            size="unset"
            className={`px-3 sm:px-4 py-2 rounded-full transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer ${
              selectedCharacter.id === character.id
                ? "bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                : "hover:bg-accent border border-transparent"
            }`}
          >
            {React.createElement(getIconComponent(character.icon), {
              className: "text-base sm:text-lg",
            })}
            <Span className="font-medium hidden sm:inline">
              {character.name}
            </Span>
          </Button>
        ))}

        {/* More button - opens modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="unset"
              className="px-3 sm:px-4 py-2 rounded-full transition-all flex items-center gap-2 hover:bg-accent border border-transparent text-sm sm:text-base cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
              <Span className="font-medium hidden sm:inline">
                {t("app.chat.suggestedPrompts.more")}
              </Span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle>
                {t("app.chat.suggestedPrompts.selectCharacter")}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[70vh] pr-4">
              <Div className="flex flex-col gap-4">
                {DEFAULT_CHARACTERS.map((character: Character) => {
                  const isExpanded = expandedCharacterId === character.id;
                  const categoryConfig = CategoryOptions.find(
                    (cat) => cat.value === character.category,
                  );
                  const modelConfig = character.preferredModel
                    ? getModelById(character.preferredModel)
                    : null;

                  return (
                    <Div
                      key={character.id}
                      className={`rounded-lg border transition-all ${
                        selectedCharacter.id === character.id
                          ? "border-purple-500 bg-purple-500/5"
                          : "border-border hover:border-purple-500/50"
                      }`}
                    >
                      {/* Header - clickable to select character */}
                      <Button
                        onClick={(): void => handleCharacterSelect(character)}
                        variant="ghost"
                        size="unset"
                        className="w-full text-left p-4 hover:bg-accent/50 rounded-lg"
                      >
                        <Div className="flex items-start gap-4 w-full">
                          {React.createElement(
                            getIconComponent(character.icon),
                            {
                              className: "text-3xl shrink-0",
                            },
                          )}
                          <Div className="flex-1 min-w-0">
                            <H3 className="text-lg font-semibold mb-1">
                              {t(character.name)}
                            </H3>
                            <P className="text-sm text-muted-foreground">
                              {t(character.description)}
                            </P>
                            {/* Category and Model badges */}
                            <Div className="flex flex-wrap gap-2 mt-2">
                              {categoryConfig && (
                                <Div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs">
                                  {React.createElement(
                                    getIconComponent(categoryConfig.icon),
                                    {
                                      className: "text-sm",
                                    },
                                  )}
                                  <Span>{t(categoryConfig.label)}</Span>
                                </Div>
                              )}
                              {modelConfig && (
                                <Div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs">
                                  {React.createElement(
                                    getIconComponent(modelConfig.icon),
                                    {
                                      className: "text-sm",
                                    },
                                  )}
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
                          onClick={(): void => toggleExpanded(character.id)}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-xs gap-2 h-8"
                        >
                          {React.createElement(
                            isExpanded ? ChevronUp : ChevronDown,
                            {
                              className: "h-3.5 w-3.5 shrink-0",
                            },
                          )}
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
                            {character.systemPrompt && (
                              <Div className="flex flex-col gap-2">
                                <Span className="text-sm font-semibold">
                                  {t(
                                    "app.chat.suggestedPrompts.systemPromptLabel",
                                  )}
                                </Span>
                                <Div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 p-3 rounded-md border border-border">
                                  <Markdown content={character.systemPrompt} />
                                </Div>
                              </Div>
                            )}

                            {/* Suggested Prompts - Same style as outside modal */}
                            {character.suggestedPrompts &&
                              character.suggestedPrompts.length > 0 && (
                                <Div className="flex flex-col gap-2">
                                  <Span className="text-sm font-semibold">
                                    {t(
                                      "app.chat.suggestedPrompts.suggestedPromptsLabel",
                                    )}
                                  </Span>
                                  <Div className="flex flex-col gap-2">
                                    {character.suggestedPrompts.map(
                                      (promptKey, idx) => (
                                        <Button
                                          key={idx}
                                          onClick={(): void => {
                                            handlePromptClick(t(promptKey));
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

      {/* Suggested Prompts for selected character */}
      <Div className="flex flex-col gap-3">
        {prompts.length > 0 ? (
          prompts.map((prompt, index) => (
            <Button
              key={index}
              onClick={(): void => handlePromptClick(prompt)}
              variant="ghost"
              size="unset"
              className="w-full text-left p-3 sm:p-4 rounded-lg hover:bg-accent transition-all border border-border cursor-pointer text-sm sm:text-base"
            >
              {prompt}
            </Button>
          ))
        ) : (
          <P className="text-center text-muted-foreground py-8">
            {t("app.chat.suggestedPrompts.noPrompts")}
          </P>
        )}
      </Div>
    </Div>
  );
}
