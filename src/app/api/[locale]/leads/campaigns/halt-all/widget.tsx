/**
 * Halt All Campaigns Widget
 * Red danger card with confirmation dialog
 */

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "next-vibe-ui/ui/alert-dialog";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React from "react";

import {
  useWidgetContext,
  useWidgetForm,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";

import type definition from "./definition";

interface HaltAllWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function HaltAllWidget({
  field,
}: HaltAllWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = endpointMutations?.create?.isSubmitting;
  const response = useWidgetValue<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-3 p-4 border-destructive/30">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <Span className="font-semibold text-sm">{t("widget.title")}</Span>
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-auto" />
        )}
      </Div>

      <P className="text-xs text-muted-foreground">{t("widget.description")}</P>

      <FormAlertWidget field={{}} />

      {/* Reason input */}
      <TextFieldWidget fieldName="reason" field={children.reason} />

      {/* Halt button with confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("widget.halting")}
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t("widget.haltButton")}
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("widget.confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("widget.confirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("widget.cancelButton")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => {
                form.setValue("confirm", true);
                onSubmit?.();
              }}
            >
              {t("widget.confirmButton")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success result */}
      {response && (
        <Div className="rounded-lg bg-destructive/10 p-3 flex flex-col gap-1">
          <Div className="flex items-center gap-1 text-destructive text-xs font-medium">
            <Check className="h-3 w-3" />
            <Span>{t("widget.done")}</Span>
          </Div>
          <Div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <Span className="text-muted-foreground">
              {t("post.response.halted")}
            </Span>
            <Span className="font-mono font-medium">{response.halted}</Span>
            <Span className="text-muted-foreground">
              {t("post.response.emailsCancelled")}
            </Span>
            <Span className="font-mono font-medium">
              {response.emailsCancelled}
            </Span>
          </Div>
        </Div>
      )}
    </Div>
  );
}
