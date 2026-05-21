"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Phone } from "next-vibe-ui/ui/icons/Phone";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { ShoppingCart } from "next-vibe-ui/ui/icons/ShoppingCart";
import { User } from "next-vibe-ui/ui/icons/User";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import { Textarea } from "next-vibe-ui/ui/textarea";
import React, { useCallback, useMemo } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

// ─── Selection helpers ──────────────────────────────────────────────────────
// Selection state is encoded in inquiryMessage as a JSON prefix:
//   "§[\"id1\",\"id2\"]§ actual user message"
// On submit we strip the prefix and update logicalId to only selected ids.

const SEL_RE = /^§(\[.*?\])§ ?/;

function encodeSelection(ids: string[], message: string): string {
  return `§${JSON.stringify(ids)}§ ${message}`;
}

function decodeSelection(raw: string): {
  ids: string[] | null;
  message: string;
} {
  const m = SEL_RE.exec(raw);
  if (!m) {
    return { ids: null, message: raw };
  }
  try {
    const ids = JSON.parse(m[1]) as string[];
    return { ids, message: raw.slice(m[0].length) };
  } catch {
    return { ids: null, message: raw };
  }
}

// ─── Shared UI ──────────────────────────────────────────────────────────────

function TopBar({
  onBack,
  children,
}: {
  onBack: () => void;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0 bg-background">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 shrink-0"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      {children}
    </Div>
  );
}

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <Div
      className={cn(
        "rounded-2xl border bg-card shadow-xs overflow-hidden",
        className,
      )}
    >
      {children}
    </Div>
  );
}

function SectionHead({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/20">
      <Span className="text-muted-foreground">{icon}</Span>
      <Span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Span>
    </Div>
  );
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {children}
      {hint && (
        <Span className="text-[11px] text-muted-foreground leading-snug">
          {hint}
        </Span>
      )}
    </Div>
  );
}

// ─── PurchaseInquiryContainer ────────────────────────────────────────────────

