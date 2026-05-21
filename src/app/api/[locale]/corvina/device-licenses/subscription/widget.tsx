"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Calendar } from "next-vibe-ui/ui/icons/Calendar";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { ShoppingCart } from "next-vibe-ui/ui/icons/ShoppingCart";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { DateFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/date-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import definition from "./definition";
import type { SubscriptionStatusType } from "./definition";

function statusBadgeClass(status: SubscriptionStatusType): string {
  switch (status) {
    case "active":
    case "trial":
      return "text-xs font-semibold text-success";
    case "expiring_soon":
      return "text-xs font-semibold text-warning";
    case "expired":
      return "text-xs font-semibold text-destructive";
    case "no_subscription":
      return "text-xs text-muted-foreground";
  }
}

const STATUS_I18N_KEY: Record<
  SubscriptionStatusType,
  | "get.status.trial"
  | "get.status.active"
  | "get.status.expiringSoon"
  | "get.status.expired"
  | "get.status.noSubscription"
> = {
  trial: "get.status.trial",
  active: "get.status.active",
  expiring_soon: "get.status.expiringSoon",
  expired: "get.status.expired",
  no_subscription: "get.status.noSubscription",
};

export function DeviceSubscriptionContainer(): JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const { pop, push: navigate } = useWidgetNavigation();

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  if (!data) {
    return (
      <Div className="h-32 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  const handleEdit = (): void => {
    void navigate(definition.POST, {
      data: {
        logicalId: data.logicalIdOut,
        orgResourceId: data.orgResourceId ?? undefined,
        clientEmail: data.clientEmail ?? undefined,
        trialStartDate: data.trialStartDate ?? undefined,
        subscriptionEndDate: data.subscriptionEndDate ?? undefined,
      },
    });
  };

  const handleRequestLicense = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../purchase-inquiry/definition");
      navigate(def.default.POST, {
        data: {
          logicalId: data.logicalIdOut,
          orgResourceId: data.orgResourceId ?? "",
        },
      });
    })();
  };

  const canRequestLicense =
    data.status === "no_subscription" || data.status === "expired";

  if (isCompact) {
    return (
      <Div className="font-mono text-sm p-2">
        <Span className="font-semibold">{data.logicalIdOut}</Span>
        <Span className="ml-2">{`status:${data.status}`}</Span>
        {data.daysUntilExpiry !== null && (
          <Span className="ml-2">{`days:${data.daysUntilExpiry}`}</Span>
        )}
        {data.clientEmail && (
          <Span className="ml-2">{`email:${data.clientEmail}`}</Span>
        )}
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
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
        </Span>
        {canRequestLicense && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRequestLicense}
            className="gap-1"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {t("get.widget.requestLicense")}
          </Button>
        )}
        <Button type="button" variant="outline" size="sm" onClick={handleEdit}>
          {t("get.widget.editButton")}
        </Button>
      </Div>

      <Div className="p-4 space-y-3">
        <Div className="flex items-center gap-3">
          <Span className="text-xs text-muted-foreground font-mono">
            {data.logicalIdOut}
          </Span>
          <Span className={statusBadgeClass(data.status)}>
            {t(STATUS_I18N_KEY[data.status])}
          </Span>
          {data.daysUntilExpiry !== null && (
            <Span className="text-xs text-muted-foreground">
              {data.daysUntilExpiry > 0
                ? `${data.daysUntilExpiry}d left`
                : `${Math.abs(data.daysUntilExpiry)}d ago`}
            </Span>
          )}
        </Div>

        <Div className="grid grid-cols-2 gap-3 text-sm">
          {data.effectiveStartDate && (
            <Div className="space-y-0.5">
              <Span className="text-xs text-muted-foreground">
                {t("get.response.effectiveStartDate")}
              </Span>
              <Span className="font-mono text-xs">
                {new Date(data.effectiveStartDate).toLocaleDateString()}
              </Span>
            </Div>
          )}
          {data.effectiveEndDate && (
            <Div className="space-y-0.5">
              <Span className="text-xs text-muted-foreground">
                {t("get.response.effectiveEndDate")}
              </Span>
              <Span className="font-mono text-xs">
                {new Date(data.effectiveEndDate).toLocaleDateString()}
              </Span>
            </Div>
          )}
          {data.clientEmail && (
            <Div className="col-span-2 space-y-0.5">
              <Span className="text-xs text-muted-foreground">
                {t("get.response.clientEmail")}
              </Span>
              <Span className="font-mono text-xs">{data.clientEmail}</Span>
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
}

interface EditWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function DeviceSubscriptionEditContainer({
  field,
}: EditWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const children = field.children;

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  if (isCompact && result) {
    return (
      <Div className="font-mono text-sm p-2">
        {`updated:${result.logicalId}`}
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
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="p-4 flex flex-col gap-4">
        <FormAlertWidget field={{}} />
        <TextFieldWidget fieldName="logicalId" field={children.logicalId} />
        <TextFieldWidget
          fieldName="orgResourceId"
          field={children.orgResourceId}
        />
        <TextFieldWidget fieldName="clientEmail" field={children.clientEmail} />
        <Div className="grid grid-cols-2 gap-3">
          <DateFieldWidget
            fieldName="trialStartDate"
            field={children.trialStartDate}
          />
          <DateFieldWidget
            fieldName="subscriptionEndDate"
            field={children.subscriptionEndDate}
          />
        </Div>
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "post.submitButton.label",
            loadingText: "post.submitButton.loadingText",
          }}
        />
        {result !== undefined && result !== null && (
          <Div className="rounded-xl border bg-card p-4 space-y-2">
            <Span className="font-semibold text-sm text-success">
              {t("post.widget.result.title")}
            </Span>
            <Span className="text-xs font-mono text-muted-foreground block">
              {result.logicalId}
            </Span>
          </Div>
        )}
      </Div>
    </Div>
  );
}
