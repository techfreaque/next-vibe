/**
 * Emails List Filters Component
 * Filter form fields for emails list
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  EmailSortField,
  EmailStatusFilter,
  EmailTypeFilter,
  SortOrder,
} from "@/app/api/[locale]/v1/core/emails/messages/enum";
import type { EmailsListRequestType } from "@/app/api/[locale]/v1/core/emails/messages/list/definition";
import emailListEndpoint from "@/app/api/[locale]/v1/core/emails/messages/list/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface EmailsListFiltersProps {
  form: UseFormReturn<EmailsListRequestType>;
  locale: CountryLanguage;
}

export function EmailsListFilters({
  form,
  locale,
}: EmailsListFiltersProps): JSX.Element {
  const { t } = simpleT(locale);

  const handleClearFilters = (): void => {
    form.reset({
      search: undefined,
      status: EmailStatusFilter.ALL,
      type: EmailTypeFilter.ALL,
      page: 1,
      limit: 20,
      sortBy: EmailSortField.CREATED_AT,
      sortOrder: SortOrder.DESC,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search Field */}
        <EndpointFormField
          name="search"
          config={{
            type: "text",
            label: undefined,
            placeholder: "emails.admin.filters.search",
          }}
          control={form.control}
          schema={emailListEndpoint.GET.requestSchema}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        {/* Status Filter */}
        <EndpointFormField
          name="status"
          config={{
            type: "select",
            label: undefined,
            placeholder: "emails.admin.filters.status",
            options: [
              {
                value: EmailStatusFilter.ALL,
                label: "emails.admin.status.all",
              },
              {
                value: EmailStatusFilter.PENDING,
                label: "emails.admin.status.pending",
              },
              {
                value: EmailStatusFilter.SENT,
                label: "emails.admin.status.sent",
              },
              {
                value: EmailStatusFilter.DELIVERED,
                label: "emails.admin.status.delivered",
              },
              {
                value: EmailStatusFilter.OPENED,
                label: "emails.admin.status.opened",
              },
              {
                value: EmailStatusFilter.CLICKED,
                label: "emails.admin.status.clicked",
              },
              {
                value: EmailStatusFilter.BOUNCED,
                label: "emails.admin.status.bounced",
              },
              {
                value: EmailStatusFilter.FAILED,
                label: "emails.admin.status.failed",
              },
              {
                value: EmailStatusFilter.UNSUBSCRIBED,
                label: "emails.admin.status.unsubscribed",
              },
            ],
          }}
          control={form.control}
          schema={emailListEndpoint.GET.requestSchema}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        {/* Type Filter */}
        <EndpointFormField
          name="type"
          config={{
            type: "select",
            label: undefined,
            placeholder: "emails.admin.filters.type",
            options: [
              {
                value: EmailTypeFilter.ALL,
                label: "emails.admin.type.all",
              },
              {
                value: EmailTypeFilter.TRANSACTIONAL,
                label: "emails.admin.type.transactional",
              },
              {
                value: EmailTypeFilter.MARKETING,
                label: "emails.admin.type.marketing",
              },
              {
                value: EmailTypeFilter.NOTIFICATION,
                label: "emails.admin.type.notification",
              },
              {
                value: EmailTypeFilter.SYSTEM,
                label: "emails.admin.type.system",
              },
              {
                value: EmailTypeFilter.LEAD_CAMPAIGN,
                label: "emails.admin.type.lead_campaign",
              },
              {
                value: EmailTypeFilter.USER_COMMUNICATION,
                label: "emails.admin.type.user_communication",
              },
            ],
          }}
          control={form.control}
          schema={emailListEndpoint.GET.requestSchema}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        {/* Sort By */}
        <EndpointFormField
          name="sortBy"
          config={{
            type: "select",
            label: undefined,
            placeholder: "emails.admin.sort.field",
            options: [
              {
                value: EmailSortField.CREATED_AT,
                label: "emails.admin.sort.created_at",
              },
              {
                value: EmailSortField.SENT_AT,
                label: "emails.admin.sort.sent_at",
              },
              {
                value: EmailSortField.SUBJECT,
                label: "emails.admin.sort.subject",
              },
              {
                value: EmailSortField.RECIPIENT_EMAIL,
                label: "emails.admin.sort.recipient_email",
              },
              {
                value: EmailSortField.STATUS,
                label: "emails.admin.sort.status",
              },
              {
                value: EmailSortField.TYPE,
                label: "emails.admin.sort.type",
              },
            ],
          }}
          control={form.control}
          schema={emailListEndpoint.GET.requestSchema}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Sort Order */}
        <EndpointFormField
          name="sortOrder"
          config={{
            type: "select",
            label: undefined,
            placeholder: "emails.admin.sort.order",
            options: [
              {
                value: SortOrder.DESC,
                label: "emails.admin.sort.desc",
              },
              {
                value: SortOrder.ASC,
                label: "emails.admin.sort.asc",
              },
            ],
          }}
          control={form.control}
          schema={emailListEndpoint.GET.requestSchema}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
          >
            {t("emails.admin.filters.clear")}
          </Button>
        </div>
      </div>

      {/* Quick filter buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {t("emails.admin.filters.quick_filters")}:
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            form.setValue("status", EmailStatusFilter.SENT);
          }}
        >
          {t("emails.admin.filters.quick.sent")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            form.setValue("status", EmailStatusFilter.OPENED);
          }}
        >
          {t("emails.admin.filters.quick.opened")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            form.setValue("status", EmailStatusFilter.BOUNCED);
          }}
        >
          {t("emails.admin.filters.quick.bounced")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            form.setValue("type", EmailTypeFilter.LEAD_CAMPAIGN);
          }}
        >
          {t("emails.admin.filters.quick.lead_campaigns")}
        </Button>
      </div>
    </>
  );
}
