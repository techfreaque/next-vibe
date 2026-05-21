"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ShoppingCart } from "next-vibe-ui/ui/icons/ShoppingCart";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/widget";
import { TextWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/widget";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function PurchaseInquiryContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const children = field.children;
  const value = useWidgetValue<typeof definition.POST>();

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  if (isCompact) {
    if (value) {
      return (
        <Div className="font-mono text-sm p-2">
          <Span>{`inquiry:${value.inquiryId} — ${value.confirmationMessage}`}</Span>
        </Div>
      );
    }
    return <Div />;
  }

  if (value !== null && value !== undefined) {
    return (
      <Div className="flex flex-col min-h-0">
        <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => pop()}
            title={t("post.widget.back")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          <Span className="font-semibold text-sm mr-auto">
            {t("post.widget.title")}
          </Span>
        </Div>
        <Div className="flex flex-col gap-4 p-4">
          <FormAlertWidget field={{}} />
          <P className="text-sm font-semibold text-success">
            {t("post.widget.submittedLabel")}
          </P>
          <TextWidget
            fieldName="inquiryId"
            field={withValue(children.inquiryId, value.inquiryId, null)}
          />
          <AlertWidget
            fieldName="confirmationMessage"
            field={withValue(
              children.confirmationMessage,
              value.confirmationMessage,
              null,
            )}
          />
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "post.widget.submitAnother" }}
          />
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          title={t("post.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>
      <Div className="flex flex-col gap-4 p-4">
        <FormAlertWidget field={{}} />
        <P className="text-sm text-muted-foreground">
          {t("post.widget.description")}
        </P>
        <TextFieldWidget fieldName="logicalId" field={children.logicalId} />
        <TextFieldWidget
          fieldName="orgResourceId"
          field={children.orgResourceId}
        />
        <TextFieldWidget fieldName="deviceLabel" field={children.deviceLabel} />
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="contactName"
            field={children.contactName}
          />
          <TextFieldWidget
            fieldName="contactEmail"
            field={children.contactEmail}
          />
        </Div>
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="contactPhone"
            field={children.contactPhone}
          />
          <NumberFieldWidget
            fieldName="requestedMonths"
            field={children.requestedMonths}
          />
        </Div>
        <TextareaFieldWidget
          fieldName="inquiryMessage"
          field={children.inquiryMessage}
        />
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "post.widget.submit" }}
        />
      </Div>
    </Div>
  );
}
