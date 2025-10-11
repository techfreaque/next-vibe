/**
 * Consultations List Filters Component
 * Filter controls for consultation list
 */

"use client";

import { EndpointFormField } from "next-vibe-ui/ui";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";

import type { ConsultationAdminListGetRequestTypeInput } from "@/app/api/[locale]/v1/core/consultation/admin/list/definition";
import consultationsListDefinition from "@/app/api/[locale]/v1/core/consultation/admin/list/definition";
import {
  ConsultationSortFieldOptions,
  ConsultationStatusOptions,
  SortOrderOptions,
} from "@/app/api/[locale]/v1/core/consultation/enum";

interface ConsultationsListFiltersProps {
  form: UseFormReturn<ConsultationAdminListGetRequestTypeInput>;
}

export function ConsultationsListFilters({
  form,
}: ConsultationsListFiltersProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Search */}
      <EndpointFormField
        name="search"
        config={{
          type: "text",
          label: undefined,
          placeholder: "consultations.admin.list.search",
        }}
        control={form.control}
        schema={consultationsListDefinition.GET.requestSchema}
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
          placeholder: "consultations.admin.list.filters.status",
          options: ConsultationStatusOptions,
        }}
        control={form.control}
        schema={consultationsListDefinition.GET.requestSchema}
        theme={{
          style: "none",
          showAllRequired: false,
        }}
      />

      {/* User Email Filter */}
      <EndpointFormField
        name="userEmail"
        config={{
          type: "email",
          label: undefined,
          placeholder: "consultations.admin.list.filters.userEmail",
        }}
        control={form.control}
        schema={consultationsListDefinition.GET.requestSchema}
        theme={{
          style: "none",
          showAllRequired: false,
        }}
      />

      {/* Date From */}
      <EndpointFormField
        name="dateFrom"
        config={{
          type: "date",
          label: undefined,
          placeholder: "consultations.admin.list.filters.dateFrom",
        }}
        control={form.control}
        schema={consultationsListDefinition.GET.requestSchema}
        theme={{
          style: "none",
          showAllRequired: false,
        }}
      />

      {/* Date To */}
      <EndpointFormField
        name="dateTo"
        config={{
          type: "date",
          label: undefined,
          placeholder: "consultations.admin.list.filters.dateTo",
        }}
        control={form.control}
        schema={consultationsListDefinition.GET.requestSchema}
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
          placeholder: "consultations.admin.list.filters.sortBy",
          options: ConsultationSortFieldOptions,
        }}
        control={form.control}
        schema={consultationsListDefinition.GET.requestSchema}
        theme={{
          style: "none",
          showAllRequired: false,
        }}
      />

      {/* Sort Order */}
      <EndpointFormField
        name="sortOrder"
        config={{
          type: "select",
          label: undefined,
          placeholder: "consultations.admin.list.filters.sortOrder",
          options: SortOrderOptions,
        }}
        control={form.control}
        schema={consultationsListDefinition.GET.requestSchema}
        theme={{
          style: "none",
          showAllRequired: false,
        }}
      />

      {/* Page Size */}
      <EndpointFormField
        name="limit"
        config={{
          type: "select",
          label: undefined,
          placeholder: "consultations.admin.list.filters.all",
          options: [
            {
              value: 10,
              label: "consultations.admin.list.filters.all" as const,
            },
            {
              value: 20,
              label: "consultations.admin.list.filters.all" as const,
            },
            {
              value: 50,
              label: "consultations.admin.list.filters.all" as const,
            },
            {
              value: 100,
              label: "consultations.admin.list.filters.all" as const,
            },
          ],
        }}
        control={form.control}
        schema={consultationsListDefinition.GET.requestSchema}
        theme={{
          style: "none",
          showAllRequired: false,
        }}
      />
    </div>
  );
}
