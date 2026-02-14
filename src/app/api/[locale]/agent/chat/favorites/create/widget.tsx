/**
 * Custom Widget for Favorite Create
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { useState } from "react";

import { NO_CHARACTER_ID } from "@/app/api/[locale]/agent/chat/characters/config";
import { CharactersRepositoryClient } from "@/app/api/[locale]/agent/chat/characters/repository-client";
import { ModelSelector } from "@/app/api/[locale]/agent/models/components/model-selector";
import type { ModelSelectionSimple } from "@/app/api/[locale]/agent/models/components/types";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import TextWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import { useCharacter } from "../../characters/[id]/hooks";
import { useChatSettings } from "../../settings/hooks";
import type definition from "./definition";
import type { FavoriteCreateResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: FavoriteCreateResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for favorite creation
 */
export function FavoriteCreateContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const form = useWidgetForm();
  const t = useWidgetTranslation();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const navigate = useWidgetNavigation();
  const [isApplying, setIsApplying] = useState(false);

  const characterId = form?.watch("characterId");
  const voice = form.watch("voice");
  const isNoCharacter = characterId === NO_CHARACTER_ID;

  const favoriteModelSelection: ModelSelectionSimple | undefined =
    form?.watch("modelSelection");

  const characterEndpoint = useCharacter(characterId ?? "", user, logger);
  const characterData = characterEndpoint.read?.data;

  const { updateSettings } = useChatSettings(user, logger);

  const handleUseWithoutSaving = async (): Promise<void> => {
    if (!form || !characterId) {
      return;
    }

    setIsApplying(true);
    try {
      // Resolve the model to use
      const modelSelection =
        favoriteModelSelection ?? characterData?.modelSelection ?? null;

      let selectedModel: ModelId | undefined = undefined;

      if (modelSelection) {
        // Resolve model selection to actual ModelId
        const bestModel =
          CharactersRepositoryClient.getBestModelForCharacter(modelSelection);
        selectedModel = bestModel?.id;
      }

      // Apply settings without creating a favorite (activeFavoriteId = null)
      await updateSettings({
        activeFavoriteId: null,
        selectedCharacter: characterId,
        selectedModel,
        ttsVoice: voice ?? characterData?.voice ?? null,
      });

      // Navigate back
      navigate.pop(1);
    } catch (error) {
      logger.error("Failed to apply settings without saving", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back + Use Without Saving + Save */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        <NavigateButtonWidget
          field={{
            icon: "arrow-left",
            variant: "outline",
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleUseWithoutSaving}
          disabled={isApplying || !characterId}
          className="ml-auto h-8 text-xs"
        >
          {isApplying
            ? t(
                "app.api.agent.chat.favorites.post.useWithoutSavingButton.loadingText",
              )
            : t(
                "app.api.agent.chat.favorites.post.useWithoutSavingButton.label",
              )}
        </Button>
        <SubmitButtonWidget
          field={{
            text: "app.api.agent.chat.favorites.post.submitButton.label",
            loadingText:
              "app.api.agent.chat.favorites.post.submitButton.loadingText",
            icon: "plus",
            variant: "primary",
            size: "sm",
            className: "h-8 text-xs",
          }}
        />
      </Div>
      {/* Scrollable Form Container */}
      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
        <FormAlertWidget field={{}} />

        <AlertWidget
          fieldName="success"
          field={withValue(children.success, field.value?.success, null)}
        />

        <Div className="flex flex-col gap-4">
          {/* Character Info Card (hidden for default character) */}
          {!isNoCharacter && (
            <Div className="flex items-start gap-4 p-4 rounded-lg border">
              <IconFieldWidget fieldName="icon" field={children.icon} />
              <Div className="flex-1 flex flex-col gap-2">
                <Div className="flex flex-col gap-1">
                  <TextWidget
                    fieldName="name"
                    field={withValue(children.name, undefined, null)}
                  />
                  <TextWidget
                    fieldName="tagline"
                    field={withValue(children.tagline, undefined, null)}
                  />
                </Div>
                <TextWidget
                  fieldName="description"
                  field={withValue(children.description, undefined, null)}
                />
              </Div>
            </Div>
          )}

          <SelectFieldWidget fieldName="voice" field={children.voice} />
          {form && (
            <ModelSelector
              modelSelection={favoriteModelSelection}
              onChange={(selection) =>
                form.setValue("modelSelection", selection)
              }
              characterModelSelection={
                isNoCharacter ? undefined : characterData?.modelSelection
              }
              t={t}
              locale={locale}
            />
          )}
        </Div>
      </Div>
    </Div>
  );
}
