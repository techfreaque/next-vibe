/**
 * Custom Widget for Skill Create
 */

"use client";

import { Div } from "next-vibe/ui/ui/div";
import { Span } from "next-vibe/ui/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AlertWidget } from "next-vibe/unified-ui/widgets/display-only/alert/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { IconFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/icon-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useCallback, useMemo, useState } from "react";

import { DEFAULT_CHAT_MODEL_SELECTION } from "../../ai-stream/constants";
import { useProviderAvailability } from "../../env-availability-store";
import { scopedTranslation as skillIdTranslation } from "../[id]/i18n";
import { useVariantPlatformDefaults, VariantList } from "../[id]/widget";
import type { SkillVariantData } from "../db";
import type defintion from "./definition";

/**
 * Props for custom widget - field with fully typed children
 */
interface CustomWidgetProps {
  field: (typeof defintion.POST)["fields"];
}

/**
 * Custom container widget for skill creation
 */
export function SkillCreateContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof defintion.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const availability = useProviderAvailability();
  const { t: tId } = skillIdTranslation.scopedT(locale);
  const fieldValue = useWidgetValue<typeof defintion.POST>();
  const emptyField = useMemo(() => ({}), []);

  // Variant management using the reusable VariantList + VariantEditorPanel
  const platformDefaults = useVariantPlatformDefaults(user, availability);
  const [localVariants, setLocalVariants] = useState<SkillVariantData[]>([
    {
      id: "default",
      isDefault: true,
      modelSelection: DEFAULT_CHAT_MODEL_SELECTION,
    },
  ]);

  const handleVariantsChange = useCallback(
    (newVariants: SkillVariantData[]): void => {
      setLocalVariants(newVariants);
      form.setValue("variants", newVariants, { shouldDirty: true });
    },
    [form],
  );

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back Button + Submit Button */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        <NavigateButtonWidget field={children.backButton} />

        {/* Submit Button */}
        <SubmitButtonWidget<typeof defintion.POST>
          field={children.submitButton}
        />
      </Div>

      {/* Scrollable content area */}
      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
        {/* Form Alert */}
        <FormAlertWidget field={emptyField} />

        {/* Success message (response only) */}
        <AlertWidget
          fieldName="success"
          field={withValue(children.success, fieldValue?.success, null)}
        />

        {/* Render form fields */}
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
          <TextareaFieldWidget
            fieldName="systemPrompt"
            field={children.systemPrompt}
          />

          {/* ── VARIANTS ── */}
          <Div className="flex flex-col gap-2">
            <Span className="text-sm font-semibold">
              {tId("patch.variants.label")}
            </Span>
            <VariantList
              variants={localVariants}
              onChange={handleVariantsChange}
              platformDefaults={platformDefaults}
              locale={locale}
              user={user}
              availability={availability}
              t={tId}
            />
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
