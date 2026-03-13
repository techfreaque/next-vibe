/**
 * Remote Connection Register Widget
 * Used by local instances to register themselves on the cloud during the connect flow.
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Server } from "next-vibe-ui/ui/icons/Server";
import type { JSX } from "react";

import { useWidgetLocale } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { UrlFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/url-field/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definitions from "./definition";
import { scopedTranslation } from "./i18n";

interface RegisterWidgetProps {
  field: (typeof definitions.POST)["fields"];
}

export function RemoteRegisterWidget({
  field,
}: RegisterWidgetProps): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const children = field.children;

  return (
    <Card>
      <CardHeader>
        <Div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{t("post.title")}</CardTitle>
        </Div>
        <CardDescription>{t("post.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Div className="grid grid-cols-12 gap-4">
          <TextFieldWidget fieldName="instanceId" field={children.instanceId} />
          <UrlFieldWidget fieldName="localUrl" field={children.localUrl} />
        </Div>
        <SubmitButtonWidget<typeof definitions.POST>
          field={{
            text: "post.title",
            loadingText: "post.title",
            icon: "server",
            variant: "default",
          }}
        />
      </CardContent>
    </Card>
  );
}
