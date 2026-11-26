import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { type UserPermissionRoleValue } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/identity/roles/i18n";
import { StatusPill } from "next-vibe/ui/components/status-pill";

export function AccountRoleBadge({
  role,
  locale,
}: {
  role: typeof UserPermissionRoleValue;
  locale: CountryLanguage;
}): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return <StatusPill status={t(role)} variant="muted" />;
}
