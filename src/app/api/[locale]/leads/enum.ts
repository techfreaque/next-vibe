/**
 * Enums for TypeScript
 * Using createEnumOptions wrapper for unified DRY configuration
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: EngagementTypes,
  options: EngagementTypesOptions,
  Value: EngagementTypesValues,
} = createEnumOptions(scopedTranslation, {
  EMAIL_OPEN: "enums.engagementTypes.emailOpen",
  EMAIL_CLICK: "enums.engagementTypes.emailClick",
  WEBSITE_VISIT: "enums.engagementTypes.websiteVisit",
  FORM_SUBMIT: "enums.engagementTypes.formSubmit",
  LEAD_ATTRIBUTION: "enums.engagementTypes.leadAttribution",
});

/**
 * Lead Status Enum
 * Defines the possible states of a lead
 */
export const {
  enum: LeadStatus,
  options: LeadStatusOptions,
  Value: LeadStatusValues,
} = createEnumOptions(scopedTranslation, {
  NEW: "enums.leadStatus.new",
  PENDING: "enums.leadStatus.pending",
  CAMPAIGN_RUNNING: "enums.leadStatus.campaignRunning", // Changed from CONTACTED
  WEBSITE_USER: "enums.leadStatus.websiteUser", // For leads created through website engagement tracking
  NEWSLETTER_SUBSCRIBER: "enums.leadStatus.newsletterSubscriber", // For website users who subscribed to newsletter
  IN_CONTACT: "enums.leadStatus.inContact", // For leads who have contacted us and are in the process of being contacted but not yet converted
  SIGNED_UP: "enums.leadStatus.signedUp", // User created account (what CONVERTED currently means)
  SUBSCRIPTION_CONFIRMED: "enums.leadStatus.subscriptionConfirmed", // True conversion - subscription confirmed
  UNSUBSCRIBED: "enums.leadStatus.unsubscribed",
  BOUNCED: "enums.leadStatus.bounced",
  INVALID: "enums.leadStatus.invalid",
});

/**
 * Email Campaign Stage Enum
 * Defines the stages of an email campaign
 */
export const {
  enum: EmailCampaignStage,
  options: EmailCampaignStageOptions,
  Value: EmailCampaignStageValues,
} = createEnumOptions(scopedTranslation, {
  NOT_STARTED: "enums.emailCampaignStage.notStarted",
  INITIAL: "enums.emailCampaignStage.initial",
  FOLLOWUP_1: "enums.emailCampaignStage.followup1",
  FOLLOWUP_2: "enums.emailCampaignStage.followup2",
  FOLLOWUP_3: "enums.emailCampaignStage.followup3",
  NURTURE: "enums.emailCampaignStage.nurture",
  REACTIVATION: "enums.emailCampaignStage.reactivation",
} as const);

/**
 * Email Journey Variant Enum
 * Different A/B test variants for email journeys
 */
export const {
  enum: EmailJourneyVariant,
  options: EmailJourneyVariantOptions,
  Value: EmailJourneyVariantValues,
} = createEnumOptions(scopedTranslation, {
  UNCENSORED_CONVERT: "enums.emailJourneyVariant.uncensoredConvert",
  SIDE_HUSTLE: "enums.emailJourneyVariant.sideHustle",
  QUIET_RECOMMENDATION: "enums.emailJourneyVariant.quietRecommendation",
  // Post-conversion campaign variants (not A/B tested, one per campaign type)
  SIGNUP_NURTURE: "enums.emailJourneyVariant.signupNurture",
  RETENTION: "enums.emailJourneyVariant.retention",
  WINBACK: "enums.emailJourneyVariant.winback",
});

export const {
  enum: EmailJourneyVariantFilter,
  options: EmailJourneyVariantFilterOptions,
  Value: EmailJourneyVariantFilterValues,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.emailJourneyVariantFilter.all",
  UNCENSORED_CONVERT: "enums.emailJourneyVariantFilter.uncensoredConvert",
  SIDE_HUSTLE: "enums.emailJourneyVariantFilter.sideHustle",
  QUIET_RECOMMENDATION: "enums.emailJourneyVariantFilter.quietRecommendation",
  SIGNUP_NURTURE: "enums.emailJourneyVariantFilter.signupNurture",
  RETENTION: "enums.emailJourneyVariantFilter.retention",
  WINBACK: "enums.emailJourneyVariantFilter.winback",
});

