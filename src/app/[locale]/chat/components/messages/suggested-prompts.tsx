"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { H1 } from "next-vibe-ui/ui/typography";
import { P } from "next-vibe-ui/ui/typography";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Span } from "next-vibe-ui/ui/span";
import { MoreHorizontal } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useState } from "react";

import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import { getIconComponent } from "@/app/api/[locale]/v1/core/agent/chat/model-access/icons";
import type { ModelId } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import {
  DEFAULT_PERSONAS,
  type Persona,
} from "@/app/api/[locale]/v1/core/agent/chat/personas/config";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

interface SuggestedPromptsProps {
  onSelectPrompt: (
    prompt: string,
    personaId: string,
    modelId?: ModelId,
  ) => void;
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
}

// Get first 5 personas for tabs
const FEATURED_PERSONAS = DEFAULT_PERSONAS.slice(0, 5);

export function SuggestedPrompts({
  onSelectPrompt,
  locale,
  rootFolderId = "private",
}: SuggestedPromptsProps): JSX.Element {
  const { t } = simpleT(locale);
  const [selectedPersona, setSelectedPersona] = useState<Persona>(
    FEATURED_PERSONAS[0],
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handlePersonaSelect = (persona: Persona): void => {
    setSelectedPersona(persona);
    setModalOpen(false);
  };

  const handlePromptClick = (prompt: string): void => {
    onSelectPrompt(prompt, selectedPersona.id, selectedPersona.preferredModel);
  };

  const prompts = selectedPersona.suggestedPrompts || [];

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
    <Div className="w-full space-y-6 sm:space-y-8">
      <Div className="text-center space-y-2">
        <H1 className="text-3xl sm:text-4xl font-semibold">
          {t(getTitleKey())}
        </H1>
        <P className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          {t(getDescriptionKey())}
        </P>
      </Div>

      {/* Persona Tabs */}
      <Div className="flex gap-2 justify-center flex-wrap">
        {FEATURED_PERSONAS.map((persona) => (
          <button
            key={persona.id}
            onClick={(): void => handlePersonaSelect(persona)}
            className={`px-3 sm:px-4 py-2 rounded-full transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer ${
              selectedPersona.id === persona.id
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                : "hover:bg-accent border border-transparent"
            }`}
          >
            {React.createElement(getIconComponent(persona.icon), {
              className: "text-base sm:text-lg",
            })}
            <Span className="font-medium hidden sm:inline">{persona.name}</Span>
          </button>
        ))}

        {/* More button - opens modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <button className="px-3 sm:px-4 py-2 rounded-full transition-all flex items-center gap-2 hover:bg-accent border border-transparent text-sm sm:text-base cursor-pointer">
              <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
              <Span className="font-medium hidden sm:inline">
                {t("app.chat.suggestedPrompts.more")}
              </Span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>
                {t("app.chat.suggestedPrompts.selectPersona")}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEFAULT_PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={(): void => handlePersonaSelect(persona)}
                    className={`p-4 rounded-lg border transition-all text-left cursor-pointer ${
                      selectedPersona.id === persona.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-border hover:border-purple-500/50 hover:bg-accent"
                    }`}
                  >
                    <Div className="flex items-center gap-3 mb-2">
                      {React.createElement(getIconComponent(persona.icon), {
                        className: "text-2xl",
                      })}
                      <Span className="font-semibold">{persona.name}</Span>
                    </Div>
                    {persona.description && (
                      <P className="text-sm text-muted-foreground">
                        {persona.description}
                      </P>
                    )}
                  </button>
                ))}
              </Div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </Div>

      {/* Suggested Prompts for selected persona */}
      <Div className="space-y-3">
        {prompts.length > 0 ? (
          prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={(): void => handlePromptClick(prompt)}
              className="w-full text-left p-3 sm:p-4 rounded-lg hover:bg-accent transition-all border border-border cursor-pointer text-sm sm:text-base"
            >
              {prompt}
            </button>
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
