export const LicenseProductType = {
  STANDARD: "STANDARD",
  TRIAL: "TRIAL",
  PLUS: "PLUS",
} as const;
export type LicenseProductTypeValue =
  (typeof LicenseProductType)[keyof typeof LicenseProductType];
