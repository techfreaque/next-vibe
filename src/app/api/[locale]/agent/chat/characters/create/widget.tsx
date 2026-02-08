/**
 * Custom Widget for Character Create
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";

import { ModelSelectionFieldWidget } from "@/app/api/[locale]/agent/models/components/model-selector";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

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
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;

  return (
    <Div className="flex flex-col gap-0 px-4 pt-4">
      {/* Top Actions: Back Button + Submit Button */}
      <Div className="flex flex-row gap-2 mb-4">
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
      <Div className="group pb-4 overflow-y-auto max-h-[calc(100dvh-180px)]">
        {/* Form Alert */}
        <FormAlertWidget field={{}} />

        {/* Success message (response only) */}
        <AlertWidget
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
          <ModelSelectionFieldWidget
            fieldName="modelSelection"
            field={children.modelSelection}
          />
        </Div>
      </Div>
    </Div>
  );
}
