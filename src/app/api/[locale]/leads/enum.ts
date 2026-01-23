/**
 * Enums for TypeScript
 * Using createEnumOptions wrapper for unified DRY configuration
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

export const {
  enum: EngagementTypes,
  options: EngagementTypesOptions,
  Value: EngagementTypesValues,
} = createEnumOptions({
  EMAIL_OPEN: "app.api.leads.enums.engagementTypes.emailOpen" as const,
  EMAIL_CLICK: "app.api.leads.enums.engagementTypes.emailClick" as const,
  WEBSITE_VISIT: "app.api.leads.enums.engagementTypes.websiteVisit" as const,
  FORM_SUBMIT: "app.api.leads.enums.engagementTypes.formSubmit" as const,
  LEAD_ATTRIBUTION:
    "app.api.leads.enums.engagementTypes.leadAttribution" as const,
});

/**
 * Lead Status Enum
 * Defines the possible states of a lead
 */
export const {
  enum: LeadStatus,
  options: LeadStatusOptions,
  Value: LeadStatusValues,
} = createEnumOptions({
  NEW: "app.api.leads.enums.leadStatus.new",
  PENDING: "app.api.leads.enums.leadStatus.pending",
  CAMPAIGN_RUNNING: "app.api.leads.enums.leadStatus.campaignRunning", // Changed from CONTACTED
  WEBSITE_USER: "app.api.leads.enums.leadStatus.websiteUser", // For leads created through website engagement tracking
  NEWSLETTER_SUBSCRIBER:
    "app.api.leads.enums.leadStatus.newsletterSubscriber" as const, // For website users who subscribed to newsletter
  IN_CONTACT: "app.api.leads.enums.leadStatus.inContact", // For leads who have contacted us and are in the process of being contacted but not yet converted
  SIGNED_UP: "app.api.leads.enums.leadStatus.signedUp", // User created account (what CONVERTED currently means)
  SUBSCRIPTION_CONFIRMED:
    "app.api.leads.enums.leadStatus.subscriptionConfirmed", // True conversion - subscription confirmed
  UNSUBSCRIBED: "app.api.leads.enums.leadStatus.unsubscribed",
  BOUNCED: "app.api.leads.enums.leadStatus.bounced",
  INVALID: "app.api.leads.enums.leadStatus.invalid",
});

/**
 * Email Campaign Stage Enum
 * Defines the stages of an email campaign
 */
export const {
  enum: EmailCampaignStage,
  options: EmailCampaignStageOptions,
  Value: EmailCampaignStageValues,
} = createEnumOptions({
  NOT_STARTED: "app.api.leads.enums.emailCampaignStage.notStarted" as const,
  INITIAL: "app.api.leads.enums.emailCampaignStage.initial" as const,
  FOLLOWUP_1: "app.api.leads.enums.emailCampaignStage.followup1" as const,
  FOLLOWUP_2: "app.api.leads.enums.emailCampaignStage.followup2" as const,
  FOLLOWUP_3: "app.api.leads.enums.emailCampaignStage.followup3" as const,
  NURTURE: "app.api.leads.enums.emailCampaignStage.nurture" as const,
  REACTIVATION: "app.api.leads.enums.emailCampaignStage.reactivation" as const,
} as const);

/**
 * Email Journey Variant Enum
 * Different A/B test variants for email journeys
 */
export const {
  enum: EmailJourneyVariant,
  options: EmailJourneyVariantOptions,
  Value: EmailJourneyVariantValues,
} = createEnumOptions({
  PERSONAL_APPROACH: "app.api.leads.enums.emailJourneyVariant.personalApproach",
  RESULTS_FOCUSED: "app.api.leads.enums.emailJourneyVariant.resultsFocused",
  PERSONAL_RESULTS: "app.api.leads.enums.emailJourneyVariant.personalResults",
});

export const {
  enum: EmailJourneyVariantFilter,
  options: EmailJourneyVariantFilterOptions,
  Value: EmailJourneyVariantFilterValues,
} = createEnumOptions({
  ALL: "app.api.leads.enums.emailJourneyVariantFilter.all",
  PERSONAL_APPROACH:
    "app.api.leads.enums.emailJourneyVariantFilter.personalApproach",
  RESULTS_FOCUSED:
    "app.api.leads.enums.emailJourneyVariantFilter.resultsFocused",
  PERSONAL_RESULTS:
    "app.api.leads.enums.emailJourneyVariantFilter.personalResults",
});

