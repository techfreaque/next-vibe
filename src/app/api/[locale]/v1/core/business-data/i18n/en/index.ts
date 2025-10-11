import { translations as audienceTranslations } from "../../audience/i18n/en";
import { translations as brandTranslations } from "../../brand/i18n/en";
// Note: Removed circular import - business-data overview translations should be defined here directly
import { translations as businessInfoTranslations } from "../../business-info/i18n/en";
import { translations as challengesTranslations } from "../../challenges/i18n/en";
import { translations as competitorsTranslations } from "../../competitors/i18n/en";
import { translations as goalsTranslations } from "../../goals/i18n/en";
import { translations as profileTranslations } from "../../profile/i18n/en";
import { translations as socialTranslations } from "../../social/i18n/en";

export const translations = {
  // Main business data aggregation endpoint
  category: "Business Data",
  tags: {
    businessData: "Business Data",
    aggregation: "Aggregation",
  },
  get: {
    title: "Get All Business Data",
    description: "Retrieve comprehensive business data completion status",
    form: {
      title: "Business Data Overview",
      description: "View completion status for all business data sections",
    },
    response: {
      title: "Business Data Status",
      description: "Completion status for all business data sections",
      completionStatus: {
        title: "Overall Completion Status",
        description: "Completion status for all business data sections",
        audience: {
          title: "Audience Section",
          description: "Target audience information completion status",
          isComplete: "Audience section completed",
          completedFields: "Completed audience fields",
          totalFields: "Total audience fields",
          completionPercentage: "Audience completion percentage",
          missingRequiredFields: "Missing audience required fields",
        },
        brand: {
          title: "Brand Section",
          description: "Brand information completion status",
          isComplete: "Brand section completed",
          completedFields: "Completed brand fields",
          totalFields: "Total brand fields",
          completionPercentage: "Brand completion percentage",
          missingRequiredFields: "Missing brand required fields",
        },
        businessInfo: {
          title: "Business Info Section",
          description: "Business information completion status",
          isComplete: "Business info section completed",
          completedFields: "Completed business info fields",
          totalFields: "Total business info fields",
          completionPercentage: "Business info completion percentage",
          missingRequiredFields: "Missing business info required fields",
        },
        challenges: {
          title: "Challenges Section",
          description: "Business challenges completion status",
          isComplete: "Challenges section completed",
          completedFields: "Completed challenges fields",
          totalFields: "Total challenges fields",
          completionPercentage: "Challenges completion percentage",
          missingRequiredFields: "Missing challenges required fields",
        },
        competitors: {
          title: "Competitors Section",
          description: "Competitors information completion status",
          isComplete: "Competitors section completed",
          completedFields: "Completed competitors fields",
          totalFields: "Total competitors fields",
          completionPercentage: "Competitors completion percentage",
          missingRequiredFields: "Missing competitors required fields",
        },
        goals: {
          title: "Goals Section",
          description: "Business goals completion status",
          isComplete: "Goals section completed",
          completedFields: "Completed goals fields",
          totalFields: "Total goals fields",
          completionPercentage: "Goals completion percentage",
          missingRequiredFields: "Missing goals required fields",
        },
        profile: {
          title: "Profile Section",
          description: "Business profile completion status",
          isComplete: "Profile section completed",
          completedFields: "Completed profile fields",
          totalFields: "Total profile fields",
          completionPercentage: "Profile completion percentage",
          missingRequiredFields: "Missing profile required fields",
        },
        social: {
          title: "Social Section",
          description: "Social media completion status",
          isComplete: "Social section completed",
          completedFields: "Completed social fields",
          totalFields: "Total social fields",
          completionPercentage: "Social completion percentage",
          missingRequiredFields: "Missing social required fields",
        },
        overall: {
          title: "Overall Status",
          description: "Overall business data completion status",
          isComplete: "All sections completed",
          completedSections: "Completed sections",
          totalSections: "Total sections",
          completionPercentage: "Overall completion percentage",
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Invalid Request",
      description: "The business data request could not be validated",
    },
    unauthorized: {
      title: "Unauthorized Access",
      description: "You don't have permission to access business data",
    },
    server: {
      title: "Server Error",
      description: "An error occurred while retrieving business data",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    network: {
      title: "Network Error",
      description: "Unable to connect to the business data service",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "You are not allowed to access this business data",
    },
    notFound: {
      title: "Data Not Found",
      description: "The requested business data could not be found",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes to your business data",
    },
    conflict: {
      title: "Data Conflict",
      description: "The business data conflicts with existing information",
    },
  },
  success: {
    title: "Business Data Retrieved",
    description: "Business data has been retrieved successfully",
  },

  // Child domain translations
  audience: audienceTranslations,
  brand: brandTranslations,
  businessData: {}, // TODO: Define business-data overview translations
  businessInfo: businessInfoTranslations,
  challenges: challengesTranslations,
  competitors: competitorsTranslations,
  goals: goalsTranslations,
  profile: profileTranslations,
  social: socialTranslations,
};
