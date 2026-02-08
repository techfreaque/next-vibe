/**
 * Custom Widgets for Character Edit and View
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { useState } from "react";

import { ModelSelector } from "@/app/api/[locale]/agent/models/components/model-selector";
import { cn } from "@/app/api/[locale]/shared/utils";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import { BadgeWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/react";
import { IconWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/react";
import { MarkdownWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/markdown/react";
import { SeparatorWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/separator/react";
import { TextWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definitionGet from "./definition";
import type definitionPatch from "./definition";
import type {
  CharacterGetResponseOutput,
  CharacterUpdateResponseOutput,
} from "./definition";

/**
 * Props for PATCH custom widget
 */
interface PatchWidgetProps {
  field: {
    value: CharacterUpdateResponseOutput | null | undefined;
  } & (typeof definitionPatch.PATCH)["fields"];
  fieldName: string;
}

/**
 * Props for GET custom widget
 */
interface GetWidgetProps {
  field: {
    value: CharacterGetResponseOutput | null | undefined;
  } & (typeof definitionGet.GET)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for character editing
 */
export function CharacterEditContainer({
  field,
}: PatchWidgetProps): React.JSX.Element {
  const children = field.children;
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation();
  const form = useWidgetForm();

  const handleDelete = async (): Promise<void> => {
    const characterId = form?.getValues("id");
    if (!characterId) {
      return;
    }

    const deleteDefinition = await import("./definition");
    navigation.push(deleteDefinition.default.DELETE, {
      urlPathParams: { id: characterId },
    });
  };

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back, Delete, Submit */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        {/* Back Button */}
        <NavigateButtonWidget
          field={{
            icon: "arrow-left",
            variant: "outline",
          }}
        />

        {/* Delete Button */}
        <Button
          type="button"
          variant="destructive"
          size="default"
          onClick={handleDelete}
          className="ml-auto"
        >
          <Trash2 className="h-4 w-4" />
          {t("app.api.agent.chat.characters.id.patch.deleteButton.label")}
        </Button>

        {/* Submit Button */}
        <SubmitButtonWidget
          field={{
            text: "app.api.agent.chat.characters.id.patch.submitButton.label",
            loadingText:
              "app.api.agent.chat.characters.id.patch.submitButton.loadingText",
            icon: "save",
            variant: "primary",
          }}
        />
      </Div>

      {/* Scrollable Form Container */}
      <Div className="group overflow-y-auto max-h-[calc(100dvh-180px)] px-4 pb-4">
        {/* Form Alert */}
        <FormAlertWidget field={{}} />

        {/* Success message (response only) */}
        <AlertWidget
          fieldName="success"
          field={withValue(children.success, field.value?.success, null)}
        />

        <Div className="flex flex-col gap-4">
          {/* Character Info Card */}
          <Div className="flex items-start gap-4 p-4 rounded-lg border">
            <IconFieldWidget fieldName="icon" field={children.icon} />
            <Div className="flex-1 flex flex-col gap-2">
              <Div className="flex flex-col gap-1">
                <TextFieldWidget fieldName="name" field={children.name} />
                <TextFieldWidget fieldName="tagline" field={children.tagline} />
              </Div>
              <TextFieldWidget
                fieldName="description"
                field={children.description}
              />
            </Div>
          </Div>

          {/* Additional Fields */}
          <SelectFieldWidget fieldName="category" field={children.category} />
          <BooleanFieldWidget fieldName="isPublic" field={children.isPublic} />
          <SelectFieldWidget fieldName="voice" field={children.voice} />
          <TextareaFieldWidget
            fieldName="systemPrompt"
            field={children.systemPrompt}
          />
          {form && (
            <ModelSelector
              modelSelection={form.watch("modelSelection")}
              onChange={(selection) =>
                form.setValue("modelSelection", selection)
              }
              t={t}
            />
          )}
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Custom container widget for character viewing
 */
export function CharacterViewContainer({
  field,
}: GetWidgetProps): React.JSX.Element {
  const children = field.children;
  const [systemPromptOpen, setSystemPromptOpen] = useState(false);
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation();
  const modelSelection = field.value?.modelSelection;

  const handleEdit = async (): Promise<void> => {
    const characterId = navigation?.current?.params?.urlPathParams?.id;
    if (!characterId) {
      return;
    }

    const patchDefinition = await import("./definition");
    navigation.push(patchDefinition.default.PATCH, {
      urlPathParams: { id: characterId },
    });
  };

  const handleDelete = async (): Promise<void> => {
    const characterId = navigation?.current?.params?.urlPathParams?.id;
    if (!characterId) {
      return;
    }

    const deleteDefinition = await import("./definition");
    navigation.push(deleteDefinition.default.DELETE, {
      urlPathParams: { id: characterId },
    });
  };

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back, Edit, Delete */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        {/* Back Button */}
        <NavigateButtonWidget
          field={{
            icon: "arrow-left",
            variant: "outline",
          }}
        />

        {/* Edit Button */}
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={handleEdit}
        >
          {t("app.api.agent.chat.characters.id.get.editButton.label")}
        </Button>

        {/* Delete Button */}
        <Button
          type="button"
          variant="destructive"
          size="default"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
          {t("app.api.agent.chat.characters.id.get.deleteButton.label")}
        </Button>
      </Div>

      {/* Scrollable Content Container */}
      <Div className="group overflow-y-auto max-h-[calc(100dvh-180px)] px-4 pb-4 flex flex-col gap-4">
        {/* Character Info Card */}
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
                field={withValue(children.tagline, field.value?.tagline, null)}
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
            {/* Badges Section */}
            <Div className="flex gap-2 mt-2">
              {field.value?.category && (
                <BadgeWidget
                  fieldName="category"
                  field={withValue(
                    children.category,
                    field.value.category,
                    null,
                  )}
                />
              )}
              {field.value?.isPublic !== undefined && (
                <BadgeWidget
                  fieldName="isPublic"
                  field={withValue(
                    children.isPublic,
                    field.value.isPublic,
                    null,
                  )}
                />
              )}
              {field.value?.voice && (
                <BadgeWidget
                  fieldName="voice"
                  field={withValue(children.voice, field.value.voice, null)}
                />
              )}
            </Div>
          </Div>
        </Div>

        {/* System Prompt Collapsible */}
        {field.value?.systemPrompt && (
          <Collapsible
            open={systemPromptOpen}
            onOpenChange={setSystemPromptOpen}
          >
            <Div className="flex items-start gap-4 p-4 rounded-lg border">
              <Div className="flex-1 flex flex-col gap-2">
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-base font-bold">
                  <Div>
                    {t(
                      "app.api.agent.chat.characters.id.get.systemPrompt.label",
                    )}
                  </Div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      systemPromptOpen && "rotate-180",
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <MarkdownWidget
                    fieldName="systemPrompt"
                    field={withValue(
                      children.systemPrompt,
                      field.value?.systemPrompt,
                      null,
                    )}
                  />
                </CollapsibleContent>
              </Div>
            </Div>
          </Collapsible>
        )}

        {/* Separator */}
        <SeparatorWidget field={children.separator} />

        {/* Model Selection - View Only */}
        {modelSelection && (
          <ModelSelector
            modelSelection={modelSelection}
            readOnly={true}
            t={t}
          />
        )}
      </Div>
    </Div>
  );
}