/**
 * Email Provider Enum
 * Defines available email providers for campaign delivery
 */
export const {
  enum: EmailProvider,
  options: EmailProviderOptions,
  Value: EmailProviderValues,
} = createEnumOptions({
  RESEND: "app.api.emails.enums.emailProvider.resend",
  SENDGRID: "app.api.emails.enums.emailProvider.sendgrid",
  MAILGUN: "app.api.emails.enums.emailProvider.mailgun",
  SES: "app.api.emails.enums.emailProvider.ses",
  SMTP: "app.api.emails.enums.emailProvider.smtp",
  MAILJET: "app.api.emails.enums.emailProvider.mailjet",
  POSTMARK: "app.api.emails.enums.emailProvider.postmark",
  OTHER: "app.api.emails.enums.emailProvider.other",
});

/**
 * Sort Order Enum
 * Defines sort order options for queries
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValues,
} = createEnumOptions({
  ASC: "app.api.leads.enums.sortOrder.asc",
  DESC: "app.api.leads.enums.sortOrder.desc",
});

/**
 * Lead Sort Fields Enum
 * Defines available fields for sorting leads
 */
export const {
  enum: LeadSortField,
  options: LeadSortFieldOptions,
  Value: LeadSortFieldValues,
} = createEnumOptions({
  EMAIL: "app.api.leads.enums.leadSortField.email",
  BUSINESS_NAME: "app.api.leads.enums.leadSortField.businessName",
  CREATED_AT: "app.api.leads.enums.leadSortField.createdAt",
  UPDATED_AT: "app.api.leads.enums.leadSortField.updatedAt",
  LAST_ENGAGEMENT_AT: "app.api.leads.enums.leadSortField.lastEngagementAt",
});

/**
 * Export Format Enum
 * Defines available export formats
 */
export const {
  enum: ExportFormat,
  options: ExportFormatOptions,
  Value: ExportFormatValues,
} = createEnumOptions({
  CSV: "app.api.leads.enums.exportFormat.csv",
  XLSX: "app.api.leads.enums.exportFormat.xlsx",
});

/**
 * MIME Type Enum
 * Defines MIME types for file exports
 */
export const {
  enum: MimeType,
  options: MimeTypeOptions,
  Value: MimeTypeValues,
} = createEnumOptions({
  CSV: "app.api.leads.enums.mimeType.csv",
  XLSX: "app.api.leads.enums.mimeType.xlsx",
});

/**
 * Activity Type Enum
 * Defines types of lead activities for tracking
 */
export const {
  enum: ActivityType,
  options: ActivityTypeOptions,
  Value: ActivityTypeValues,
} = createEnumOptions({
  LEAD_CREATED: "app.api.leads.enums.activityType.leadCreated",
  LEAD_UPDATED: "app.api.leads.enums.activityType.leadUpdated",
  EMAIL_SENT: "app.api.leads.enums.activityType.emailSent",
  EMAIL_OPENED: "app.api.leads.enums.activityType.emailOpened",
  EMAIL_CLICKED: "app.api.leads.enums.activityType.emailClicked",
  LEAD_CONVERTED: "app.api.leads.enums.activityType.leadConverted",
  LEAD_UNSUBSCRIBED: "app.api.leads.enums.activityType.leadUnsubscribed",
});

/**
 * User Association Enum
 * Defines types of user associations for emails
 */
export const {
  enum: UserAssociation,
  options: UserAssociationOptions,
  Value: UserAssociationValues,
} = createEnumOptions({
  WITH_USER: "app.api.leads.enums.userAssociation.withUser",
  WITH_LEAD: "app.api.leads.enums.userAssociation.withLead",
  STANDALONE: "app.api.leads.enums.userAssociation.standalone",
  WITH_BOTH: "app.api.leads.enums.userAssociation.withBoth",
});

/**
 * Lead Source Enum
 * Defines the possible sources where leads come from
 */
