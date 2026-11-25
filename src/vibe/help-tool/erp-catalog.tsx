"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe/ui/components/accordion";
import { Button } from "next-vibe/ui/components/button";
import { Card, CardFooter, CardHeader } from "next-vibe/ui/components/card";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Banknote } from "next-vibe/ui/components/icons/Banknote";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Calendar } from "next-vibe/ui/components/icons/Calendar";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Download } from "next-vibe/ui/components/icons/Download";
import { FileText } from "next-vibe/ui/components/icons/FileText";
import { Package } from "next-vibe/ui/components/icons/Package";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Receipt } from "next-vibe/ui/components/icons/Receipt";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { H1, H2, H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import {
  erpEntryPoints,
  erpInvoiceCreate,
  erpWorkflows,
} from "./erp-workflows";
import type { HelpT } from "./i18n";

interface ErpCatalogProps {
  available: ReadonlySet<string>;
  t: HelpT;
  onOpenTool: (alias: string) => void;
}

export function ErpCatalogIntro({
  available,
  t,
  onOpenTool,
  hasActiveCompany,
  hasNoCompany,
}: ErpCatalogProps & {
  hasActiveCompany: boolean;
  hasNoCompany: boolean;
}): JSX.Element {
  const primary = hasActiveCompany
    ? { alias: erpInvoiceCreate, label: t("erp.newInvoice") }
    : hasNoCompany
      ? { alias: erpEntryPoints.createCompany, label: t("erp.createCompany") }
      : undefined;
  const hasPrimary = primary && available.has(primary.alias);
  return (
    <Div className="flex flex-col gap-3 @4xl:flex-row @4xl:items-start @4xl:justify-between">
      <Div className="flex min-w-0 flex-col gap-1.5">
        <H1 className="break-words text-2xl font-semibold tracking-tight lg:text-3xl">
          {t("erp.title")}
        </H1>
        <P className="text-sm text-muted-foreground">
          {t(hasActiveCompany ? "erp.activeDescription" : "erp.description")}
        </P>
      </Div>
      <Div className="flex flex-wrap items-center gap-2">
        {hasPrimary && (
          <Button
            type="button"
            className="min-h-11"
            onClick={() => onOpenTool(primary.alias)}
          >
            <Plus className="size-4 shrink-0" />
            {primary.label}
          </Button>
        )}
        {available.has(erpEntryPoints.company) && (
          <Button
            type="button"
            variant={hasPrimary ? "outline" : "default"}
            className="min-h-11"
            onClick={() => onOpenTool(erpEntryPoints.company)}
          >
            {t("erp.companies")}
          </Button>
        )}
      </Div>
    </Div>
  );
}

const workflowIcons = {
  sales: FileText,
  expenses: Receipt,
  receivables: Wallet,
  payables: Banknote,
  bank: CreditCard,
  stock: Package,
  tax: BookOpen,
  exports: Download,
  close: Calendar,
};

export function ErpCatalogWorkflows({
  available,
  t,
  onOpenTool,
}: ErpCatalogProps): JSX.Element | null {
  const workflows = erpWorkflows.flatMap(({ key, primary, secondary }) => {
    const primaryAction = available.has(primary)
      ? { alias: primary, title: t(`erp.${key}.primary`), primary: true }
      : undefined;
    const secondaryAction =
      secondary && available.has(secondary)
        ? { alias: secondary, title: t(`erp.${key}.secondary`), primary: false }
        : undefined;
    const actions = [primaryAction, secondaryAction].filter(
      (action) => action !== undefined,
    );
    return actions.length > 0
      ? [
          {
            key,
            title: t(`erp.${key}.title`),
            description: t(`erp.${key}.description`),
            icon: workflowIcons[key],
            actions,
          },
        ]
      : [];
  });
  if (workflows.length === 0) {
    return null;
  }

  return (
    <Div className="flex flex-col gap-3">
      <H2 className="border-0 pb-0 text-lg font-semibold">
        {t("erp.workflows")}
      </H2>
      <Accordion
        collapsible
        className="rounded-lg border bg-card px-4 @xl:hidden"
      >
        {workflows.map(({ key, title, description, actions, icon: Icon }) => (
          <AccordionItem key={key} value={key} className="last:border-b-0">
            <AccordionTrigger className="min-h-11 gap-3 py-2 text-start">
              <Icon
                className="size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <Div className="min-w-0 flex-1">{title}</Div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3 pb-3">
              <P className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </P>
              <Div className="flex flex-wrap gap-2">
                {actions.map((action) => (
                  <Button
                    key={action.alias}
                    type="button"
                    variant={action.primary ? "outline" : "secondary"}
                    size="sm"
                    className="h-auto min-h-11 max-w-full whitespace-normal text-start"
                    onClick={() => onOpenTool(action.alias)}
                  >
                    {action.title}
                  </Button>
                ))}
              </Div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Div className="hidden min-w-0 gap-3 @xl:grid @xl:grid-cols-2 @4xl:grid-cols-3">
        {workflows.map(({ key, title, description, actions, icon: Icon }) => (
          <Card key={key} className="flex min-w-0 flex-col shadow-none">
            <CardHeader className="flex-1 gap-3 p-4">
              <Div className="flex min-w-0 items-center gap-2">
                <Icon
                  className="size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <H3 className="break-words text-base font-semibold">{title}</H3>
              </Div>
              <P className="break-words text-sm leading-relaxed text-muted-foreground">
                {description}
              </P>
            </CardHeader>
            <CardFooter className="flex flex-wrap items-start gap-2 px-4 pb-4">
              {actions.map((action) => (
                <Button
                  key={action.alias}
                  type="button"
                  size="sm"
                  variant={action.primary ? "outline" : "secondary"}
                  className="h-auto min-h-9 max-w-full whitespace-normal text-start"
                  onClick={() => onOpenTool(action.alias)}
                >
                  {action.title}
                  {action.primary && <ArrowRight className="size-4 shrink-0" />}
                </Button>
              ))}
            </CardFooter>
          </Card>
        ))}
      </Div>
    </Div>
  );
}
