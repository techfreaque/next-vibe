"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { InstallResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: InstallResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function SetupInstallWidget({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const value = field.value;

  return (
    <Div className="flex flex-col gap-4 p-4">
      <FormAlertWidget field={{}} />

      {value && (
        <AlertWidget
          fieldName="message"
          field={withValue(
            children.message,
            value.installed ? value.message : value.message,
            null,
          )}
        />
      )}

      {value?.output && (
        <Div className="rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap">
          {value.output}
        </Div>
      )}

      {value?.path && (
        <Div className="text-sm text-muted-foreground">
          {t("post.success.title")}:{" "}
          <Span className="font-mono">{value.path}</Span>
        </Div>
      )}

      <Div className="flex flex-col gap-3">
        <BooleanFieldWidget fieldName="force" field={children.force} />
        <BooleanFieldWidget fieldName="verbose" field={children.verbose} />
      </Div>

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "post.title",
          loadingText: "post.title",
          icon: "download",
          variant: "primary",
        }}
      />
    </Div>
  );
}
