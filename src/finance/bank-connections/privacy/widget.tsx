"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect } from "react";
import { z } from "zod";

import definitions from "./definition";

const policyOnly = { PATCH: definitions.PATCH };
const pickedSupplierNames = new Map<string, string>();

export function PrivacyInbox(): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.GET>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const data = useWidgetValue<typeof definitions.GET>();
  const form = useWidgetForm<typeof definitions.GET>();
  const mutations = useWidgetEndpointMutations();
  const { push } = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const { update } = useEndpoint(
    policyOnly,
    {
      update: {
        formOptions: { persistForm: false },
        mutationOptions: {
          onSuccess: () => {
            void mutations?.read?.refetch();
          },
        },
      },
    },
    logger,
    user,
  );
  const scope = data?.connectionIdSelected;
  const mode = data?.mode ?? "mixed";
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("description")}
      />
      <FormAlertWidget field={{}} />
      {interactive && !!data?.connections.length && (
        <Div className="max-w-md">
          <Select<string>
            value={form?.watch("connectionId") ?? scope}
            onValueChange={(connectionId) =>
              form?.setValue("connectionId", connectionId, {
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger aria-label={t("connection")}>
              <SelectValue placeholder={t("connection")} />
            </SelectTrigger>
            <SelectContent>
              {data.connections.map(({ id, bank }) => (
                <SelectItem key={id} value={id}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Div>
      )}
      {!scope ? (
        <EmptyBlock title={t("selectConnection")} />
      ) : (
        <Div className="grid min-w-0 gap-4 @4xl:grid-cols-[minmax(0,1fr)_minmax(250px,360px)]">
          <Div className="flex min-w-0 flex-col gap-3">
            <WidgetHeader size="section" title={t("inbox")} />
            {!data?.reviews.length ? (
              <EmptyBlock title={t("empty")} />
            ) : (
              data.reviews.map((row) => (
                <Div
                  key={row.identity}
                  className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4"
                >
                  <Div className="flex min-w-0 flex-wrap justify-between gap-2">
                    <Div className="min-w-0 space-y-1">
                      <P className="font-semibold text-foreground">
                        {row.counterparty || formatDocDate(row.date, locale)}
                      </P>
                      {row.description && (
                        <P className="break-words text-sm text-muted-foreground">
                          {row.description}
                        </P>
                      )}
                      <P className="text-xs text-muted-foreground">
                        {`${formatDocDate(row.date, locale)} · ${t("expires", {
                          date: formatDocDate(row.expires.slice(0, 10), locale),
                        })}`}
                      </P>
                    </Div>
                    <P className="font-semibold tabular-nums">
                      {formatMoney(row.amount, row.currency, locale)}
                    </P>
                  </Div>
                  {row.state === "approving" && (
                    <P className="text-sm text-muted-foreground">
                      {t("approving")}
                    </P>
                  )}
                  {interactive && (
                    <Div className="flex flex-wrap justify-end gap-2">
                      {row.state === "review" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            push(definitions.POST, {
                              data: {
                                connectionId: scope,
                                identity: row.identity,
                                disposition: "private",
                              },
                            })
                          }
                        >
                          {t("privateAction")}
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          push(definitions.POST, {
                            data: {
                              connectionId: scope,
                              identity: row.identity,
                              disposition: "business",
                            },
                          })
                        }
                      >
                        {t("businessAction")}
                      </Button>
                    </Div>
                  )}
                </Div>
              ))
            )}
          </Div>
          <Div className="min-w-0 space-y-3 rounded-xl border bg-card p-4">
            <WidgetHeader size="section" title={t("policy")} />
            <P className="text-sm text-muted-foreground">
              {`${t(`modes.${mode}`)} · ${data?.retentionDays ?? 30} ${t("retention").toLowerCase()}`}
            </P>
            {interactive && (
              <Div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    push(definitions.PATCH, {
                      data: {
                        connectionId: scope,
                        operation: "policy",
                        mode,
                        retentionDays: data?.retentionDays ?? 30,
                      },
                    })
                  }
                >
                  {t("editPolicy")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    push(definitions.PATCH, {
                      data: {
                        connectionId: scope,
                        companyId: data?.companyId,
                        operation: "set",
                      },
                    })
                  }
                >
                  {t("editRule")}
                </Button>
              </Div>
            )}
            {!!data?.rules.length && (
              <Div className="space-y-2 border-t pt-3">
                <P className="font-semibold">{t("rules")}</P>
                {data.rules.map((rule) => {
                  const supplier = data.ruleSuppliers?.find(
                    ({ id }) => id === rule.supplierId,
                  );
                  return (
                    <Div
                      key={JSON.stringify(rule)}
                      className="flex flex-wrap items-center justify-between gap-2 text-sm"
                    >
                      <P className="break-all">
                        {`${t(`ruleFields.${rule.field}`)} · ${t(`matches.${rule.match}`)} ${rule.literal} · ${t(`outcomes.${rule.result}`)}`}
                      </P>
                      {supplier && (
                        <P className="text-muted-foreground">{supplier.name}</P>
                      )}
                      {interactive && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={update.isSubmitting}
                          onClick={() =>
                            void update.submit({
                              connectionId: scope,
                              operation: "remove",
                              ...rule,
                            })
                          }
                        >
                          {t("operations.remove")}
                        </Button>
                      )}
                    </Div>
                  );
                })}
              </Div>
            )}
            {interactive && !!data?.suggestions.length && (
              <Div className="space-y-2 border-t pt-3">
                <P className="font-semibold">{t("suggestions")}</P>
                {data.suggestions.map((literal) => (
                  <Div
                    key={literal}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <P className="break-words text-sm">{literal}</P>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={update.isSubmitting}
                      onClick={() =>
                        void update.submit({
                          connectionId: scope,
                          operation: "set",
                          field: "counterparty",
                          match: "equals",
                          literal,
                          result: "business",
                        })
                      }
                    >
                      {t("addSuggestion")}
                    </Button>
                  </Div>
                ))}
              </Div>
            )}
            {update.response?.success === false && (
              <P className="text-sm text-destructive">
                {update.response.message}
              </P>
            )}
          </Div>
        </Div>
      )}
    </WidgetShell>
  );
}

export function PrivacyPolicy({
  field: { children },
}: {
  field: typeof definitions.PATCH.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.PATCH>();
  const value = useWidgetValue<typeof definitions.PATCH>();
  const form = useWidgetForm<typeof definitions.PATCH>();
  const { pop, push, canGoBack } = useWidgetNavigation();
  const operation = form?.watch("operation") ?? "policy";
  const updatePolicy = operation === "policy";
  const result = form?.watch("result");
  const companyId = form?.watch("companyId");
  const supplierId = form?.watch("supplierId");
  const supplierName = supplierId
    ? pickedSupplierNames.get(supplierId)
    : undefined;
  const interactive = useWidgetIsInteractive();
  useEffect(() => {
    if (result === "private" && form?.getValues("supplierId")) {
      form.setValue("supplierId", undefined);
    }
  }, [form, result]);
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("policy")}
        subtitle={t("policyDescription")}
      />
      <FormAlertWidget field={{}} />
      {value?.saved ? (
        <Button
          type="button"
          className="self-start"
          variant="outline"
          disabled={!canGoBack}
          onClick={() => pop()}
        >
          {t("saved")}
        </Button>
      ) : (
        interactive && (
          <Div className="flex max-w-xl flex-col gap-4">
            {!form?.watch("connectionId") && (
              <TextFieldWidget
                field={children.connectionId}
                fieldName="connectionId"
              />
            )}
            <SelectFieldWidget
              field={children.operation}
              fieldName="operation"
            />
            {updatePolicy ? (
              <>
                <SelectFieldWidget field={children.mode} fieldName="mode" />
                <NumberFieldWidget
                  field={children.retentionDays}
                  fieldName="retentionDays"
                />
                {form?.watch("mode") === "business" && (
                  <P className="text-sm text-muted-foreground">
                    {t("businessExplanation")}
                  </P>
                )}
              </>
            ) : (
              <>
                <SelectFieldWidget field={children.field} fieldName="field" />
                <SelectFieldWidget field={children.match} fieldName="match" />
                <TextFieldWidget field={children.literal} fieldName="literal" />
                <SelectFieldWidget field={children.result} fieldName="result" />
                {operation === "set" && result === "business" && companyId && (
                  <Div className="flex flex-col items-start gap-2">
                    <P className="text-sm font-medium">{t("ruleSupplier")}</P>
                    <Div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          void import("@/purchasing/vendor/list/definition").then(
                            ({ default: vendor }) =>
                              push(vendor.GET, {
                                data: { companyId },
                                renderInModal: true,
                                pickerCallback: (pickedSupplier) => {
                                  const selection = z
                                    .object({ id: z.uuid(), name: z.string() })
                                    .safeParse(pickedSupplier);
                                  if (selection.success) {
                                    pickedSupplierNames.set(
                                      selection.data.id,
                                      selection.data.name,
                                    );
                                    form?.setValue(
                                      "supplierId",
                                      selection.data.id,
                                      {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      },
                                    );
                                  }
                                },
                              }),
                          );
                        }}
                      >
                        {(supplierId && supplierName) || t("chooseSupplier")}
                      </Button>
                      {supplierId && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            form?.setValue("supplierId", undefined, {
                              shouldDirty: true,
                            })
                          }
                        >
                          {t("clearSupplier")}
                        </Button>
                      )}
                    </Div>
                  </Div>
                )}
              </>
            )}
            <SubmitButtonWidget<typeof definitions.PATCH>
              field={{ text: "apply", className: "self-end min-h-11" }}
            />
          </Div>
        )
      )}
    </WidgetShell>
  );
}

