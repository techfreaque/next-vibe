/**
 * Custom Widget for Character Create
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { type JSX, useCallback } from "react";

import { ModelSelector } from "@/app/api/[locale]/agent/models/components/model-selector";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TParams } from "@/i18n/core/static-types";

import type { ModelSelectionSimple } from "../../../models/components/types";
import type defintion from "./definition";
import type { CharacterCreateResponseOutput } from "./definition";

/**
 * Props for custom widget - field with fully typed children
 */
interface CustomWidgetProps {
  field: {
    value: CharacterCreateResponseOutput | null | undefined;
  } & (typeof defintion.POST)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for character creation
 * Handles layout, actions, and flattened field rendering
 */
export function CharacterCreateContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof defintion.POST>();
  const t = useWidgetTranslation();
  const locale = useWidgetLocale();

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back Button + Submit Button */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        {/* Back Button */}
        <NavigateButtonWidget
          field={{
            icon: "arrow-left",
            variant: "outline",
          }}
        />

        {/* Submit Button */}
        <SubmitButtonWidget
          field={{
            text: "app.api.agent.chat.characters.post.submitButton.text",
            loadingText:
              "app.api.agent.chat.characters.post.submitButton.loadingText",
            icon: "plus",
            variant: "primary",
            className: "ml-auto",
          }}
        />
      </Div>

      {/* Scrollable Form Container */}
      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
        {/* Form Alert */}
        <FormAlertWidget field={{}} />

        {/* Success message (response only) */}
        <AlertWidget
          fieldName="success"
          field={withValue(children.success, field.value?.success, null)}
        />

        {/* Render form fields in explicit order */}
        <Div className="flex flex-col gap-4">
          <TextFieldWidget fieldName="name" field={children.name} />
          <TextFieldWidget fieldName="tagline" field={children.tagline} />
          <IconFieldWidget fieldName="icon" field={children.icon} />
          <TextFieldWidget
            fieldName="description"
            field={children.description}
          />
          <SelectFieldWidget fieldName="category" field={children.category} />
          <BooleanFieldWidget fieldName="isPublic" field={children.isPublic} />
          <SelectFieldWidget fieldName="voice" field={children.voice} />
          <TextareaFieldWidget
            fieldName="systemPrompt"
            field={children.systemPrompt}
          />
          <ModelSelectorWrapper form={form} t={t} locale={locale} />
        </Div>
      </Div>
    </Div>
  );
}

function ModelSelectorWrapper({
  form,
  t,
  locale,
}: {
  form: ReturnType<typeof useWidgetForm<typeof defintion.POST>>;
  t: (key: string, params?: TParams) => string;
  locale: CountryLanguage;
}): JSX.Element {
  const modelSelection = form.watch("modelSelection");
  const error = form.formState.errors.modelSelection;
  const onChange = useCallback(
    (selection: ModelSelectionSimple | null) =>
      form.setValue("modelSelection", selection),
    [form],
  );
  return (
    <>
      {error && (
        <Div className="text-red-500 text-sm mb-2">{error.message}</Div>
      )}
      <ModelSelector
        modelSelection={modelSelection}
        onChange={onChange}
        t={t}
        locale={locale}
      />
    </>
  );
}