export const {
  enum: LeadSource,
  options: LeadSourceOptions,
  Value: LeadSourceValues,
} = createEnumOptions({
  WEBSITE: "app.api.leads.enums.leadSource.website",
  SOCIAL_MEDIA: "app.api.leads.enums.leadSource.socialMedia",
  EMAIL_CAMPAIGN: "app.api.leads.enums.leadSource.emailCampaign",
  REFERRAL: "app.api.leads.enums.leadSource.referral",
  CSV_IMPORT: "app.api.leads.enums.leadSource.csvImport",
  API: "app.api.leads.enums.leadSource.api",
});

/**
 * Filter Enums with ALL options
 * Used for filtering with an "all" option
 */

/**
 * Lead Status Filter Enum
 * Includes all lead statuses plus an "all" option for filtering
 */
export const {
  enum: LeadStatusFilter,
  options: LeadStatusFilterOptions,
  Value: LeadStatusFilterValues,
} = createEnumOptions({
  ALL: "app.api.leads.enums.leadStatusFilter.all",
  NEW: "app.api.leads.enums.leadStatusFilter.new",
  PENDING: "app.api.leads.enums.leadStatusFilter.pending",
  CAMPAIGN_RUNNING: "app.api.leads.enums.leadStatusFilter.campaignRunning",
  WEBSITE_USER: "app.api.leads.enums.leadStatusFilter.websiteUser",
  NEWSLETTER_SUBSCRIBER:
    "app.api.leads.enums.leadStatusFilter.newsletterSubscriber" as const,
  IN_CONTACT: "app.api.leads.enums.leadStatusFilter.inContact",
  SIGNED_UP: "app.api.leads.enums.leadStatusFilter.signedUp",
  SUBSCRIPTION_CONFIRMED:
    "app.api.leads.enums.leadStatusFilter.subscriptionConfirmed",
  UNSUBSCRIBED: "app.api.leads.enums.leadStatusFilter.unsubscribed",
  BOUNCED: "app.api.leads.enums.leadStatusFilter.bounced",
  INVALID: "app.api.leads.enums.leadStatusFilter.invalid",
});

/**
 * Email Campaign Stage Filter Enum
 * Includes all campaign stages plus an "all" option for filtering
 */
export const {
  enum: EmailCampaignStageFilter,
  options: EmailCampaignStageFilterOptions,
  Value: EmailCampaignStageFilterValues,
} = createEnumOptions({
  ALL: "app.api.leads.enums.emailCampaignStageFilter.all",
  NOT_STARTED: "app.api.leads.enums.emailCampaignStage.notStarted",
  INITIAL: "app.api.leads.enums.emailCampaignStage.initial",
  FOLLOWUP_1: "app.api.leads.enums.emailCampaignStage.followup1",
  FOLLOWUP_2: "app.api.leads.enums.emailCampaignStage.followup2",
  FOLLOWUP_3: "app.api.leads.enums.emailCampaignStage.followup3",
  NURTURE: "app.api.leads.enums.emailCampaignStage.nurture",
  REACTIVATION: "app.api.leads.enums.emailCampaignStage.reactivation",
});

/**
 * Lead Source Filter Enum
 * Includes all lead sources plus an "all" option for filtering
 */
export const {
  enum: LeadSourceFilter,
  options: LeadSourceFilterOptions,
  Value: LeadSourceFilterValues,
} = createEnumOptions({
  ALL: "app.api.leads.enums.leadSourceFilter.all",
  WEBSITE: "app.api.leads.enums.leadSource.website",
  SOCIAL_MEDIA: "app.api.leads.enums.leadSource.socialMedia",
  EMAIL_CAMPAIGN: "app.api.leads.enums.leadSource.emailCampaign",
  REFERRAL: "app.api.leads.enums.leadSource.referral",
  CSV_IMPORT: "app.api.leads.enums.leadSource.csvImport",
  API: "app.api.leads.enums.leadSource.api",
});

/**
 * Batch Operation Scope Enum
 * Defines the scope of batch operations
 */
export const {
  enum: BatchOperationScope,
  options: BatchOperationScopeOptions,
  Value: BatchOperationScopeValues,
} = createEnumOptions({
  CURRENT_PAGE: "app.api.leads.enums.batchOperationScope.currentPage",
  ALL_PAGES: "app.api.leads.enums.batchOperationScope.allPages",
});

/**
 * Map status filter to actual status
 */