export function PrivacyDecision({
  field: { children },
}: {
  field: typeof definitions.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.POST>();
  const value = useWidgetValue<typeof definitions.POST>();
  const form = useWidgetForm<typeof definitions.POST>();
  const { pop, canGoBack } = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("decision")}
        subtitle={t("decisionDescription")}
      />
      <FormAlertWidget field={{}} />
      {value?.result ? (
        <Div className="space-y-3">
          <P>{t(`outcomes.${value.result}`)}</P>
          {form?.watch("always") && (
            <P>{t(value.ruleSaved ? "ruleSaved" : "ruleFailed")}</P>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={!canGoBack}
            onClick={() => pop()}
          >
            {t("inbox")}
          </Button>
        </Div>
      ) : (
        interactive && (
          <Div className="flex max-w-xl flex-col gap-4">
            {!form?.watch("connectionId") && (
              <TextFieldWidget
                field={children.connectionId}
                fieldName="connectionId"
              />
            )}
            {!form?.watch("identity") && (
              <TextFieldWidget field={children.identity} fieldName="identity" />
            )}
            <SelectFieldWidget
              field={children.disposition}
              fieldName="disposition"
            />
            <BooleanFieldWidget field={children.always} fieldName="always" />
            <SubmitButtonWidget<typeof definitions.POST>
              field={{ text: "apply", className: "self-end min-h-11" }}
            />
          </Div>
        )
      )}
    </WidgetShell>
  );
}