export function PurchaseInquiryContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const value = useWidgetValue<typeof definition.POST>();

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  // All device ids / labels come in as proper arrays from the definition schema
  const rawIds = form.watch("logicalId");
  const rawLabels = form.watch("deviceLabel");
  const orgResourceIdValue = form.watch("orgResourceId") ?? "";
  const contactNameValue = form.watch("contactName") ?? "";
  const contactEmailValue = form.watch("contactEmail") ?? "";
  const contactPhoneValue = form.watch("contactPhone") ?? "";
  const requestedMonthsValue = form.watch("requestedMonths");
  const rawInquiry = form.watch("inquiryMessage") ?? "";

  // Stabilize arrays — form.watch returns new refs every render
  const allIds: string[] = useMemo(
    () => rawIds ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawIds?.join(",")],
  );
  const allLabels: string[] = useMemo(
    () => rawLabels ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawLabels?.join(",")],
  );

  // Derive selected ids from inquiryMessage prefix; default = all
  const { ids: selectionOverride, message: userMessage } = useMemo(
    () => decodeSelection(rawInquiry),
    [rawInquiry],
  );
  const selectedIds: string[] = selectionOverride ?? allIds;
  const isMulti = allIds.length > 1;

  const toggleDevice = useCallback(
    (id: string): void => {
      const next = selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id];
      form.setValue("inquiryMessage", encodeSelection(next, userMessage), {
        shouldDirty: true,
      });
    },
    [form, selectedIds, userMessage],
  );

  const toggleAll = useCallback((): void => {
    const allSelected = selectedIds.length === allIds.length;
    const next = allSelected ? [] : allIds;
    form.setValue("inquiryMessage", encodeSelection(next, userMessage), {
      shouldDirty: true,
    });
  }, [form, selectedIds, allIds, userMessage]);

  const handleSubmit = useCallback((): void => {
    // Set logicalId to only selected, strip selection prefix from message
    form.setValue("logicalId", selectedIds, { shouldDirty: true });
    const selectedLabels = selectedIds
      .map((id) => allLabels[allIds.indexOf(id)] ?? "")
      .filter(Boolean);
    if (selectedLabels.length) {
      form.setValue("deviceLabel", selectedLabels, { shouldDirty: true });
    }
    form.setValue("inquiryMessage", userMessage || undefined, {
      shouldDirty: true,
    });
    onSubmit?.();
  }, [form, selectedIds, allIds, allLabels, userMessage, onSubmit]);

  // ── Compact ──
  if (isCompact) {
    if (value) {
      return (
        <Div className="flex-col">
          <Div>{`inquiry:${value.inquiryId} — ${value.confirmationMessage}`}</Div>
        </Div>
      );
    }
    return <Div />;
  }

  // ── Success ──
  if (value !== null && value !== undefined) {
    return (
      <Div className="flex flex-col min-h-0 bg-background">
        <TopBar onBack={goBack}>
          <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <Span className="font-semibold text-sm mr-auto">
            {t("post.success.title")}
          </Span>
        </TopBar>
        <Div className="p-6 flex flex-col items-center gap-5">
          <Div className="relative">
            <Div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center">
              <ShoppingCart className="h-7 w-7 text-success" />
            </Div>
            <Div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center border-2 border-background">
              <Check className="h-3 w-3 text-white" />
            </Div>
          </Div>

          <Div className="text-center">
            <Span className="font-bold text-base block">
              {t("post.success.title")}
            </Span>
            <Span className="text-sm text-muted-foreground block mt-1">
              {t("post.success.description")}
            </Span>
          </Div>

          <SectionCard className="w-full">
            <Div className="flex items-center justify-between px-4 py-3 border-b">
              <Span className="text-xs text-muted-foreground">
                {t("post.response.inquiryId")}
              </Span>
              <Span className="text-xs font-mono font-bold">
                {`#${value.inquiryId}`}
              </Span>
            </Div>
            <Div className="px-4 py-3">
              <Span className="text-xs text-muted-foreground leading-relaxed">
                {value.confirmationMessage}
              </Span>
            </Div>
          </SectionCard>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => goBack()}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("post.widget.back")}
          </Button>
        </Div>
      </Div>
    );
  }

  // ── Form ──
  return (
    <Div className="flex flex-col bg-background">
      <TopBar onBack={goBack}>
        <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </TopBar>

      <Div className="p-4 flex flex-col gap-3">
        {/* ── Device checklist ── */}
        <SectionCard>
          <SectionHead
            icon={<Server className="h-3.5 w-3.5" />}
            label={t("post.widget.sections.device")}
          />
          {isMulti && (
            <Div className="flex items-center justify-between px-4 py-2 border-b bg-muted/10">
              <Span className="text-xs text-muted-foreground">
                {selectedIds.length} / {allIds.length}{" "}
                {t("post.widget.selected")}
              </Span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2 text-muted-foreground"
                onClick={toggleAll}
              >
                {selectedIds.length === allIds.length
                  ? t("post.widget.deselectAll")
                  : t("post.widget.selectAll")}
              </Button>
            </Div>
          )}
          <Div className="flex flex-col divide-y">
            {allIds.map((id, idx) => {
              const label = allLabels[idx] ?? "";
              const isSelected = selectedIds.includes(id);
              return (
                <Div
                  key={id}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 transition-colors cursor-pointer",
                    isMulti
                      ? isSelected
                        ? "bg-background"
                        : "bg-muted/20 opacity-50"
                      : "bg-background",
                  )}
                  onClick={isMulti ? () => toggleDevice(id) : undefined}
                >
                  {isMulti && (
                    <Div
                      className={cn(
                        "h-4 w-4 rounded shrink-0 border flex items-center justify-center",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-border bg-background",
                      )}
                    >
                      {isSelected && (
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      )}
                    </Div>
                  )}
                  <Div className="flex-1 min-w-0">
                    {label ? (
                      <Span className="font-medium text-xs block truncate leading-tight">
                        {label}
                      </Span>
                    ) : null}
                    <Span className="font-mono text-[10px] text-muted-foreground block truncate">
                      {id}
                    </Span>
                  </Div>
                  <Span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">
                    {t("post.widget.noSub")}
                  </Span>
                </Div>
              );
            })}
          </Div>
          {orgResourceIdValue ? (
            <Div className="flex items-center gap-2 px-4 py-2.5 border-t bg-muted/10">
              <Span className="text-[10px] text-muted-foreground">
                {t("post.orgResourceId.label")}:
              </Span>
              <Span className="text-[10px] font-mono text-muted-foreground truncate">
                {orgResourceIdValue}
              </Span>
            </Div>
          ) : null}
        </SectionCard>

        {/* ── Contact details ── */}
        <SectionCard>
          <SectionHead
            icon={<User className="h-3.5 w-3.5" />}
            label={t("post.widget.sections.contact")}
          />
          <Div className="p-4 flex flex-col gap-4">
            <FormField label={t("post.contactName.label")}>
              <Div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={contactNameValue}
                  onChange={(e) =>
                    form.setValue("contactName", e.target.value, {
                      shouldDirty: true,
                    })
                  }
                  className="pl-9"
                  placeholder="Full name"
                />
              </Div>
            </FormField>

            <FormField label={t("post.contactEmail.label")}>
              <Div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  value={contactEmailValue}
                  onChange={(e) =>
                    form.setValue("contactEmail", e.target.value, {
                      shouldDirty: true,
                    })
                  }
                  className="pl-9"
                  placeholder="email@example.com"
                />
              </Div>
            </FormField>

            <Div className="grid grid-cols-2 gap-3">
              <FormField label={t("post.contactPhone.label")}>
                <Div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="tel"
                    value={contactPhoneValue}
                    onChange={(e) =>
                      form.setValue(
                        "contactPhone",
                        e.target.value || undefined,
                        { shouldDirty: true },
                      )
                    }
                    className="pl-9"
                    placeholder="+1 555-0100"
                  />
                </Div>
              </FormField>

              <FormField label={t("post.requestedMonths.label")}>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={requestedMonthsValue}
                  onChange={(e) =>
                    form.setValue(
                      "requestedMonths",
                      e.target.value ? Number(e.target.value) : undefined,
                      { shouldDirty: true },
                    )
                  }
                  placeholder="12"
                />
              </FormField>
            </Div>

            <FormField label={t("post.inquiryMessage.label")}>
              <Textarea
                value={userMessage}
                onChange={(e) =>
                  form.setValue(
                    "inquiryMessage",
                    selectionOverride !== null
                      ? encodeSelection(selectedIds, e.target.value)
                      : e.target.value || undefined,
                    { shouldDirty: true },
                  )
                }
                rows={3}
                placeholder={t("post.widget.description")}
              />
            </FormField>
          </Div>
        </SectionCard>

        {/* ── Submit ── */}
        <Button
          type="button"
          variant="default"
          className="w-full gap-2 h-10 text-sm font-semibold"
          onClick={handleSubmit}
          disabled={selectedIds.length === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          {selectedIds.length > 1
            ? `${t("post.widget.submit")} (${selectedIds.length})`
            : t("post.widget.submit")}
        </Button>
      </Div>
    </Div>
  );
}
