const commonTypos: Readonly<Record<string, string>> = {
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmai.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "outlok.com": "outlook.com",
  "outllook.com": "outlook.com",
};

export function suggestSignupEmail(input: string): string | null {
  const [local, domain, extra] = input.trim().split("@");
  if (!local || !domain || extra !== undefined) {
    return null;
  }
  const normalized = domain.toLowerCase();
  const suffixFixed = normalized.replace(/\.con$/, ".com");
  const suggested = Object.hasOwn(commonTypos, suffixFixed)
    ? commonTypos[suffixFixed]
    : suffixFixed;
  return suggested && suggested !== normalized ? `${local}@${suggested}` : null;
}
