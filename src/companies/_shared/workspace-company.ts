export interface WorkspaceCompany {
  id: string;
  name: string;
  currency: string | null;
}

export const WORKSPACE_COMPANY_COOKIE = "erp-workspace-company";

export function readWorkspaceCompanyCookie(
  value: string | undefined,
  userId: string,
): string | undefined {
  const [owner, companyId] = value?.split(".") ?? [];
  return owner === userId && companyId ? companyId : undefined;
}

export function resolveWorkspaceCompany(
  companies: readonly WorkspaceCompany[],
  preferredId: string | undefined,
): WorkspaceCompany | undefined {
  return (
    companies.find(({ id }) => id === preferredId) ??
    (companies.length === 1 ? companies[0] : undefined)
  );
}
