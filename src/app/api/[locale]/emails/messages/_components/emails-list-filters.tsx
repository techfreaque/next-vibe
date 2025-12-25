/**
 * Emails List Filters Component
 * Filter form fields for emails list
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  EmailSortField,
  EmailStatusFilter,
  EmailTypeFilter,
  SortOrder,
} from "@/app/api/[locale]/emails/messages/enum";
import type { EmailsListRequestType } from "@/app/api/[locale]/emails/messages/list/definition";
import emailListEndpoint from "@/app/api/[locale]/emails/messages/list/definition";
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
      filters: {
        search: undefined,
        status: EmailStatusFilter.ANY,
        type: EmailTypeFilter.ANY,
      },
      displayOptions: {
        page: 1,
        limit: 20,
        sortBy: EmailSortField.CREATED_AT,
        sortOrder: SortOrder.DESC,
      },
    });
  };

  return (
    <>
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search Field */}
        <EndpointFormField
          name="filters.search"
          config={{
            type: "text",
            label: undefined,
            placeholder: "app.admin.emails.list.admin.filters.search",
          }}
          control={form.control}
          schema={emailListEndpoint.GET.requestSchema}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
          locale={locale}
        />

        {/* Status Filter */}
        <EndpointFormField
          name="filters.status"
          config={{
            type: "select",
            label: undefined,
            placeholder: "app.admin.emails.list.admin.filters.status",
            options: [
              {
                value: EmailStatusFilter.ANY,
                label: "app.admin.emails.list.admin.status.all",
              },
              {
                value: EmailStatusFilter.PENDING,
                label: "app.admin.emails.list.admin.status.pending",
              },
              {
                value: EmailStatusFilter.SENT,
                label: "app.admin.emails.list.admin.status.sent",
              },
              {
                value: EmailStatusFilter.DELIVERED,
                label: "app.admin.emails.list.admin.status.delivered",
              },
              {
                value: EmailStatusFilter.OPENED,
                label: "app.admin.emails.list.admin.status.opened",
              },
              {
                value: EmailStatusFilter.CLICKED,
                label: "app.admin.emails.list.admin.status.clicked",
              },
              {
                value: EmailStatusFilter.BOUNCED,
                label: "app.admin.emails.list.admin.status.bounced",
              },
              {
                value: EmailStatusFilter.FAILED,
                label: "app.admin.emails.list.admin.status.failed",
              },
              {
                value: EmailStatusFilter.UNSUBSCRIBED,
                label: "app.admin.emails.list.admin.status.unsubscribed",
              },
            ],
          }}
          control={form.control}
          schema={emailListEndpoint.GET.requestSchema}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
          locale={locale}
        />

        {/* Type Filter */}
        <EndpointFormField
          name="filters.type"
          config={{
            type: "select",
            label: undefined,
            placeholder: "app.admin.emails.list.admin.filters.type",
            options: [
              {
                value: EmailTypeFilter.ANY,
                label: "app.admin.emails.list.admin.type.all",
              },
              {
                value: EmailTypeFilter.TRANSACTIONAL,
                label: "app.admin.emails.list.admin.type.transactional",
              },
              {
                value: EmailTypeFilter.MARKETING,
                label: "app.admin.emails.list.admin.type.marketing",
              },
              {
                value: EmailTypeFilter.NOTIFICATION,
                label: "app.admin.emails.list.admin.type.notification",
              },
              {
                value: EmailTypeFilter.SYSTEM,
                label: "app.admin.emails.list.admin.type.system",
              },
              {
                value: EmailTypeFilter.LEAD_CAMPAIGN,
                label: "app.admin.emails.list.admin.type.lead_campaign",
              },
              {
                value: EmailTypeFilter.USER_COMMUNICATION,
                label: "app.admin.emails.list.admin.type.user_communication",
              },
            ],
          }}
          control={form.control}
          schema={emailListEndpoint.GET.requestSchema}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
          locale={locale}
        />

        {/* Sort By */}
        <EndpointFormField
          name="displayOptions.sortBy"
          config={{
            type: "select",
            label: undefined,
            placeholder: "app.admin.emails.list.admin.sort.field",
            options: [
              {
                value: EmailSortField.CREATED_AT,
                label: "app.admin.emails.list.admin.sort.created_at",
              },
              {
                value: EmailSortField.SENT_AT,
                label: "app.admin.emails.list.admin.sort.sent_at",
              },
              {
                value: EmailSortField.SUBJECT,
                label: "app.admin.emails.list.admin.sort.subject",
              },
              {
                value: EmailSortField.RECIPIENT_EMAIL,
                label: "app.admin.emails.list.admin.sort.recipient_email",
              },
              {
                value: EmailSortField.STATUS,
                label: "app.admin.emails.list.admin.sort.status",
              },
              {
                value: EmailSortField.TYPE,
                label: "app.admin.emails.list.admin.sort.type",
              },
            ],
          }}
          control={form.control}
          schema={emailListEndpoint.GET.requestSchema}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
          locale={locale}
        />
      </Div>

      {/* Second row */}
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Sort Order */}
        <EndpointFormField
          name="displayOptions.sortOrder"
          config={{
            type: "select",
            label: undefined,
            placeholder: "app.admin.emails.list.admin.sort.order",
            options: [
              {
                value: SortOrder.DESC,
                label: "app.admin.emails.list.admin.sort.desc",
              },
              {
                value: SortOrder.ASC,
                label: "app.admin.emails.list.admin.sort.asc",
              },
            ],
          }}
          control={form.control}
          schema={emailListEndpoint.GET.requestSchema}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
          locale={locale}
        />

        {/* Clear Filters Button */}
        <Div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
          >
            {t("app.admin.emails.list.admin.filters.clear")}
          </Button>
        </Div>
      </Div>

      {/* Quick filter buttons */}
      <Div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <Span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {t("app.admin.emails.list.admin.filters.quick_filters")}:
        </Span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            form.setValue("filters.status", EmailStatusFilter.SENT);
          }}
        >
          {t("app.admin.emails.list.admin.filters.quick.sent")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            form.setValue("filters.status", EmailStatusFilter.OPENED);
          }}
        >
          {t("app.admin.emails.list.admin.filters.quick.opened")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            form.setValue("filters.status", EmailStatusFilter.BOUNCED);
          }}
        >
          {t("app.admin.emails.list.admin.filters.quick.bounced")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            form.setValue("filters.type", EmailTypeFilter.LEAD_CAMPAIGN);
          }}
        >
          {t("app.admin.emails.list.admin.filters.quick.lead_campaigns")}
        </Button>
      </Div>
    </>
  );
}
