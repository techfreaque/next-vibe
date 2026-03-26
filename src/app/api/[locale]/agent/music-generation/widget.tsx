"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Audio } from "next-vibe-ui/ui/audio";
import type { JSX } from "react";
import { useMemo } from "react";

import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetIsSubmitting,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import { TextWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { getMusicModelOptions } from "./enum";
import type definition from "./definition";
import type { MusicGenerationPostResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: MusicGenerationPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

export function MusicGenerationContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const isSubmitting = useWidgetIsSubmitting();
  const result = field.value;
  const envAvailability = useEnvAvailability();
  const user = useWidgetUser();
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const modelOptions = useMemo(
    () => getMusicModelOptions(envAvailability, isAdmin),
    [envAvailability, isAdmin],
  );

  return (
    <Div className="flex flex-col gap-4 p-4">
      <FormAlertWidget field={{}} />

      <TextareaFieldWidget fieldName="prompt" field={children.prompt} />

      <Div className="grid grid-cols-2 gap-4">
        <SelectFieldWidget
          fieldName="model"
          field={{ ...children.model, options: modelOptions }}
        />
        <SelectFieldWidget fieldName="duration" field={children.duration} />
      </Div>

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "post.submitButton.text",
          loadingText: "post.submitButton.loadingText",
          icon: "music",
          variant: "primary",
        }}
      />

      {!isSubmitting && result?.audioUrl && (
        <Div className="flex flex-col gap-2">
          <Audio controls src={result.audioUrl} className="w-full" />
          <TextWidget
            fieldName="creditCost"
            field={withValue(children.creditCost, result.creditCost, null)}
          />
        </Div>
      )}
    </Div>
  );
}
