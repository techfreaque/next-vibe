"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Image } from "next-vibe-ui/ui/image";
import type { JSX } from "react";
import { useMemo } from "react";

import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import { TextWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { getImageModelOptions } from "./enum";
import type definition from "./definition";
import type { ImageGenerationPostResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ImageGenerationPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

export function ImageGenerationContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const isSubmitting = useWidgetIsSubmitting();
  const form = useWidgetForm<typeof definition.POST>();
  const result = field.value;
  const prompt = form?.watch("prompt") ?? "";
  const envAvailability = useEnvAvailability();
  const user = useWidgetUser();
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const modelOptions = useMemo(
    () => getImageModelOptions(envAvailability, isAdmin),
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
        <SelectFieldWidget fieldName="size" field={children.size} />
        <SelectFieldWidget fieldName="quality" field={children.quality} />
      </Div>

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "post.submitButton.text",
          loadingText: "post.submitButton.loadingText",
          icon: "image",
          variant: "primary",
        }}
      />

      {!isSubmitting && result?.imageUrl && (
        <Div className="flex flex-col gap-2">
          <Image
            src={result.imageUrl}
            alt={prompt}
            unoptimized
            width={1024}
            height={1024}
            className="w-full rounded-lg object-contain max-h-[600px]"
          />
          <TextWidget
            fieldName="creditCost"
            field={withValue(children.creditCost, result.creditCost, null)}
          />
        </Div>
      )}
    </Div>
  );
}
