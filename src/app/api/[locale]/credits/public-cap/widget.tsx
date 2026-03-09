/**
 * Public Free-Tier Daily Cap Widget
 * Shows the current daily free-pool status for admin view.
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Database } from "next-vibe-ui/ui/icons/Database";
import { Minus } from "next-vibe-ui/ui/icons/Minus";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H3 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import {
  useWidgetForm,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";

import type definition from "./definition";
import type {
  PublicCapGetResponseOutput,
  PublicCapPostResponseOutput,
} from "./definition";

interface GetWidgetProps {
  field: {
    value: PublicCapGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

interface PostWidgetProps {
  field: {
    value: PublicCapPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

function usageColor(percent: number): string {
  return percent >= 90
    ? "text-red-500"
    : percent >= 70
      ? "text-amber-500"
      : "text-green-500";
}

export function PublicCapContainer({ field }: GetWidgetProps): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const cap = field.value;

  const spendToday = cap?.spendToday ?? 0;
  const capAmount = cap?.capAmount ?? 0;
  const remainingToday = cap?.remainingToday ?? 0;
  const percentUsed = cap?.percentUsed ?? 0;
  const capExceeded = cap?.capExceeded ?? false;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Card
        className={
          capExceeded ? "border-red-400 dark:border-red-600" : undefined
        }
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            {t("get.container.title")}
          </CardTitle>
          <CardDescription>{t("get.container.description")}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Usage bar */}
          <Div className="flex flex-col gap-2">
            <Div className="flex justify-between text-sm">
              <Span className="text-muted-foreground">
                {t("get.spendToday.content")}:{" "}
                <Span className="font-semibold text-foreground">
                  {spendToday.toLocaleString()}
                </Span>
              </Span>
              <Span className="text-muted-foreground">
                {t("get.capAmount.content")}:{" "}
                <Span className="font-semibold text-foreground">
                  {capAmount.toLocaleString()}
                </Span>
              </Span>
            </Div>
            <Div className="flex justify-between text-xs text-muted-foreground">
              <Span className={`font-semibold ${usageColor(percentUsed)}`}>
                {percentUsed.toFixed(1)}% {t("get.percentUsed.content")}
              </Span>
              {capExceeded ? (
                <Span className="text-red-500 font-medium">
                  {t("get.capExceeded.content")}
                </Span>
              ) : (
                <Span>
                  {t("get.remainingToday.content")}:{" "}
                  {remainingToday.toLocaleString()}
                </Span>
              )}
            </Div>
          </Div>

          {/* Stat row */}
          <Div className="grid grid-cols-3 gap-3">
            {[
              {
                label: t("get.spendToday.content"),
                value: spendToday.toLocaleString(),
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-900/20",
              },
              {
                label: t("get.remainingToday.content"),
                value: remainingToday.toLocaleString(),
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-50 dark:bg-green-900/20",
              },
              {
                label: t("get.capAmount.content"),
                value: capAmount.toLocaleString(),
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-50 dark:bg-blue-900/20",
              },
            ].map((stat) => (
              <Div
                key={stat.label}
                className={`flex flex-col items-center p-3 rounded-lg ${stat.bg} gap-1`}
              >
                <H3 className={`text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </H3>
                <Span className="text-xs text-muted-foreground text-center">
                  {stat.label}
                </Span>
              </Div>
            ))}
          </Div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}

export function PublicCapUpdateContainer({
  field,
}: PostWidgetProps): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const capAmount: number = Number(form?.watch("capAmount") ?? 500) || 500;

  function setCap(next: number): void {
    const clamped = Math.max(1, next);
    form?.setValue("capAmount", clamped, { shouldValidate: true });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          {t("post.title")}
        </CardTitle>
        <CardDescription>{t("post.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <FormAlertWidget field={{}} />

        {field.value?.message && (
          <Div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-300">
            {field.value.message}
          </Div>
        )}

        <Div className="flex flex-col gap-2">
          <Span className="text-sm font-medium text-muted-foreground">
            {t("post.capAmount.label")}
          </Span>
          <Div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-14 w-14 rounded-none border-r border-border flex-shrink-0"
              onClick={() => setCap(capAmount - 100)}
              disabled={capAmount <= 1}
            >
              <Minus className="h-5 w-5" />
            </Button>
            <Div className="flex-1 flex flex-col items-center justify-center h-14 select-none">
              <Span className="text-2xl font-bold tabular-nums">
                {capAmount.toLocaleString()}
              </Span>
              <Span className="text-xs text-muted-foreground">credits/day</Span>
            </Div>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-14 w-14 rounded-none border-l border-border flex-shrink-0"
              onClick={() => setCap(capAmount + 100)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Div>
        </Div>

        <Button type="button" className="w-full" size="lg" onClick={onSubmit}>
          {t("post.title")}
        </Button>
      </CardContent>
    </Card>
  );
}