export function mapStatusFilter(
  filter: (typeof LeadStatusFilter)[keyof typeof LeadStatusFilter] | undefined,
): (typeof LeadStatus)[keyof typeof LeadStatus] | null {
  switch (filter) {
    case LeadStatusFilter.NEW:
      return LeadStatus.NEW;
    case LeadStatusFilter.PENDING:
      return LeadStatus.PENDING;
    case LeadStatusFilter.CAMPAIGN_RUNNING:
      return LeadStatus.CAMPAIGN_RUNNING;
    case LeadStatusFilter.WEBSITE_USER:
      return LeadStatus.WEBSITE_USER;
    case LeadStatusFilter.NEWSLETTER_SUBSCRIBER:
      return LeadStatus.NEWSLETTER_SUBSCRIBER;
    case LeadStatusFilter.IN_CONTACT:
      return LeadStatus.IN_CONTACT;
    case LeadStatusFilter.SIGNED_UP:
      return LeadStatus.SIGNED_UP;
    case LeadStatusFilter.SUBSCRIPTION_CONFIRMED:
      return LeadStatus.SUBSCRIPTION_CONFIRMED;
    case LeadStatusFilter.UNSUBSCRIBED:
      return LeadStatus.UNSUBSCRIBED;
    case LeadStatusFilter.BOUNCED:
      return LeadStatus.BOUNCED;
    case LeadStatusFilter.INVALID:
      return LeadStatus.INVALID;
    default:
      return null;
  }
}

/**
 * Map source filter to actual source
 */
export function mapSourceFilter(
  filter: (typeof LeadSourceFilter)[keyof typeof LeadSourceFilter] | undefined,
): (typeof LeadSource)[keyof typeof LeadSource] | null {
  switch (filter) {
    case LeadSourceFilter.WEBSITE:
      return LeadSource.WEBSITE;
    case LeadSourceFilter.SOCIAL_MEDIA:
      return LeadSource.SOCIAL_MEDIA;
    case LeadSourceFilter.EMAIL_CAMPAIGN:
      return LeadSource.EMAIL_CAMPAIGN;
    case LeadSourceFilter.REFERRAL:
      return LeadSource.REFERRAL;
    case LeadSourceFilter.CSV_IMPORT:
      return LeadSource.CSV_IMPORT;
    case LeadSourceFilter.API:
      return LeadSource.API;
    default:
      return null;
  }
}

/**
 * Map campaign stage filter to actual stage
 */
export function mapCampaignStageFilter(
  filter:
    | (typeof EmailCampaignStageFilter)[keyof typeof EmailCampaignStageFilter]
    | undefined,
): (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage] | null {
  switch (filter) {
    case EmailCampaignStageFilter.NOT_STARTED:
      return EmailCampaignStage.NOT_STARTED;
    case EmailCampaignStageFilter.INITIAL:
      return EmailCampaignStage.INITIAL;
    case EmailCampaignStageFilter.FOLLOWUP_1:
      return EmailCampaignStage.FOLLOWUP_1;
    case EmailCampaignStageFilter.FOLLOWUP_2:
      return EmailCampaignStage.FOLLOWUP_2;
    case EmailCampaignStageFilter.FOLLOWUP_3:
      return EmailCampaignStage.FOLLOWUP_3;
    case EmailCampaignStageFilter.NURTURE:
      return EmailCampaignStage.NURTURE;
    case EmailCampaignStageFilter.REACTIVATION:
      return EmailCampaignStage.REACTIVATION;
    default:
      return null;
  }
}

/**
 * Lead Status Transition Rules
 * Defines which status transitions are allowed
 */

/**
 * Check if a lead status transition is allowed
 * @param currentStatus - Current lead status
 * @param newStatus - Proposed new status
 * @returns boolean - Whether the transition is allowed
 */
