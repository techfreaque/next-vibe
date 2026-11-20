"use client";

import { Alert } from "next-vibe/ui/components/alert";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "next-vibe/ui/components/form/form";
import { Input } from "next-vibe/ui/components/input";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  RelatedEntitiesPanel,
  useRelatedEntityNavigation,
} from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLogger,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import definitions from "./definition";

export function GrantRecipientContainer({
  field: { children },
}: {
  field: typeof definitions.GET.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.GET>();
  const value = useWidgetValue<typeof definitions.GET>();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();

  return (
    <WidgetShell>
      {isInteractive && !responseOnly && (
        <Div className="flex flex-col gap-3">
          <TextFieldWidget
            field={children.targetUserId}
            fieldName="targetUserId"
          />
          <SubmitButtonWidget<typeof definitions.GET>
            field={{ text: "adminAdd.recipient.verify" }}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {value && (
        <DetailGrid columns={2}>
          <DetailField
            label={t("adminAdd.recipient.email")}
            value={value.email}
          />
          <DetailField
            label={t("adminAdd.recipient.accountId")}
            value={value.id}
            mono
            copyable
          />
        </DetailGrid>
      )}
    </WidgetShell>
  );
}

export function AdminAddCreditsContainer({
  field: { children },
}: {
  field: typeof definitions.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.POST>();
  const form = useWidgetForm<typeof definitions.POST>();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const responseOnly = useWidgetResponseOnly();
  const disabled = useWidgetDisabled();
  const isSubmitting = useWidgetIsSubmitting();
  const value = useWidgetValue<typeof definitions.POST>();
  const navigate = useRelatedEntityNavigation();
  const targetUserId = form?.watch("targetUserId");
  const definitionsRead = useMemo(() => ({ GET: definitions.GET }), []);
  const options = useMemo(
    () => ({
      read: {
        initialState: { targetUserId: targetUserId ?? "" },
        queryOptions: {
          enabled: Boolean(targetUserId) && !responseOnly,
          refetchOnWindowFocus: false,
        },
      },
    }),
    [targetUserId, responseOnly],
  );
  const { read } = useEndpoint(definitionsRead, options, logger, user);
  const recipient =
    read.response?.success && read.data?.id === targetUserId
      ? read.data
      : undefined;

  return (
    <WidgetShell className="gap-4">
      {!responseOnly && (
        <>
          <WidgetHeader
            title={t("adminAdd.post.container.title")}
            backButton={<NavigateButtonWidget field={children.backButton} />}
          />
          <Span className="text-sm text-muted-foreground">
            {t("adminAdd.post.container.description")}
          </Span>
          {targetUserId ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              disabled={disabled || isSubmitting}
              onClick={() => {
                form.resetField("amount");
                form.setValue("targetUserId", "", { shouldDirty: true });
              }}
            >
              {t("adminAdd.recipient.change")}
            </Button>
          ) : (
            <EntityPickerFieldWidget
              field={children.targetUserId}
              fieldName="targetUserId"
            />
          )}
          {targetUserId &&
            !recipient &&
            (read.response?.success === false && !read.isFetching ? (
              <EmptyBlock
                title={t("adminAdd.recipient.loadFailed")}
                message={read.response.message}
                action={
                  disabled
                    ? undefined
                    : {
                        label: t("adminAdd.recipient.retry"),
                        onClick: () => {
                          void read.refetch();
                        },
                      }
                }
              />
            ) : (
              <LoadingBlock message={t("adminAdd.recipient.loading")} />
            ))}
          {recipient && (
            <>
              <RelatedEntitiesPanel
                title={t("adminAdd.recipient.email")}
                emptyTitle={t("adminAdd.recipient.loadFailed")}
                items={[
                  {
                    id: recipient.id,
                    title: recipient.email,
                    subtitle: recipient.id,
                    action: {
                      label: t("adminAdd.recipient.openAccount"),
                      onClick: () =>
                        navigate(
                          () =>
                            import("@/users/view/definition").then(
                              (module) => module.default.GET,
                            ),
                          { data: { userId: recipient.id } },
                        ),
                    },
                  },
                ]}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field: amount }) => (
                  <FormItem>
                    <FormLabel>{t("adminAdd.post.amount.label")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        keyboardType="numeric"
                        name={amount.name}
                        value={String(amount.value ?? "")}
                        onChange={(event) =>
                          amount.onChange(event.target.value)
                        }
                        onBlur={amount.onBlur}
                        placeholder={t("adminAdd.post.amount.placeholder")}
                        disabled={disabled}
                      />
                    </FormControl>
                    <Span className="text-sm text-muted-foreground">
                      {t("adminAdd.post.amount.description")}
                    </Span>
                    <FormMessage t={t} />
                  </FormItem>
                )}
              />
              <SubmitButtonWidget<typeof definitions.POST>
                field={children.submitButton}
              />
            </>
          )}
        </>
      )}
      <FormAlertWidget field={{}} />
      {value?.message &&
        (responseOnly || value.recipientId === targetUserId) && (
          <Alert variant="success">{value.message}</Alert>
        )}
    </WidgetShell>
  );
}