/**
 * Email Provider Enum
 * Defines available email providers for campaign delivery
 */
export const {
  enum: EmailProvider,
  options: EmailProviderOptions,
  Value: EmailProviderValues,
} = createEnumOptions(scopedTranslation, {
  RESEND: "enums.emailProvider.resend",
  SENDGRID: "enums.emailProvider.sendgrid",
  MAILGUN: "enums.emailProvider.mailgun",
  SES: "enums.emailProvider.ses",
  SMTP: "enums.emailProvider.smtp",
  MAILJET: "enums.emailProvider.mailjet",
  POSTMARK: "enums.emailProvider.postmark",
  OTHER: "enums.emailProvider.other",
});

/**
 * Sort Order Enum
 * Defines sort order options for queries
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValues,
} = createEnumOptions(scopedTranslation, {
  ASC: "enums.sortOrder.asc",
  DESC: "enums.sortOrder.desc",
});

/**
 * Lead Sort Fields Enum
 * Defines available fields for sorting leads
 */
export const {
  enum: LeadSortField,
  options: LeadSortFieldOptions,
  Value: LeadSortFieldValues,
} = createEnumOptions(scopedTranslation, {
  EMAIL: "enums.leadSortField.email",
  BUSINESS_NAME: "enums.leadSortField.businessName",
  CREATED_AT: "enums.leadSortField.createdAt",
  UPDATED_AT: "enums.leadSortField.updatedAt",
  LAST_ENGAGEMENT_AT: "enums.leadSortField.lastEngagementAt",
});

/**
 * Export Format Enum
 * Defines available export formats
 */
export const {
  enum: ExportFormat,
  options: ExportFormatOptions,
  Value: ExportFormatValues,
} = createEnumOptions(scopedTranslation, {
  CSV: "enums.exportFormat.csv",
  XLSX: "enums.exportFormat.xlsx",
});

/**
 * MIME Type Enum
 * Defines MIME types for file exports
 */
export const {
  enum: MimeType,
  options: MimeTypeOptions,
  Value: MimeTypeValues,
} = createEnumOptions(scopedTranslation, {
  CSV: "enums.mimeType.csv",
  XLSX: "enums.mimeType.xlsx",
});

/**
 * Activity Type Enum
 * Defines types of lead activities for tracking
 */
export const {
  enum: ActivityType,
  options: ActivityTypeOptions,
  Value: ActivityTypeValues,
} = createEnumOptions(scopedTranslation, {
  LEAD_CREATED: "enums.activityType.leadCreated",
  LEAD_UPDATED: "enums.activityType.leadUpdated",
  EMAIL_SENT: "enums.activityType.emailSent",
  EMAIL_OPENED: "enums.activityType.emailOpened",
  EMAIL_CLICKED: "enums.activityType.emailClicked",
  LEAD_CONVERTED: "enums.activityType.leadConverted",
  LEAD_UNSUBSCRIBED: "enums.activityType.leadUnsubscribed",
});

/**
 * User Association Enum
 * Defines types of user associations for emails
 */
export const {
  enum: UserAssociation,
  options: UserAssociationOptions,
  Value: UserAssociationValues,
} = createEnumOptions(scopedTranslation, {
  WITH_USER: "enums.userAssociation.withUser",
  WITH_LEAD: "enums.userAssociation.withLead",
  STANDALONE: "enums.userAssociation.standalone",
  WITH_BOTH: "enums.userAssociation.withBoth",
});

/**
 * Device Type Enum
 * Parsed from user agent string
 */
export const {
  enum: DeviceType,
  options: DeviceTypeOptions,
  Value: DeviceTypeValues,
} = createEnumOptions(scopedTranslation, {
  DESKTOP: "enums.deviceType.desktop",
  MOBILE: "enums.deviceType.mobile",
  TABLET: "enums.deviceType.tablet",
  BOT: "enums.deviceType.bot",
  UNKNOWN: "enums.deviceType.unknown",
});