export function isStatusTransitionAllowed(
  currentStatus: (typeof LeadStatus)[keyof typeof LeadStatus],
  newStatus: (typeof LeadStatus)[keyof typeof LeadStatus],
): boolean {
  // Same status is always allowed
  if (currentStatus === newStatus) {
    return true;
  }

  // Final statuses cannot transition back to basic statuses
  const finalStatuses: (typeof LeadStatus)[keyof typeof LeadStatus][] = [
    LeadStatus.IN_CONTACT,
    LeadStatus.SIGNED_UP,
    LeadStatus.SUBSCRIPTION_CONFIRMED,
    LeadStatus.UNSUBSCRIBED,
    LeadStatus.BOUNCED,
    LeadStatus.INVALID,
  ];
  const isFinalStatus = finalStatuses.includes(currentStatus);

  const basicStatuses: (typeof LeadStatus)[keyof typeof LeadStatus][] = [
    LeadStatus.NEW,
    LeadStatus.PENDING,
    LeadStatus.CAMPAIGN_RUNNING,
  ];
  const isBasicStatus = basicStatuses.includes(newStatus);

  if (isFinalStatus && isBasicStatus) {
    return false;
  }

  // Specific transition rules
  switch (currentStatus) {
    case LeadStatus.IN_CONTACT: {
      // IN_CONTACT cannot go back to: NEW, PENDING, CAMPAIGN_RUNNING, WEBSITE_USER, NEWSLETTER_SUBSCRIBER
      const inContactForbidden: (typeof LeadStatus)[keyof typeof LeadStatus][] =
        [
          LeadStatus.NEW,
          LeadStatus.PENDING,
          LeadStatus.CAMPAIGN_RUNNING,
          LeadStatus.WEBSITE_USER,
          LeadStatus.NEWSLETTER_SUBSCRIBER,
        ];
      return !inContactForbidden.includes(newStatus);
    }

    case LeadStatus.WEBSITE_USER: {
      // WEBSITE_USER can transition to newsletter or contact, but not back to basic
      const webUserForbidden: (typeof LeadStatus)[keyof typeof LeadStatus][] = [
        LeadStatus.NEW,
        LeadStatus.PENDING,
        LeadStatus.CAMPAIGN_RUNNING,
      ];
      return !webUserForbidden.includes(newStatus);
    }

    case LeadStatus.NEWSLETTER_SUBSCRIBER: {
      // NEWSLETTER_SUBSCRIBER can transition to IN_CONTACT or other final statuses
      const newsletterForbidden: (typeof LeadStatus)[keyof typeof LeadStatus][] =
        [LeadStatus.NEW, LeadStatus.PENDING, LeadStatus.CAMPAIGN_RUNNING];
      return !newsletterForbidden.includes(newStatus);
    }

    case LeadStatus.SIGNED_UP:
    case LeadStatus.SUBSCRIPTION_CONFIRMED:
    case LeadStatus.UNSUBSCRIBED:
    case LeadStatus.BOUNCED:
    case LeadStatus.INVALID: {
      // These final statuses can only transition to other final statuses
      const allowedTransitions: (typeof LeadStatus)[keyof typeof LeadStatus][] =
        [
          LeadStatus.IN_CONTACT,
          LeadStatus.SIGNED_UP,
          LeadStatus.SUBSCRIPTION_CONFIRMED,
          LeadStatus.UNSUBSCRIBED,
          LeadStatus.BOUNCED,
          LeadStatus.INVALID,
        ];
      return allowedTransitions.includes(newStatus);
    }

    default:
      // Basic statuses (NEW, PENDING, CAMPAIGN_RUNNING) can transition to any status
      return true;
  }
}

/**
 * Get the appropriate status for a contact form submission
 * @param currentStatus - Current lead status
 * @returns LeadStatus - Status to set for contact form
 */
export function getContactFormStatus(
  currentStatus: (typeof LeadStatus)[keyof typeof LeadStatus],
): (typeof LeadStatus)[keyof typeof LeadStatus] {
  // If already a final status, keep it unless it's a basic status
  const finalContactStatuses: (typeof LeadStatus)[keyof typeof LeadStatus][] = [
    LeadStatus.IN_CONTACT,
    LeadStatus.SIGNED_UP,
    LeadStatus.SUBSCRIPTION_CONFIRMED,
    LeadStatus.UNSUBSCRIBED,
    LeadStatus.BOUNCED,
    LeadStatus.INVALID,
  ];
  const isFinalStatus = finalContactStatuses.includes(currentStatus);

  if (isFinalStatus) {
    return currentStatus;
  }

  // For basic statuses, transition to IN_CONTACT
  return LeadStatus.IN_CONTACT;
}

/**
 * Get the appropriate status for a newsletter subscription
 * @param currentStatus - Current lead status
 * @returns LeadStatus - Status to set for newsletter subscription
 */
