"use client";

import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { setCookie } from "next-vibe/ui/lib/cookies";
import {
  createContext,
  type JSX,
  type ReactNode,
  useContext,
  useState,
} from "react";

import {
  resolveWorkspaceCompany,
  WORKSPACE_COMPANY_COOKIE,
  type WorkspaceCompany,
} from "./workspace-company";

interface WorkspaceCompanyState {
  companies: readonly WorkspaceCompany[];
  active?: WorkspaceCompany;
  select: (companyId: string) => void;
  register: (company: WorkspaceCompany) => void;
}

const WorkspaceCompanyContext = createContext<WorkspaceCompanyState | null>(
  null,
);

export function WorkspaceCompanyProvider({
  companies,
  initialCompanyId,
  userId,
  children,
}: {
  companies: readonly WorkspaceCompany[] | null;
  initialCompanyId?: string;
  userId?: string;
  children: ReactNode;
}): JSX.Element {
  const [preferredId, setPreferredId] = useState(
    () => resolveWorkspaceCompany(companies ?? [], initialCompanyId)?.id,
  );
  const [registered, setRegistered] = useState<WorkspaceCompany[]>([]);
  const available = companies
    ? [
        ...companies,
        ...registered.filter(
          (company) => !companies.some(({ id }) => id === company.id),
        ),
      ]
    : null;
  const logger = useLogger();

  const value =
    available && userId
      ? {
          companies: available,
          active: resolveWorkspaceCompany(available, preferredId),
          register: (company: WorkspaceCompany): void => {
            setRegistered((previous) => [
              ...previous.filter(({ id }) => id !== company.id),
              company,
            ]);
          },
          select: (companyId: string): void => {
            if (available.some(({ id }) => id === companyId)) {
              setPreferredId(companyId);
              void setCookie(
                WORKSPACE_COMPANY_COOKIE,
                `${userId}.${companyId}`,
                logger,
              );
            }
          },
        }
      : null;

  return (
    <WorkspaceCompanyContext.Provider value={value}>
      {children}
    </WorkspaceCompanyContext.Provider>
  );
}

export function useWorkspaceCompany(): WorkspaceCompanyState | null {
  return useContext(WorkspaceCompanyContext);
}
