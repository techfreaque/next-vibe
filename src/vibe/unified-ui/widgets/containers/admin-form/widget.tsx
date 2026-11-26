"use client";

import { Div } from "next-vibe/ui/components/div";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import type { JSX, ReactNode } from "react";

import { cn } from "../../../_shared/cn";
import { CompactFieldHelpContext } from "../../form-fields/_shared/description-style";
import { FormAlertWidget } from "../../interactive/form-alert/widget";

/**
 * The one admin form template: page header (title, subtitle, Cancel/back),
 * form alert, section cards, and a footer whose primary action sits on the
 * right at its natural width (full width on a phone).
 */
export function AdminForm({
  title,
  description,
  backButton,
  primaryAction,
  secondaryActions,
  alert,
  result,
  width = "form",
  className,
  children,
}: {
  title: string;
  description?: string;
  backButton?: ReactNode;
  primaryAction: ReactNode;
  /** Outline/ghost actions shown left of the primary action. */
  secondaryActions?: ReactNode;
  alert?: ReactNode;
  /** Shown under the footer after a successful submit. */
  result?: ReactNode;
  /** `form` keeps inputs at a readable width; `wide` uses the page width. */
  width?: "form" | "wide";
  className?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <WidgetShell
      layout="page"
      className={cn(width === "form" && "mx-auto max-w-3xl", className)}
    >
      <WidgetHeader
        size="page"
        title={title}
        subtitle={description}
        backButton={backButton}
      />
      {alert ?? <FormAlertWidget field={{}} />}
      <CompactFieldHelpContext.Provider value="informative">
        {children}
      </CompactFieldHelpContext.Provider>
      <Div className="flex flex-col-reverse gap-2 @md:flex-row @md:items-center @md:justify-end [&>*]:w-full @md:[&>*]:w-auto">
        {secondaryActions}
        {primaryAction}
      </Div>
      {result}
    </WidgetShell>
  );
}

export function AdminFormSection({
  title,
  columns = 1,
  children,
}: {
  title: string;
  columns?: 1 | 2;
  children: ReactNode;
}): JSX.Element {
  return (
    <SectionGroup title={title}>
      <Div
        className={cn(
          "grid min-w-0 grid-cols-1 gap-4",
          columns === 2 && "@lg:grid-cols-2",
        )}
      >
        {children}
      </Div>
    </SectionGroup>
  );
}