export function getNewsletterSubscriptionStatus(
  currentStatus: (typeof LeadStatus)[keyof typeof LeadStatus],
): (typeof LeadStatus)[keyof typeof LeadStatus] {
  // If already IN_CONTACT or higher, keep current status
  const higherNewsletterStatuses: (typeof LeadStatus)[keyof typeof LeadStatus][] =
    [
      LeadStatus.IN_CONTACT,
      LeadStatus.SIGNED_UP,
      LeadStatus.SUBSCRIPTION_CONFIRMED,
      LeadStatus.UNSUBSCRIBED,
      LeadStatus.BOUNCED,
      LeadStatus.INVALID,
    ];
  const isHigherStatus = higherNewsletterStatuses.includes(currentStatus);

  if (isHigherStatus) {
    return currentStatus;
  }

  // For basic statuses or WEBSITE_USER, transition to NEWSLETTER_SUBSCRIBER
  return LeadStatus.NEWSLETTER_SUBSCRIBER;
}

/**
 * Get the appropriate status for website user creation
 * @param currentStatus - Current lead status (if exists)
 * @returns LeadStatus - Status to set for website user
 */
export function getWebsiteUserStatus(
  currentStatus?: (typeof LeadStatus)[keyof typeof LeadStatus],
): (typeof LeadStatus)[keyof typeof LeadStatus] {
  // If no current status or basic status, set to WEBSITE_USER
  const basicUserStatuses: (typeof LeadStatus)[keyof typeof LeadStatus][] = [
    LeadStatus.NEW,
    LeadStatus.PENDING,
    LeadStatus.CAMPAIGN_RUNNING,
  ];
  const isBasicStatus =
    currentStatus && basicUserStatuses.includes(currentStatus);

  if (!currentStatus || isBasicStatus) {
    return LeadStatus.WEBSITE_USER;
  }

  // Keep existing status if it's already a final status
  return currentStatus;
}

/**
 * Database Enum Arrays
 * Dedicated arrays for pgEnum usage with translation keys
 * Following established pattern for database compatibility
 */

export const EngagementTypesDB = [
  EngagementTypes.EMAIL_OPEN,
  EngagementTypes.EMAIL_CLICK,
  EngagementTypes.WEBSITE_VISIT,
  EngagementTypes.FORM_SUBMIT,
  EngagementTypes.LEAD_ATTRIBUTION,
] as const;

export const LeadStatusDB = [
  LeadStatus.NEW,
  LeadStatus.PENDING,
  LeadStatus.CAMPAIGN_RUNNING,
  LeadStatus.WEBSITE_USER,
  LeadStatus.NEWSLETTER_SUBSCRIBER,
  LeadStatus.IN_CONTACT,
  LeadStatus.SIGNED_UP,
  LeadStatus.SUBSCRIPTION_CONFIRMED,
  LeadStatus.UNSUBSCRIBED,
  LeadStatus.BOUNCED,
  LeadStatus.INVALID,
] as const;

export const EmailCampaignStageDB = [
  EmailCampaignStage.NOT_STARTED,
  EmailCampaignStage.INITIAL,
  EmailCampaignStage.FOLLOWUP_1,
  EmailCampaignStage.FOLLOWUP_2,
  EmailCampaignStage.FOLLOWUP_3,
  EmailCampaignStage.NURTURE,
  EmailCampaignStage.REACTIVATION,
] as const;

export const EmailJourneyVariantDB = [
  EmailJourneyVariant.PERSONAL_APPROACH,
  EmailJourneyVariant.RESULTS_FOCUSED,
  EmailJourneyVariant.PERSONAL_RESULTS,
] as const;

export const EmailProviderDB = [
  EmailProvider.RESEND,
  EmailProvider.SENDGRID,
  EmailProvider.MAILGUN,
  EmailProvider.SES,
  EmailProvider.SMTP,
  EmailProvider.MAILJET,
  EmailProvider.POSTMARK,
  EmailProvider.OTHER,
] as const;

export const LeadSourceDB = [
  LeadSource.WEBSITE,
  LeadSource.SOCIAL_MEDIA,
  LeadSource.EMAIL_CAMPAIGN,
  LeadSource.REFERRAL,
  LeadSource.CSV_IMPORT,
  LeadSource.API,
] as const;
