"use client";

import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { setCookie } from "next-vibe/ui/lib/cookies";
import {
  type Context,
  createContext,
  type JSX,
  type ReactNode,
  useContext,
  useState,
} from "react";

import {
  resolveWorkspaceCompany,
  type WorkspaceCompany,
  workspaceCompanyCookieName,
} from "./workspace-company";

interface WorkspaceCompanyState {
  companies: readonly WorkspaceCompany[];
  active?: WorkspaceCompany;
  select: (companyId: string) => void;
  register: (company: WorkspaceCompany) => void;
}

declare global {
  var __vibeWorkspaceCompanyContext:
    | Context<WorkspaceCompanyState | null>
    | undefined;
  var __vibeToolCompanyContext: Context<string | undefined> | undefined;
}

const WorkspaceCompanyContext = (globalThis.__vibeWorkspaceCompanyContext ??=
  createContext<WorkspaceCompanyState | null>(null));

export const ToolCompanyContext = (globalThis.__vibeToolCompanyContext ??=
  createContext<string | undefined>(undefined));

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
                workspaceCompanyCookieName(userId),
                companyId,
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

export function useToolCompanyId(): string | undefined {
  return useContext(ToolCompanyContext);
}
