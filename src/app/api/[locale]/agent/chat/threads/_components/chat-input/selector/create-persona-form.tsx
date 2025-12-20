"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback } from "react";

import { useCreatePersona } from "@/app/api/[locale]/agent/chat/personas/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface CreatePersonaFormProps {
  onSave: (personaId: string) => void;
  onCancel: () => void;
  locale: CountryLanguage;
}

/**
 * Form for creating custom personas using useEndpoint pattern
 */
export function CreatePersonaForm({
  onSave,
  onCancel,
  locale,
}: CreatePersonaFormProps): JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useCreatePersona(logger);

  const handleSubmit = useCallback(async (): Promise<void> => {
    await endpoint.create.onSubmit();
    if (endpoint.create.response?.success && endpoint.create.response.data?.id) {
      onSave(endpoint.create.response.data.id);
    }
  }, [endpoint.create, onSave]);

  const isSubmitting = endpoint.create.isSubmitting;

  return (
    <Div className="flex flex-col max-h-[70vh] overflow-hidden">
      {/* Header */}
      <Div className="flex items-center gap-3 p-4 border-b bg-card shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <Span className="font-medium">
            {t("app.chat.createPersona.title")}
          </Span>
        </Div>
      </Div>

      {/* Form */}
      <Form
        form={endpoint.create.form}
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto"
      >
        <Div className="flex flex-col gap-4 p-4">
          {/* Form alert for errors */}
          <FormAlert alert={endpoint.alert} />

          {/* Name */}
          <EndpointFormField
            name="name"
            config={{
              type: "text",
              label: "app.chat.createPersona.name",
              placeholder: "app.chat.createPersona.namePlaceholder",
            }}
            control={endpoint.create.form.control}
            theme={{ style: "none", showAllRequired: false }}
          />

          {/* Description */}
          <EndpointFormField
            name="description"
            config={{
              type: "text",
              label: "app.chat.createPersona.description",
              placeholder: "app.chat.createPersona.descriptionPlaceholder",
            }}
            control={endpoint.create.form.control}
            theme={{ style: "none", showAllRequired: false }}
          />

          {/* Icon */}
          <EndpointFormField
            name="icon"
            config={{
              type: "text",
              label: "app.chat.createPersona.icon",
              placeholder: "robot-face",
            }}
            control={endpoint.create.form.control}
            theme={{ style: "none", showAllRequired: false }}
          />

          {/* Category */}
          <EndpointFormField
            name="category"
            config={{
              type: "select",
              label: "app.chat.createPersona.category",
              options: [
                { value: "companion", label: "app.chat.categories.companion" },
                { value: "assistant", label: "app.chat.categories.assistant" },
                { value: "coding", label: "app.chat.categories.coding" },
                { value: "writing", label: "app.chat.categories.writing" },
                { value: "analysis", label: "app.chat.categories.analysis" },
                { value: "roleplay", label: "app.chat.categories.roleplay" },
                { value: "creative", label: "app.chat.categories.creative" },
                { value: "education", label: "app.chat.categories.education" },
                { value: "controversial", label: "app.chat.categories.controversial" },
                { value: "custom", label: "app.chat.categories.custom" },
              ],
            }}
            control={endpoint.create.form.control}
            theme={{ style: "none", showAllRequired: false }}
          />

          {/* System Prompt */}
          <EndpointFormField
            name="systemPrompt"
            config={{
              type: "textarea",
              label: "app.chat.createPersona.systemPrompt",
              placeholder: "app.chat.createPersona.systemPromptPlaceholder",
            }}
            control={endpoint.create.form.control}
            theme={{ style: "none", showAllRequired: false }}
          />
        </Div>

        {/* Actions */}
        <Div className="flex items-center justify-between gap-3 p-4 border-t bg-card shrink-0">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(isSubmitting && "opacity-70")}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("app.chat.createPersona.creating")}
              </>
            ) : (
              t("app.chat.createPersona.create")
            )}
          </Button>
        </Div>
      </Form>
    </Div>
  );
}
