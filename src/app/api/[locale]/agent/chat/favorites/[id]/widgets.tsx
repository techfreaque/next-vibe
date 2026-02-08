/**
 * Custom Widgets for Favorite Edit and View
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
import { BadgeWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/react";
import { IconWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/react";
import { SeparatorWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/separator/react";
import { TextWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definitionGet from "./definition";
import type definitionPatch from "./definition";
import type {
  FavoriteGetResponseOutput,
  FavoriteUpdateResponseOutput,
} from "./definition";

/**
 * Props for PATCH custom widget
 */
interface PatchWidgetProps {
  field: {
    value: FavoriteUpdateResponseOutput | null | undefined;
  } & (typeof definitionPatch.PATCH)["fields"];
  fieldName: string;
}

/**
 * Props for GET custom widget
 */
interface GetWidgetProps {
  field: {
    value: FavoriteGetResponseOutput | null | undefined;
  } & (typeof definitionGet.GET)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for favorite editing
 */
export function FavoriteEditContainer({
  field,
}: PatchWidgetProps): React.JSX.Element {
  const children = field.children;
  const form = useWidgetForm();
  const t = useWidgetTranslation();
  const characterId = form?.watch("characterId");
  const showCharacterInfo = characterId !== NO_CHARACTER_ID;

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back, Delete, Submit */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        <NavigateButtonWidget
          field={{
            icon: "arrow-left",
            variant: "outline",
          }}
        />
        <NavigateButtonWidget field={children.deleteButton} />
        <SubmitButtonWidget
          field={{
            text: "app.api.agent.chat.favorites.id.patch.submitButton.label",
            loadingText:
              "app.api.agent.chat.favorites.id.patch.submitButton.loadingText",
            icon: "save",
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
          {/* Character Info Card (hidden for default character) */}
          {showCharacterInfo && (
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
              modelSelection={form.watch("modelSelection")}
              onChange={(selection) =>
                form.setValue("modelSelection", selection)
              }
              characterModelSelection={form.watch("characterModelSelection")}
              t={t}
            />
          )}
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Custom container widget for favorite viewing
 */
export function FavoriteViewContainer({
  field,
}: GetWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation();
  const characterId = field.value?.characterId;
  const showCharacterInfo = characterId !== NO_CHARACTER_ID;
  const modelSelection = field.value?.modelSelection;

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back, Edit, Delete */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        <NavigateButtonWidget
          field={{
            icon: "arrow-left",
            variant: "outline",
          }}
        />
        <NavigateButtonWidget field={children.editButton} />
        <NavigateButtonWidget field={children.deleteButton} />
      </Div>

      {/* Scrollable Content Container */}
      <Div className="group overflow-y-auto max-h-[calc(100dvh-180px)] px-4 pb-4 flex flex-col gap-4">
        {/* Character Info Card (hidden for default character) */}
        {showCharacterInfo && (
          <Div className="flex items-start gap-4 p-4 rounded-lg border">
            <IconWidget
              fieldName="icon"
              field={withValue(children.icon, field.value?.icon, null)}
            />
            <Div className="flex-1 flex flex-col gap-2">
              <Div className="flex flex-col gap-1">
                <TextWidget
                  fieldName="name"
                  field={withValue(children.name, field.value?.name, null)}
                />
                <TextWidget
                  fieldName="tagline"
                  field={withValue(
                    children.tagline,
                    field.value?.tagline,
                    null,
                  )}
                />
              </Div>
              <TextWidget
                fieldName="description"
                field={withValue(
                  children.description,
                  field.value?.description,
                  null,
                )}
              />
              {/* Voice Badge */}
              {field.value?.voice && (
                <Div className="flex gap-2 mt-2">
                  <BadgeWidget
                    fieldName="voice"
                    field={withValue(children.voice, field.value?.voice, null)}
                  />
                </Div>
              )}
            </Div>
          </Div>
        )}

        {/* Separator */}
        <SeparatorWidget field={children.separator} />

        {/* Model Selection - View Only */}
        {modelSelection && (
          <ModelSelector
            modelSelection={modelSelection}
            characterModelSelection={field.value?.characterModelSelection}
            readOnly={true}
            t={t}
          />
        )}
      </Div>
    </Div>
  );
}
