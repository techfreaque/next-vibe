/**
 * Shared Leads Filter Field Definitions
 *
 * Single source of truth for filter fields used across:
 * - leads/list (multiselect, collapsible panel in widget)
 * - leads/batch (hidden - prefilled from list, not shown in widget)
 * - leads/export (shown as collapsible filter panel in widget)
 * - leads/stats (single-select variants, in filter panel)
 */

import { z } from "zod";

import {
  objectOptionalField,
  requestField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  FieldDataType,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import {
  EmailCampaignStageFilter,
  EmailCampaignStageFilterOptions,
  LeadSortField,
  LeadSortFieldOptions,
  LeadSourceFilter,
  LeadSourceFilterOptions,
  LeadStatusFilter,
  LeadStatusFilterOptions,
  SortOrder,
  SortOrderOptions,
} from "./enum";

/**
 * Core filter fields used in list and batch operations.
 * These are multiselect variants (arrays) suitable for list filtering.
 *
 * Usage: import and spread into your endpoint's fields children.
 */
export const leadsListFilterFields = {
  search: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "app.api.leads.filters.search.label" as const,
    description: "app.api.leads.filters.search.description" as const,
    placeholder: "app.api.leads.filters.search.placeholder" as const,
    columns: 6,
    schema: z.string().optional(),
  }),

  status: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "app.api.leads.filters.status.label" as const,
    description: "app.api.leads.filters.status.description" as const,
    placeholder: "app.api.leads.filters.status.placeholder" as const,
    options: LeadStatusFilterOptions,
    columns: 3,
    schema: z.array(z.enum(LeadStatusFilter)).optional(),
  }),

  currentCampaignStage: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "app.api.leads.filters.currentCampaignStage.label" as const,
    description:
      "app.api.leads.filters.currentCampaignStage.description" as const,
    placeholder:
      "app.api.leads.filters.currentCampaignStage.placeholder" as const,
    options: EmailCampaignStageFilterOptions,
    columns: 3,
    schema: z.array(z.enum(EmailCampaignStageFilter)).optional(),
  }),

  source: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "app.api.leads.filters.source.label" as const,
    description: "app.api.leads.filters.source.description" as const,
    placeholder: "app.api.leads.filters.source.placeholder" as const,
    options: LeadSourceFilterOptions,
    columns: 6,
    schema: z.array(z.enum(LeadSourceFilter)).optional(),
  }),
} as const;

/**
 * Location filter fields used in list and export operations.
 */
export const leadsLocationFilterFields = {
  country: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "app.api.leads.filters.country.label" as const,
    description: "app.api.leads.filters.country.description" as const,
    placeholder: "app.api.leads.filters.country.placeholder" as const,
    options: CountriesOptions,
    schema: z.array(z.enum(Countries)).optional(),
  }),

  language: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "app.api.leads.filters.language.label" as const,
    description: "app.api.leads.filters.language.description" as const,
    placeholder: "app.api.leads.filters.language.placeholder" as const,
    options: LanguagesOptions,
    schema: z.array(z.enum(Languages)).optional(),
  }),
} as const;

/**
 * Sorting field definitions used in list and export operations.
 */
export const leadsSortingFields = {
  sortBy: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "app.api.leads.filters.sortBy.label" as const,
    description: "app.api.leads.filters.sortBy.description" as const,
    placeholder: "app.api.leads.filters.sortBy.placeholder" as const,
    options: LeadSortFieldOptions,
    schema: z.enum(LeadSortField).optional().default(LeadSortField.CREATED_AT),
  }),

  sortOrder: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "app.api.leads.filters.sortOrder.label" as const,
    description: "app.api.leads.filters.sortOrder.description" as const,
    placeholder: "app.api.leads.filters.sortOrder.placeholder" as const,
    options: SortOrderOptions,
    schema: z.enum(SortOrder).optional().default(SortOrder.DESC),
  }),
} as const;

/**
 * Batch filter fields — scalar (single-select) variants for batch PATCH/DELETE.
 * These are kept hidden in the batch widget (prefilled from list).
 * Schema uses arrays to match the list filter format for easy prefilling.
 */
export const leadsBatchFilterFields = {
  search: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "app.api.leads.filters.search.label" as const,
    description: "app.api.leads.filters.search.description" as const,
    placeholder: "app.api.leads.filters.search.placeholder" as const,
    hidden: true,
    schema: z.string().optional(),
  }),

  status: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "app.api.leads.filters.status.label" as const,
    description: "app.api.leads.filters.status.description" as const,
    placeholder: "app.api.leads.filters.status.placeholder" as const,
    options: LeadStatusFilterOptions,
    hidden: true,
    schema: z.array(z.enum(LeadStatusFilter)).optional(),
  }),

  currentCampaignStage: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "app.api.leads.filters.currentCampaignStage.label" as const,
    description:
      "app.api.leads.filters.currentCampaignStage.description" as const,
    placeholder:
      "app.api.leads.filters.currentCampaignStage.placeholder" as const,
    options: EmailCampaignStageFilterOptions,
    hidden: true,
    schema: z.array(z.enum(EmailCampaignStageFilter)).optional(),
  }),

  source: requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "app.api.leads.filters.source.label" as const,
    description: "app.api.leads.filters.source.description" as const,
    placeholder: "app.api.leads.filters.source.placeholder" as const,
    options: LeadSourceFilterOptions,
    hidden: true,
    schema: z.array(z.enum(LeadSourceFilter)).optional(),
  }),
} as const;

/**
 * Pre-composed filter containers for use in endpoint field definitions.
 * These are objectOptionalField wrappers around the filter field sets.
 */
export const leadsStatusFiltersContainer = objectOptionalField(
  {
    type: WidgetType.CONTAINER,
    title: "app.api.leads.filters.statusFilters.title" as const,
    description: "app.api.leads.filters.statusFilters.description" as const,
    layoutType: LayoutType.GRID,
    columns: 6,
    order: 1,
    showSubmitButton: false,
  },
  { request: "data" },
  leadsListFilterFields,
);

export const leadsLocationFiltersContainer = objectOptionalField(
  {
    type: WidgetType.CONTAINER,
    title: "app.api.leads.filters.locationFilters.title" as const,
    description: "app.api.leads.filters.locationFilters.description" as const,
    layoutType: LayoutType.GRID,
    columns: 2,
    order: 2,
    showSubmitButton: false,
  },
  { request: "data" },
  leadsLocationFilterFields,
);

export const leadsSortingOptionsContainer = objectOptionalField(
  {
    type: WidgetType.CONTAINER,
    title: "app.api.leads.filters.sortingOptions.title" as const,
    description: "app.api.leads.filters.sortingOptions.description" as const,
    layoutType: LayoutType.GRID,
    columns: 2,
    order: 3,
    showSubmitButton: false,
  },
  { request: "data" },
  leadsSortingFields,
);
