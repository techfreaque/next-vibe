import { type ProfileCountry, profileCountry } from "@/tax/compliance/profiles";

/** Setup country = the company's compliance profile country (XX = generic). */
export function getCompanySetupCountry(
  country: string | null | undefined,
): ProfileCountry {
  return profileCountry(country);
}