/**
 * Lead Source Enum
 * Defines the possible sources where leads come from
 */
export const {
  enum: LeadSource,
  options: LeadSourceOptions,
  Value: LeadSourceValues,
} = createEnumOptions(scopedTranslation, {
  WEBSITE: "enums.leadSource.website",
  SOCIAL_MEDIA: "enums.leadSource.socialMedia",
  EMAIL_CAMPAIGN: "enums.leadSource.emailCampaign",
  REFERRAL: "enums.leadSource.referral",
  CSV_IMPORT: "enums.leadSource.csvImport",
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
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.leadStatusFilter.all",
  NEW: "enums.leadStatusFilter.new",
  PENDING: "enums.leadStatusFilter.pending",
  CAMPAIGN_RUNNING: "enums.leadStatusFilter.campaignRunning",
  WEBSITE_USER: "enums.leadStatusFilter.websiteUser",
  NEWSLETTER_SUBSCRIBER: "enums.leadStatusFilter.newsletterSubscriber",
  IN_CONTACT: "enums.leadStatusFilter.inContact",
  SIGNED_UP: "enums.leadStatusFilter.signedUp",
  SUBSCRIPTION_CONFIRMED: "enums.leadStatusFilter.subscriptionConfirmed",
  UNSUBSCRIBED: "enums.leadStatusFilter.unsubscribed",
  BOUNCED: "enums.leadStatusFilter.bounced",
  INVALID: "enums.leadStatusFilter.invalid",
});

/**
 * Email Campaign Stage Filter Enum
 * Includes all campaign stages plus an "all" option for filtering
 */
export const {
  enum: EmailCampaignStageFilter,
  options: EmailCampaignStageFilterOptions,
  Value: EmailCampaignStageFilterValues,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.emailCampaignStageFilter.all",
  NOT_STARTED: "enums.emailCampaignStage.notStarted",
  INITIAL: "enums.emailCampaignStage.initial",
  FOLLOWUP_1: "enums.emailCampaignStage.followup1",
  FOLLOWUP_2: "enums.emailCampaignStage.followup2",
  FOLLOWUP_3: "enums.emailCampaignStage.followup3",
  NURTURE: "enums.emailCampaignStage.nurture",
  REACTIVATION: "enums.emailCampaignStage.reactivation",
});

/**
 * Lead Source Filter Enum
 * Includes all lead sources plus an "all" option for filtering
 */
export const {
  enum: LeadSourceFilter,
  options: LeadSourceFilterOptions,
  Value: LeadSourceFilterValues,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.leadSourceFilter.all",
  WEBSITE: "enums.leadSource.website",
  SOCIAL_MEDIA: "enums.leadSource.socialMedia",
  EMAIL_CAMPAIGN: "enums.leadSource.emailCampaign",
  REFERRAL: "enums.leadSource.referral",
  CSV_IMPORT: "enums.leadSource.csvImport",
});

/**
 * Batch Operation Scope Enum
 * Defines the scope of batch operations
 */
export const {
  enum: BatchOperationScope,
  options: BatchOperationScopeOptions,
  Value: BatchOperationScopeValues,
} = createEnumOptions(scopedTranslation, {
  CURRENT_PAGE: "enums.batchOperationScope.currentPage",
  ALL_PAGES: "enums.batchOperationScope.allPages",
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
  EmailJourneyVariant.UNCENSORED_CONVERT,
  EmailJourneyVariant.SIDE_HUSTLE,
  EmailJourneyVariant.QUIET_RECOMMENDATION,
  EmailJourneyVariant.SIGNUP_NURTURE,
  EmailJourneyVariant.RETENTION,
  EmailJourneyVariant.WINBACK,
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
] as const;

export const DeviceTypeDB = [
  DeviceType.DESKTOP,
  DeviceType.MOBILE,
  DeviceType.TABLET,
  DeviceType.BOT,
  DeviceType.UNKNOWN,
] as const;
