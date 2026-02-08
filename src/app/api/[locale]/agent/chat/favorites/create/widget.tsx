/**
 * Custom Widget for Favorite Create
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";

import { NO_CHARACTER_ID } from "@/app/api/[locale]/agent/chat/characters/config";
import { ModelSelector } from "@/app/api/[locale]/agent/models/components/model-selector";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import TextWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

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
  const characterId = field.value?.id;
  const showCharacterInfo = characterId !== NO_CHARACTER_ID;
  const form = useWidgetForm();
  const t = useWidgetTranslation();

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back + Submit */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        <NavigateButtonWidget
          field={{
            icon: "arrow-left",
            variant: "outline",
          }}
        />
        <SubmitButtonWidget
          field={{
            text: "app.api.agent.chat.favorites.post.submitButton.label",
            loadingText:
              "app.api.agent.chat.favorites.post.submitButton.loadingText",
            icon: "plus",
            variant: "primary",
            className: "ml-auto",
          }}
        />
      </Div>

      {/* Scrollable Form Container */}
      <Div className="group overflow-y-auto max-h-[calc(100dvh-180px)] px-4 pb-4">
        <FormAlertWidget field={{}} />

        <AlertWidget
          fieldName="success"
          field={withValue(children.success, field.value?.success, null)}
        />

        <Div className="flex flex-col gap-4">
          {/* Character Info (hidden for default character) */}
          {showCharacterInfo && (
            <Div className="flex items-start gap-4">
              <IconFieldWidget
                fieldName="characterIcon"
                field={children.icon}
              />
              <Div className="flex flex-col gap-2">
                <Div className="flex gap-2 items-center">
                  <TextWidget fieldName="characterName" field={children.name} />
                  <TextWidget
                    fieldName="characterTagline"
                    field={children.tagline}
                  />
                </Div>
                <TextWidget
                  fieldName="characterDescription"
                  field={children.description}
                />
              </Div>
            </Div>
          )}

          <SelectFieldWidget fieldName="voice" field={children.voice} />
          {form && (
            <ModelSelector
              modelSelection={form.watch("modelSelection")?.currentSelection}
              onChange={(selection) =>
                form.setValue("modelSelection", {
                  currentSelection: selection,
                  characterModelSelection:
                    form.watch("modelSelection")?.characterModelSelection,
                })
              }
              characterModelSelection={
                form.watch("modelSelection")?.characterModelSelection
              }
              t={t}
            />
          )}
        </Div>
      </Div>
    </Div>
  );
}
