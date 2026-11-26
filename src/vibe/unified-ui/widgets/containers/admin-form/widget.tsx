"use client";

import { Div } from "next-vibe/ui/components/div";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import type { JSX, ReactNode } from "react";

import { cn } from "../../../_shared/cn";
import { CompactFieldHelpContext } from "../../form-fields/_shared/description-style";
import { FormAlertWidget } from "../../interactive/form-alert/widget";

export function AdminForm({
  title,
  description,
  backButton,
  primaryAction,
  alert,
  className,
  children,
}: {
  title: string;
  description?: string;
  backButton?: ReactNode;
  primaryAction: ReactNode;
  alert?: ReactNode;
  className?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <WidgetShell layout="page" className={className}>
      <WidgetHeader
        size="page"
        title={title}
        subtitle={description}
        backButton={backButton}
      />
      {alert ?? <FormAlertWidget field={{}} />}
      <CompactFieldHelpContext.Provider value>
        {children}
      </CompactFieldHelpContext.Provider>
      <Div className="flex justify-end [&>*]:w-full @sm:[&>*]:w-auto">
        {primaryAction}
      </Div>
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
