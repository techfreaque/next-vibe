"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { P } from "next-vibe/ui/components/typography";
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
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import getAccount from "../get/definition";
import type definition from "./definition";

export function CoaAccountDeactivateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const done = data?.deactivated !== undefined;
  const accountId = form?.watch("accountId") ?? "";
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { accountId },
        queryOptions: { enabled: Boolean(accountId) && !done },
      },
    }),
    [accountId, done],
  );
  const { read } = useEndpoint(getAccount, options, logger, user);
  const account = read?.data?.result;
  const selected = account?.id === accountId ? account : undefined;

  return (
    <AdminForm
      title={t("post.widget.confirmTitle")}
      description={selected ? `${selected.code} · ${selected.name}` : undefined}
      secondaryActions={
        !done && navigation.canGoBack ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            type="button"
          >
            {t("post.widget.cancelButton")}
          </Button>
        ) : undefined
      }
      primaryAction={
        done || !selected ? null : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "post.widget.confirmButton",
              variant: "destructive",
            }}
          />
        )
      }
    >
      {done ? (
        <ResultBanner
          variant="success"
          title={t("post.widget.doneLabel")}
          message={t("post.success.description")}
        />
      ) : (
        <>
          <EntityPickerFieldWidget
            fieldName="accountId"
            field={field.children.accountId}
            selectedLabel={selected?.name}
          />
          {read?.response?.success === false && accountId && (
            <ResultBanner variant="warning" title={read.response.message} />
          )}
          {selected && (
            <Div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <P className="text-sm text-muted-foreground">
                {t("post.widget.confirmDescription")}
              </P>
            </Div>
          )}
        </>
      )}
    </AdminForm>
  );
}
