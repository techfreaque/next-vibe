import { translations as engagementTranslations } from "../../engagement/i18n/en";
import { translations as pixelTranslations } from "../../pixel/i18n/en";

export const translations = {
  engagement: engagementTranslations,
  pixel: pixelTranslations,
  existing: {
    found: "Existing lead tracking found",
  },
  component: {
    initialized: "Lead tracking component initialized",
  },
  error: "Error in lead tracking",
  data: {
    captured: "Lead tracking data captured",
    capture: {
      error: "Error capturing lead tracking data",
    },
    retrieve: {
      error: "Error retrieving lead tracking data",
    },
    loaded: {
      signup: "Lead tracking data loaded for signup",
    },
    load: {
      error: {
        noncritical: "Error loading lead tracking data (non-critical)",
      },
    },
    stored: "Lead tracking data stored",
    store: {
      error: "Error storing lead tracking data",
    },
    cleared: "Lead tracking data cleared",
    clear: {
      error: "Error clearing lead tracking data",
    },
    format: {
      error: "Error formatting tracking data",
    },
  },
  params: {
    validate: {
      error: "Error validating tracking params",
    },
  },
};
