/**
 * Custom Widget for Lead Create
 */

"use client";
import { LeadStatus } from "next-vibe/identity/lead/enum";
import { scopedTranslation as leadsScopedTranslation } from "next-vibe/identity/lead/i18n";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Tag } from "next-vibe/ui/components/icons/Tag";
import { Span } from "next-vibe/ui/components/span";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import React, { useCallback, useEffect } from "react";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

const STATUS_COLORS: Record<string, string> = {
  [LeadStatus.NEW]: "bg-info/10 text-info",
  [LeadStatus.PENDING]: "bg-warning/10 text-warning",
  [LeadStatus.SUBSCRIPTION_CONFIRMED]: "bg-success/10 text-success",
  [LeadStatus.UNSUBSCRIBED]:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  [LeadStatus.BOUNCED]: "bg-destructive/10 text-destructive",
};

export function LeadCreateContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const { push: navigate } = useWidgetNavigation();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.POST>();
  const logger = useWidgetLogger();
  const { t: leadsT } = leadsScopedTranslation.scopedT(locale);

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
    void (async (): Promise<void> => {
      const leadDef = await import("@/leads/[id]/definition");
      navigate(leadDef.default.GET, { urlPathParams: { id: createdLeadId } });
    })();
  }, [navigate, createdLeadId]);

  const handleEditLead = useCallback((): void => {
    if (!createdLeadId) {
      return;
    }
    void (async (): Promise<void> => {
      const leadDef = await import("@/leads/[id]/definition");
      navigate(leadDef.default.PATCH, {
        urlPathParams: { id: createdLeadId },
        prefillFromGet: true,
        getEndpoint: leadDef.default.GET,
      });
    })();
  }, [navigate, createdLeadId]);

  const handleBackToList = useCallback((): void => {
    void (async (): Promise<void> => {
      const listDef = await import("@/leads/list/definition");
      navigate(listDef.default.GET);
    })();
  }, [navigate]);

  const handleCopyId = useCallback((): void => {
    if (!createdLeadId) {
      return;
    }
    void copyToClipboard(createdLeadId, logger);
  }, [createdLeadId, logger]);

  // Auto-navigate to lead detail on successful creation
  useEffect(() => {
    if (!createdLeadId) {
      return;
    }
    void (async (): Promise<void> => {
      const leadDef = await import("@/leads/[id]/definition");
      navigate(leadDef.default.GET, { urlPathParams: { id: createdLeadId } });
    })();
  }, [createdLeadId, navigate]);

  // Success state
  if (data?.lead?.summary?.id) {
    return (
      <Div className="flex flex-col gap-0">
        <Div className="flex items-center gap-2 p-4 border-b">
          <NavigateButtonWidget field={children.backButton} />
          <Div className="flex items-center gap-2 mr-auto">
            <CheckCircle className="h-5 w-5 text-success" />
            <Span className="font-semibold text-base">
              {t("widget.headerLeadCreated")}
            </Span>
          </Div>
        </Div>
        <Div className="p-4 flex flex-col gap-4">
          <Div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
            <Div className="flex items-center gap-2 flex-wrap">
              <Span className="font-semibold text-base">
                {businessName ?? email}
              </Span>
              {status && (
                <Span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800",
                  )}
                >
                  {leadsT(status)}
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
                <Span>{leadsT(source)}</Span>
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
                  {t("widget.buttonCopyId")}
                </Button>
              </Div>
            )}
          </Div>
          <Div className="flex flex-col gap-2">
            <Button type="button" variant="default" onClick={handleViewLead}>
              {t("widget.buttonViewLead")}
            </Button>
            <Button type="button" variant="outline" onClick={handleEditLead}>
              {t("widget.buttonEditLead")}
            </Button>
            <Button type="button" variant="outline" onClick={handleBackToList}>
              {t("widget.buttonBackToList")}
            </Button>
          </Div>
        </Div>
      </Div>
    );
  }

  const contact = children.contactInfo.children;
  const preferences = children.locationPreferences.children;
  const details = children.leadDetails.children;

  return (
    <AdminForm
      title={t("widget.headerCreateLead")}
      backButton={<NavigateButtonWidget field={children.backButton} />}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "post.submitButton.label",
            loadingText: "post.submitButton.loadingText",
            icon: "user-plus",
            variant: "primary",
          }}
        />
      }
    >
      <AdminFormSection title={t("post.contactInfo.title")} columns={2}>
        <TextFieldWidget
          fieldName="contactInfo.businessName"
          field={withValue(contact.businessName, undefined, null)}
        />
        <TextFieldWidget
          fieldName="contactInfo.email"
          field={withValue(contact.email, undefined, null)}
        />
        <TextFieldWidget
          fieldName="contactInfo.phone"
          field={withValue(contact.phone, undefined, null)}
        />
        <TextFieldWidget
          fieldName="contactInfo.website"
          field={withValue(contact.website, undefined, null)}
        />
      </AdminFormSection>

      <AdminFormSection title={t("post.locationPreferences.title")} columns={2}>
        <SelectFieldWidget
          fieldName="locationPreferences.country"
          field={preferences.country}
        />
        <SelectFieldWidget
          fieldName="locationPreferences.language"
          field={preferences.language}
        />
      </AdminFormSection>

      <AdminFormSection title={t("post.leadDetails.title")}>
        <SelectFieldWidget
          fieldName="leadDetails.source"
          field={details.source}
        />
        <TextareaFieldWidget
          fieldName="leadDetails.notes"
          field={withValue(details.notes, undefined, null)}
        />
      </AdminFormSection>
    </AdminForm>
  );
}
