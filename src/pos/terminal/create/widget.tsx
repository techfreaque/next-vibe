"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Label } from "next-vibe/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useId, useMemo } from "react";
import { z } from "zod";

import warehouseDefinition from "@/inventory/warehouse/list/definition";

import type definition from "./definition";

interface PosTerminalCreateWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function PosTerminalCreateWidget({
  field,
}: PosTerminalCreateWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = data?.result;
  const form = useWidgetForm<typeof definition.POST>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const warehousePickerId = useId();
  const companyId = form.watch("details.companyId");
  const warehouseId = form.watch("details.warehouseId");
  const scopeReady = z.uuid().safeParse(companyId).success;
  const warehouseOptions = useMemo(
    () => ({
      read: {
        initialState: { companyId },
        queryOptions: { enabled: scopeReady && !result },
      },
    }),
    [companyId, scopeReady, result],
  );
  const warehouseRead = useEndpoint(
    warehouseDefinition,
    warehouseOptions,
    logger,
    user,
  ).read;
  const warehouseRows = warehouseRead?.data?.warehouses;
  useEffect(() => {
    if (
      !result &&
      warehouseId &&
      warehouseRows &&
      !warehouseRows.some((row) => row.isActive && row.id === warehouseId)
    ) {
      form.setValue("details.warehouseId", undefined, { shouldDirty: true });
    }
  }, [form, result, warehouseId, warehouseRows]);

  const handleBackToList = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleOpenSession = (terminalId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../../session/open/definition");
      navigation.push(def.default.POST, {
        data: { details: { terminalId, openingFloat: undefined } },
      });
    })();
  };

  if (result?.id) {
    return (
      <Div className="flex flex-col gap-6 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        {/* Success banner */}
        <Div className="flex flex-col gap-0.5">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("terminalCreate.post.success.title")}
          </Span>
          <Span className="text-sm text-muted-foreground">
            {t("terminalCreate.post.success.description")}
          </Span>
        </Div>

        {/* Terminal details */}
        <Div className="rounded-lg border overflow-hidden">
          <Div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
            <Span className="text-sm font-semibold">{result.name}</Span>
            <Badge
              variant={result.isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {result.isActive
                ? t("terminalCreate.post.widget.active")
                : t("terminalCreate.post.widget.inactive")}
            </Badge>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3 border-b">
            <Span className="text-sm text-muted-foreground">
              {t("terminalCreate.post.response.currency")}
            </Span>
            <Badge variant="outline" className="text-xs font-mono">
              {result.currency}
            </Badge>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("workflow.warehouse")}
            </Span>
            <Span className="text-sm">
              {result.warehouseName ?? t("workflow.noWarehouse")}
            </Span>
          </Div>
        </Div>

        {/* Actions */}
        <Div className="flex gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => handleOpenSession(result.id)}
          >
            {t("terminalCreate.post.widget.openSession")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBackToList}
          >
            {t("terminalCreate.post.widget.backToList")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-5">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("terminalCreate.post.widget.backToList")}
        </Button>
      )}

      <FormAlertWidget field={{}} />

      {/* 2-column form grid */}
      <Div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Div className="sm:col-span-2">
          <EntityPickerFieldWidget
            fieldName="details.companyId"
            field={field.children.details.children.companyId}
          />
        </Div>
        <TextFieldWidget
          fieldName="details.name"
          field={withValue(
            field.children.details.children.name,
            undefined,
            null,
          )}
        />
        <TextFieldWidget
          fieldName="details.location"
          field={withValue(
            field.children.details.children.location,
            undefined,
            null,
          )}
        />
        <TextFieldWidget
          fieldName="details.currency"
          field={withValue(
            field.children.details.children.currency,
            undefined,
            null,
          )}
        />
        <Div className="flex min-w-0 flex-col gap-2">
          <Label htmlFor={warehousePickerId}>{t("workflow.warehouse")}</Label>
          <Select
            value={warehouseId ?? "none"}
            onValueChange={(value) =>
              form.setValue(
                "details.warehouseId",
                value === "none" ? undefined : value,
                {
                  shouldDirty: true,
                  shouldValidate: true,
                },
              )
            }
          >
            <SelectTrigger id={warehousePickerId} disabled={!scopeReady}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("workflow.noWarehouse")}</SelectItem>
              {warehouseRows
                ?.filter((row) => row.isActive)
                .map((row) => (
                  <SelectItem key={row.id} value={row.id}>
                    {row.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Span className="text-xs text-muted-foreground">
            {t(
              scopeReady
                ? "workflow.warehouseInstruction"
                : "workflow.chooseCompanyFirst",
            )}
          </Span>
        </Div>
        <TextFieldWidget
          fieldName="details.cashAccountNodeId"
          field={withValue(
            field.children.details.children.cashAccountNodeId,
            undefined,
            null,
          )}
        />
      </Div>

      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "terminalCreate.post.titleShort" }}
      />
    </Div>
  );
}
