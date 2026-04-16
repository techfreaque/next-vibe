/**
 * Admin Add Credits Widget
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
import { Coins } from "next-vibe-ui/ui/icons/Coins";
import { Minus } from "next-vibe-ui/ui/icons/Minus";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetForm,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function AdminAddCreditsContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm();
  const user = useWidgetUser();
  const value = useWidgetValue<typeof definition.POST>();
  const children = field.children;

  const amount = form.watch("amount") ?? 100;
  const targetUserId = form.watch("targetUserId");
  const isSelf = !targetUserId || ("id" in user && user.id === targetUserId);

  function setAmount(next: number): void {
    const clamped = Math.max(1, next);
    form.setValue("amount", clamped, { shouldValidate: true });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          {isSelf
            ? t("adminAdd.post.container.selfTitle")
            : t("adminAdd.post.container.title")}
        </CardTitle>
        <CardDescription>
          {isSelf
            ? t("adminAdd.post.container.selfDescription")
            : t("adminAdd.post.container.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <FormAlertWidget field={{}} />

        {value?.message && (
          <Div className="rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success-foreground">
            {value.message}
          </Div>
        )}

        <Div className="flex flex-col gap-2">
          <Span className="text-sm font-medium text-muted-foreground">
            {t("adminAdd.post.amount.label")}
          </Span>
          <Div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-14 w-14 rounded-none border-r border-border flex-shrink-0"
              onClick={() => setAmount(amount - 100)}
              disabled={amount <= 1}
            >
              <Minus className="h-5 w-5" />
            </Button>
            <Div className="flex-1 flex flex-col items-center justify-center h-14 select-none">
              <Span className="text-2xl font-bold tabular-nums">{amount}</Span>
              <Span className="text-xs text-muted-foreground">credits</Span>
            </Div>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-14 w-14 rounded-none border-l border-border flex-shrink-0"
              onClick={() => setAmount(amount + 100)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Div>
        </Div>

        <Div className="flex gap-2">
          <NavigateButtonWidget field={children.backButton} />
          <SubmitButtonWidget<typeof definition.POST>
            field={children.submitButton}
          />
        </Div>
      </CardContent>
    </Card>
  );
}
