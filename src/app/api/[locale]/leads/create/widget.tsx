/**
 * Custom Widget for Lead Create
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle, Globe, Mail, Plus, Tag } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";

type PostResponseOutput = typeof definition.POST.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  SUBSCRIPTION_CONFIRMED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  UNSUBSCRIBED:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  BOUNCED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export function LeadCreateContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const router = useRouter();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();

  const createdLeadId = data?.lead?.summary?.id;
  const businessName = data?.lead?.summary?.businessName;
  const email = data?.lead?.summary?.email;
  const status = data?.lead?.summary?.status;
  const country = data?.lead?.contactDetails?.country;
  const source = data?.lead?.trackingInfo?.source;

  const handleViewLead = useCallback((): void => {
    if (!createdLeadId) {
      return;
    }
    router.push(`/${locale}/admin/leads/${createdLeadId}/edit`);
  }, [router, locale, createdLeadId]);

  const handleEditLead = useCallback((): void => {
    if (!createdLeadId) {
      return;
    }
    router.push(`/${locale}/admin/leads/${createdLeadId}/edit`);
  }, [router, locale, createdLeadId]);

  const handleBackToList = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  const handleCopyId = useCallback((): void => {
    if (!createdLeadId) {
      return;
    }
    void navigator.clipboard.writeText(createdLeadId);
  }, [createdLeadId]);

  // Success state
  if (data?.lead?.summary?.id) {
    return (
      <Div className="flex flex-col gap-0">
        <Div className="flex items-center gap-2 p-4 border-b">
          <NavigateButtonWidget field={children.backButton} />
          <Div className="flex items-center gap-2 mr-auto">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <Span className="font-semibold text-base">
              {t("app.api.leads.create.widget.headerLeadCreated")}
            </Span>
          </Div>
        </Div>
        <Div className="p-4 flex flex-col gap-4">
          <Div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
            <Div className="flex items-center gap-2 flex-wrap">
              <Span className="font-semibold text-base">
                {businessName ?? email ?? "—"}
              </Span>
              {status && (
                <Span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800",
                  )}
                >
                  {status.replace(/_/g, " ")}
                </Span>
              )}
            </Div>
            {email && (
              <Div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <Span>{email}</Span>
              </Div>
            )}
            {country && (
              <Div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
                <Span>{country}</Span>
              </Div>
            )}
            {source && (
              <Div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                <Span>{source.replace(/_/g, " ")}</Span>
              </Div>
            )}
            {createdLeadId && (
              <Div className="flex items-center gap-2 pt-1 border-t">
                <Span className="text-xs font-mono text-muted-foreground truncate flex-1">
                  {createdLeadId}
                </Span>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-xs h-auto p-0"
                  onClick={handleCopyId}
                >
                  {t("app.api.leads.create.widget.buttonCopyId")}
                </Button>
              </Div>
            )}
          </Div>
          <Div className="flex flex-col gap-2">
            <Button type="button" variant="default" onClick={handleViewLead}>
              {t("app.api.leads.create.widget.buttonViewLead")}
            </Button>
            <Button type="button" variant="outline" onClick={handleEditLead}>
              {t("app.api.leads.create.widget.buttonEditLead")}
            </Button>
            <Button type="button" variant="outline" onClick={handleBackToList}>
              {t("app.api.leads.create.widget.buttonBackToList")}
            </Button>
          </Div>
        </Div>
      </Div>
    );
  }

  // Form state — render each field directly, exactly like favs pattern
  return (
    <Div className="flex flex-col gap-0">
      {/* Top actions */}
      <Div className="flex items-center gap-2 px-4 pt-4 pb-4">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-1 mr-auto">
          <Plus className="h-4 w-4 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.leads.create.widget.headerCreateLead")}
          </Span>
        </Div>
        <SubmitButtonWidget
          field={{
            text: "app.api.leads.create.post.submitButton.label",
            loadingText: "app.api.leads.create.post.submitButton.loadingText",
            icon: "user-plus",
            variant: "primary",
          }}
        />
      </Div>

      {/* Form fields */}
      <Div className="overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4 flex flex-col gap-4">
        <FormAlertWidget field={{}} />

        {/* Contact info */}
        <TextFieldWidget
          fieldName="contactInfo.email"
          field={withValue(
            children.contactInfo.children.email,
            undefined,
            null,
          )}
        />
        <TextFieldWidget
          fieldName="contactInfo.businessName"
          field={withValue(
            children.contactInfo.children.businessName,
            undefined,
            null,
          )}
        />
        <TextFieldWidget
          fieldName="contactInfo.phone"
          field={withValue(
            children.contactInfo.children.phone,
            undefined,
            null,
          )}
        />
        <TextFieldWidget
          fieldName="contactInfo.website"
          field={withValue(
            children.contactInfo.children.website,
            undefined,
            null,
          )}
        />

        {/* Location */}
        <SelectFieldWidget
          fieldName="locationPreferences.country"
          field={children.locationPreferences.children.country}
        />
        <SelectFieldWidget
          fieldName="locationPreferences.language"
          field={children.locationPreferences.children.language}
        />

        {/* Lead details */}
        <SelectFieldWidget
          fieldName="leadDetails.source"
          field={children.leadDetails.children.source}
        />
        <TextareaFieldWidget
          fieldName="leadDetails.notes"
          field={withValue(
            children.leadDetails.children.notes,
            undefined,
            null,
          )}
        />
      </Div>
    </Div>
  );
}
