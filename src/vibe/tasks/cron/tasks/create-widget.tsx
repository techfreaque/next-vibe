/**
 * Custom Widget for creating a cron task (POST /cron/tasks)
 * Form with a JSON task-input editor, plus a readable summary of the created
 * task (owner resolved, task input pretty-printed) instead of raw field dumps.
 */

"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "next-vibe/ui/components/form/form";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { Pre } from "next-vibe/ui/components/pre";
import { Span } from "next-vibe/ui/components/span";
import { Textarea } from "next-vibe/ui/components/textarea";
import { H2, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";
import { useCallback } from "react";

import { getDefaultTimezone } from "../../../core/i18n/core/localization-utils";
import type { WidgetData } from "../../../core/utils/json";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "../../../unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "../../../unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "../../../unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "../../../unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "../../../unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "../../../unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "../../../unified-ui/widgets/interactive/submit-button/widget";
import { formatCronScheduleShort } from "../../cron-formatter";
import type endpoints from "./definition";
import type { CronTaskCreateResponseOutput } from "./definition";

type CreatedTask = CronTaskCreateResponseOutput["task"];

interface CreateWidgetProps {
  field: (typeof endpoints.POST)["fields"];
}

/** Form value -> editor text. Objects (prefill, AI) are pretty-printed. */
function toJsonText(
  value: string | Record<string, WidgetData> | undefined,
): string {
  if (value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value, null, 2);
}

function TaskInputField(): JSX.Element {
  const form = useWidgetForm<typeof endpoints.POST>();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const { t: tField } = useWidgetContext();

  return (
    <FormField
      control={form.control}
      name="taskInput"
      render={({ field: formField }) => (
        <FormItem className="flex flex-col gap-1.5">
          <FormLabel className="text-sm font-medium">
            {t("post.fields.taskInput.label")}
          </FormLabel>
          <FormControl>
            <Textarea
              value={toJsonText(formField.value)}
              onChange={(e) => formField.onChange(e.target.value)}
              onBlur={formField.onBlur}
              name={formField.name}
              rows={5}
              placeholder={t("post.fields.taskInput.placeholder")}
              className="font-mono text-sm"
            />
          </FormControl>
          <Span className="text-xs text-muted-foreground">
            {t("post.fields.taskInput.description")}
          </Span>
          <FormMessage t={tField} />
        </FormItem>
      )}
    />
  );
}

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: JSX.Element | string;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-0.5">
      <Span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </Span>
      <Div className="min-w-0 text-sm text-foreground break-words">
        {children}
      </Div>
    </Div>
  );
}

function CreatedTaskSummary({ task }: { task: CreatedTask }): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const { push: navigate } = useWidgetNavigation();

  const handleOpen = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("../[id]/definition");
      navigate(m.default.GET, { urlPathParams: { id: task.id } });
    })();
  }, [navigate, task.id]);

  const owner =
    task.owner.type === "system"
      ? t("widget.create.ownerSystem")
      : user && !user.isPublic && user.id === task.owner.userId
        ? t("widget.create.ownerYou")
        : t("widget.create.ownerUser", { id: task.owner.userId.slice(0, 8) });

  const nextRun = task.nextExecutionAt
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(task.nextExecutionAt))
    : t("widget.create.notScheduled");

  const hasInput = Object.keys(task.taskInput).length > 0;

  return (
    <Div className="flex flex-col gap-4 rounded-lg border border-success/30 bg-success/5 p-4">
      <Div className="flex flex-col gap-1.5">
        <Div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          <Span className="text-sm font-medium text-success">
            {t("widget.create.created")}
          </Span>
        </Div>
        <Div className="flex flex-wrap items-center gap-2">
          <Span className="text-base font-semibold text-foreground">
            {task.displayName}
          </Span>
          <Badge variant={task.enabled ? "secondary" : "outline"}>
            {task.enabled
              ? t("widget.create.enabled")
              : t("widget.create.disabled")}
          </Badge>
        </Div>
      </Div>

      <Div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SummaryRow label={t("widget.create.route")}>
          <Span className="font-mono text-xs">{task.routeId}</Span>
        </SummaryRow>
        <SummaryRow label={t("widget.create.schedule")}>
          {`${formatCronScheduleShort(
            task.schedule,
            task.timezone ?? getDefaultTimezone(locale),
            locale,
            logger,
          )} · ${task.schedule}`}
        </SummaryRow>
        <SummaryRow label={t("widget.create.nextRun")}>{nextRun}</SummaryRow>
        <SummaryRow label={t("widget.create.owner")}>{owner}</SummaryRow>
        <Div className="sm:col-span-2">
          <SummaryRow label={t("widget.create.taskInput")}>
            {hasInput ? (
              <Pre className="m-0 max-h-60 overflow-auto rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap break-words">
                {JSON.stringify(task.taskInput, null, 2)}
              </Pre>
            ) : (
              <Span className="text-muted-foreground">
                {t("widget.create.noInput")}
              </Span>
            )}
          </SummaryRow>
        </Div>
      </Div>

      <Div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={handleOpen}
        >
          {t("widget.create.openTask")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Div>
    </Div>
  );
}

export function CronTaskCreateContainer({
  field,
}: CreateWidgetProps): JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const value = useWidgetValue<typeof endpoints.POST>();
  const responseOnly = useWidgetResponseOnly();
  const created = value?.task;

  if (responseOnly) {
    return created ? <CreatedTaskSummary task={created} /> : <></>;
  }

  return (
    <Div className="flex flex-col gap-5 p-4">
      <Div className="flex items-start gap-2">
        <NavigateButtonWidget field={{}} />
        <Div className="flex min-w-0 flex-col gap-0.5">
          <H2 className="text-xl font-semibold">{t("post.container.title")}</H2>
          <P className="m-0 text-sm text-muted-foreground">
            {t("post.container.description")}
          </P>
        </Div>
      </Div>

      {created ? <CreatedTaskSummary task={created} /> : null}

      <Div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Div className="sm:col-span-2">
          <TextFieldWidget field={children.routeId} fieldName="routeId" />
        </Div>
        <Div className="sm:col-span-2">
          <TextFieldWidget
            field={children.displayName}
            fieldName="displayName"
          />
        </Div>
        <TextFieldWidget field={children.id} fieldName="id" />
        <TextFieldWidget field={children.schedule} fieldName="schedule" />
        <Div className="sm:col-span-2">
          <TextareaFieldWidget
            field={children.description}
            fieldName="description"
          />
        </Div>
        <SelectFieldWidget field={children.priority} fieldName="priority" />
        <SelectFieldWidget field={children.category} fieldName="category" />
        <SelectFieldWidget field={children.outputMode} fieldName="outputMode" />
        <TextFieldWidget
          field={children.targetInstance}
          fieldName="targetInstance"
        />
        <Div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NumberFieldWidget field={children.timeout} fieldName="timeout" />
          <NumberFieldWidget field={children.retries} fieldName="retries" />
          <NumberFieldWidget
            field={children.retryDelay}
            fieldName="retryDelay"
          />
        </Div>
        <Div className="sm:col-span-2 flex flex-wrap gap-x-6 gap-y-3">
          <BooleanFieldWidget field={children.enabled} fieldName="enabled" />
          <BooleanFieldWidget field={children.hidden} fieldName="hidden" />
          <BooleanFieldWidget field={children.runOnce} fieldName="runOnce" />
        </Div>
        <Div className="sm:col-span-2">
          <TaskInputField />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <Div className="flex justify-end">
        <SubmitButtonWidget<typeof endpoints.POST> field={{}} />
      </Div>
    </Div>
  );
}
