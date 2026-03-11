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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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
import { scopedTranslation } from "./i18n";

/**
 * Core filter fields used in list and batch operations.
 * These are multiselect variants (arrays) suitable for list filtering.
 *
 * Usage: import and spread into your endpoint's fields children.
 */
export const leadsListFilterFields = {
  search: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "filters.search.label",
    description: "filters.search.description",
    placeholder: "filters.search.placeholder",
    columns: 6,
    schema: z.string().optional(),
  }),

  status: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "filters.status.label",
    description: "filters.status.description",
    placeholder: "filters.status.placeholder",
    options: LeadStatusFilterOptions,
    columns: 3,
    schema: z.array(z.enum(LeadStatusFilter)).optional(),
  }),

  currentCampaignStage: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "filters.currentCampaignStage.label",
    description: "filters.currentCampaignStage.description",
    placeholder: "filters.currentCampaignStage.placeholder",
    options: EmailCampaignStageFilterOptions,
    columns: 3,
    schema: z.array(z.enum(EmailCampaignStageFilter)).optional(),
  }),

  source: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "filters.source.label",
    description: "filters.source.description",
    placeholder: "filters.source.placeholder",
    options: LeadSourceFilterOptions,
    columns: 6,
    schema: z.array(z.enum(LeadSourceFilter)).optional(),
  }),
} as const;

/**
 * Location filter fields used in list and export operations.
 */
export const leadsLocationFilterFields = {
  country: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "filters.country.label",
    description: "filters.country.description",
    placeholder: "filters.country.placeholder",
    options: CountriesOptions,
    schema: z.array(z.enum(Countries)).optional(),
  }),

  language: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "filters.language.label",
    description: "filters.language.description",
    placeholder: "filters.language.placeholder",
    options: LanguagesOptions,
    schema: z.array(z.enum(Languages)).optional(),
  }),
} as const;

/**
 * Sorting field definitions used in list and export operations.
 */
export const leadsSortingFields = {
  sortBy: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "filters.sortBy.label",
    description: "filters.sortBy.description",
    placeholder: "filters.sortBy.placeholder",
    options: LeadSortFieldOptions,
    schema: z.enum(LeadSortField).optional().default(LeadSortField.CREATED_AT),
  }),

  sortOrder: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "filters.sortOrder.label",
    description: "filters.sortOrder.description",
    placeholder: "filters.sortOrder.placeholder",
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
  search: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "filters.search.label",
    description: "filters.search.description",
    placeholder: "filters.search.placeholder",
    hidden: true,
    schema: z.string().optional(),
  }),

  status: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "filters.status.label",
    description: "filters.status.description",
    placeholder: "filters.status.placeholder",
    options: LeadStatusFilterOptions,
    hidden: true,
    schema: z.array(z.enum(LeadStatusFilter)).optional(),
  }),

  currentCampaignStage: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "filters.currentCampaignStage.label",
    description: "filters.currentCampaignStage.description",
    placeholder: "filters.currentCampaignStage.placeholder",
    options: EmailCampaignStageFilterOptions,
    hidden: true,
    schema: z.array(z.enum(EmailCampaignStageFilter)).optional(),
  }),

  source: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.MULTISELECT,
    label: "filters.source.label",
    description: "filters.source.description",
    placeholder: "filters.source.placeholder",
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
  scopedTranslation,
  {
    type: WidgetType.CONTAINER,
    title: "filters.statusFilters.title",
    description: "filters.statusFilters.description",
    layoutType: LayoutType.GRID,
    columns: 6,
    order: 1,
    showSubmitButton: false,
    usage: { request: "data" },
    children: leadsListFilterFields,
  },
);

export const leadsLocationFiltersContainer = objectOptionalField(
  scopedTranslation,
  {
    type: WidgetType.CONTAINER,
    title: "filters.locationFilters.title",
    description: "filters.locationFilters.description",
    layoutType: LayoutType.GRID,
    columns: 2,
    order: 2,
    showSubmitButton: false,
    usage: { request: "data" },
    children: leadsLocationFilterFields,
  },
);

export const leadsSortingOptionsContainer = objectOptionalField(
  scopedTranslation,
  {
    type: WidgetType.CONTAINER,
    title: "filters.sortingOptions.title",
    description: "filters.sortingOptions.description",
    layoutType: LayoutType.GRID,
    columns: 2,
    order: 3,
    showSubmitButton: false,
    usage: { request: "data" },
    children: leadsSortingFields,
  },
);
