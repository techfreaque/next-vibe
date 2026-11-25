export function getCompanySetupCountry(
  country: string | null | undefined,
): "AT" | "DE" | "XX" {
  const normalized = country?.trim().toUpperCase();
  return normalized === "AT" || normalized === "DE" ? normalized : "XX";
}
