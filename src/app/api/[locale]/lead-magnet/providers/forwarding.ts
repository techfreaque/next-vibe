import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn, LeadData } from "./types";

export { LeadMagnetProvider } from "../enum";
export type { ForwardLeadFn, LeadData } from "./types";

const unknownProviderFn: ForwardLeadFn = (
  credentials: Record<string, string>,
  lead: LeadData,
  t,
) => {
  void credentials;
  void lead;
  return Promise.resolve(
    fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    }),
  );
};

export async function getProvider(provider: string): Promise<ForwardLeadFn> {
  switch (provider) {
    case "GETRESPONSE":
      return (await import("./getresponse/forward")).forwardLead;
    case "KLAVIYO":
      return (await import("./klaviyo/forward")).forwardLead;
    case "EMARSYS":
      return (await import("./emarsys/forward")).forwardLead;
    case "ACUMBAMAIL":
      return (await import("./acumbamail/forward")).forwardLead;
    case "CLEVERREACH":
      return (await import("./cleverreach/forward")).forwardLead;
    case "CONNECTIF":
      return (await import("./connectif/forward")).forwardLead;
    case "DATANEXT":
      return (await import("./datanext/forward")).forwardLead;
    case "EDRONE":
      return (await import("./edrone/forward")).forwardLead;
    case "EXPERTSENDER":
      return (await import("./expertsender/forward")).forwardLead;
    case "FRESHMAIL":
      return (await import("./freshmail/forward")).forwardLead;
    case "MAILUP":
      return (await import("./mailup/forward")).forwardLead;
    case "MAPP":
      return (await import("./mapp/forward")).forwardLead;
    case "SAILTHRU":
      return (await import("./sailthru/forward")).forwardLead;
    case "SALESMANAGO":
      return (await import("./salesmanago/forward")).forwardLead;
    case "SHOPIFY":
      return (await import("./shopify/forward")).forwardLead;
    case "SPOTLER":
      return (await import("./spotler/forward")).forwardLead;
    case "YOULEAD":
      return (await import("./youlead/forward")).forwardLead;
    case "ADOBECAMPAIGN":
      return (await import("./adobecampaign/forward")).forwardLead;
    case "GOOGLE_SHEETS":
      return (await import("./google-sheets/forward")).forwardLead;
    case "PLATFORM_EMAIL":
      return (await import("./platform-email/forward")).forwardLead;
    default:
      return unknownProviderFn;
  }
}
