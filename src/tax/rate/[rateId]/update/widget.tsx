"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Search } from "next-vibe/ui/components/icons/Search";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useRef } from "react";
import { z } from "zod";

import listDefinition from "../../list/definition";
import type definition from "./definition";

export function TaxRateUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();

  const form = useWidgetForm<typeof definition.PATCH>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const interactive = useWidgetIsInteractive();
  const rateId = form.watch("rateId");
  const selected = z.uuid().safeParse(rateId).success;
  const lookup = useApiQuery({
    endpoint: listDefinition.GET,
    requestData: { rateId, page: 1, pageSize: 1 },
    options: {
      enabled: interactive && selected && !data?.updated,
      queryKey: `tax-rate-editor:${rateId}`,
      staleTime: 0,
      gcTime: 0,
    },
    logger,
    user,
  });
  const stored = lookup.data?.rates?.find((row) => row.id === rateId);
  const initialized = useRef<string | undefined>(undefined);
  const defaults = form.formState.defaultValues;
  useEffect(() => {
    if (!selected) {
      initialized.current = undefined;
      return;
    }
    if (lookup.isFetching || !stored || initialized.current === stored.id) {
      return;
    }
    initialized.current = stored.id;
    form.reset({
      rateId: stored.id,
      name: stored.name,
      rate: stored.rate,
      isDefault: stored.isDefault,
      isActive: stored.isActive,
    });
  }, [form, lookup.isFetching, selected, stored]);
  const canEdit =
    selected &&
    (!interactive ||
      (!!stored && defaults?.rateId === rateId && defaults.name !== undefined));

  const handleBack = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../../list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  if (data?.updated !== undefined) {
    return (
      <Div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
        <ResultBanner
          variant={data.updated ? "success" : "danger"}
          title={
            data.updated
              ? t("rate.update.success.title")
              : t("rate.update.widget.failed")
          }
          message={
            data.updated ? t("rate.update.success.description") : undefined
          }
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="self-start"
        >
          {t("rate.update.widget.backToList")}
        </Button>
      </Div>
    );
  }

  return (
    <AdminForm
      className="mx-auto max-w-3xl"
      title={stored?.name ?? t("rate.update.title")}
      description={
        stored
          ? t("rate.update.widget.subtitle", {
              company: stored.companyName,
              code: stored.code,
            })
          : t("rate.update.description")
      }
      backButton={
        navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("rate.update.widget.backToList")}
          </Button>
        )
      }
      primaryAction={
        canEdit && (
          <SubmitButtonWidget<typeof definition.PATCH>
            field={{ text: "rate.update.widget.save" }}
          />
        )
      }
    >
      {!selected ? (
        <EntityPickerFieldWidget
          fieldName="rateId"
          field={withValue(field.children.rateId, undefined, null)}
        />
      ) : !canEdit ? (
        lookup.error || (!stored && lookup.isSuccess && !lookup.isFetching) ? (
          <Div className="rounded-lg border bg-card">
            <EmptyBlock
              size="page"
              icon={
                lookup.error ? (
                  <AlertCircle className="h-6 w-6" />
                ) : (
                  <Search className="h-6 w-6" />
                )
              }
              title={
                lookup.error
                  ? t("rate.update.widget.loadErrorTitle")
                  : t("rate.update.widget.notFoundTitle")
              }
              message={
                lookup.error
                  ? lookup.error.message
                  : t("rate.update.widget.notFoundMessage")
              }
              action={
                lookup.error
                  ? {
                      label: t("rate.list.widget.retry"),
                      onClick: () => void lookup.refetch(),
                    }
                  : {
                      label: t("rate.update.widget.backToList"),
                      onClick: handleBack,
                    }
              }
            />
          </Div>
        ) : (
          <Div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
            <Skeleton className="h-4 w-28" />
            <Div className="grid gap-4 @md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </Div>
          </Div>
        )
      ) : (
        <AdminFormSection title={t("rate.details")} columns={2}>
          <TextFieldWidget
            fieldName="name"
            field={{
              ...withValue(field.children.name, undefined, null),
              description: undefined,
            }}
          />
          <NumberFieldWidget
            presentation="percent"
            fieldName="rate"
            field={{
              ...withValue(field.children.rate, undefined, null),
              description: undefined,
              placeholder: undefined,
            }}
          />
          <BooleanFieldWidget
            fieldName="isDefault"
            field={{
              ...withValue(field.children.isDefault, undefined, null),
              description: undefined,
            }}
          />
          <BooleanFieldWidget
            fieldName="isActive"
            field={{
              ...withValue(field.children.isActive, undefined, null),
              description: undefined,
            }}
          />
        </AdminFormSection>
      )}
    </AdminForm>
  );
}
