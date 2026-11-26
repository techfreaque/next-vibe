"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import getDefinition from "../get/definition";
import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function VendorDeactivateWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const vendorId = form?.watch("vendorId") ?? "";
  const getOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { vendorId },
        queryOptions: { enabled: vendorId !== "" },
      },
    }),
    [vendorId],
  );
  const vendor = useEndpoint(getDefinition, getOptions, logger, user).read?.data
    ?.result;

  const openVendor = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
      return;
    }
    if (vendorId) {
      navigation.push(getDefinition.GET, { urlPathParams: { vendorId } });
    }
  };

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
      className="-ml-1 gap-1.5 self-start"
    >
      <ChevronLeft className="h-4 w-4" />
      {t("vendorDeactivate.post.widget.backToVendor")}
    </Button>
  ) : undefined;

  const title = vendor?.name ?? t("vendorDeactivate.post.title");
  const done = data?.result !== undefined;
  const alreadyInactive = !done && vendor?.isActive === false;

  return (
    <AdminForm
      title={title}
      description={
        done || alreadyInactive
          ? undefined
          : t("vendorDeactivate.post.widget.subtitle")
      }
      backButton={backButton}
      secondaryActions={
        done || alreadyInactive ? undefined : navigation.canGoBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => navigation.pop()}
          >
            {t("vendorDeactivate.post.widget.cancel")}
          </Button>
        ) : undefined
      }
      primaryAction={
        done || alreadyInactive ? (
          <Button type="button" onClick={openVendor}>
            {t("vendorDeactivate.post.widget.openVendor")}
          </Button>
        ) : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "vendorDeactivate.post.title",
              variant: "destructive",
            }}
          />
        )
      }
    >
      {done ? (
        <ResultBanner
          variant="success"
          title={t("vendorDeactivate.post.success.title")}
          message={t("vendorDeactivate.post.success.description")}
        />
      ) : alreadyInactive ? (
        <ResultBanner
          variant="info"
          title={t("vendorDeactivate.post.widget.alreadyInactive")}
          message={t("vendorDeactivate.post.widget.reactivateHint")}
        />
      ) : (
        <Div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
          {vendor ? (
            <Div className="flex flex-wrap items-center gap-2">
              <Span className="text-sm font-semibold">{vendor.name}</Span>
              <StatusPill
                status="active"
                variant="success"
                label={t("vendorList.get.widget.active")}
              />
            </Div>
          ) : null}
          <Span className="text-sm text-muted-foreground">
            {t("vendorDeactivate.post.widget.warning")}
          </Span>
        </Div>
      )}
    </AdminForm>
  );
}
