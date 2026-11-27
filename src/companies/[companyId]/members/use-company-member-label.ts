"use client";

import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { useMemo } from "react";

import list from "./list/definition";

export function useCompanyMemberLabel(
  companyId: string,
  memberId: string,
): string | undefined {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { companyId },
        queryOptions: { enabled: Boolean(companyId && memberId) },
      },
    }),
    [companyId, memberId],
  );
  const { read } = useEndpoint(list, options, logger, user);
  const member = read?.data?.members.find(({ id }) => id === memberId);
  return member?.name ?? member?.email ?? undefined;
}
