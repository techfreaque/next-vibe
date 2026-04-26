/**
 * Custom Widget for Skill Create
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { useCallback, useMemo, useState, type JSX } from "react";

import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetUser,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/widget";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/widget";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import { DEFAULT_CHAT_MODEL_SELECTION } from "@/app/api/[locale]/agent/ai-stream/constants";

import type { SkillVariantData } from "../db";
import { scopedTranslation as skillIdTranslation } from "../[id]/i18n";
import { VariantList, useVariantPlatformDefaults } from "../[id]/widget";
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
  const { t: tId } = skillIdTranslation.scopedT(locale);
  const fieldValue = useWidgetValue<typeof defintion.POST>();
  const emptyField = useMemo(() => ({}), []);

  // Variant management using the reusable VariantList + VariantEditorPanel
  const platformDefaults = useVariantPlatformDefaults(user);
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
      // Sync top-level modelSelection with default variant for backward compat
      const defaultVariant =
        newVariants.find((v) => v.isDefault) ?? newVariants[0];
      if (defaultVariant) {
        form.setValue("modelSelection", defaultVariant.modelSelection, {
          shouldDirty: true,
        });
      }
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
              t={tId}
            />
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
