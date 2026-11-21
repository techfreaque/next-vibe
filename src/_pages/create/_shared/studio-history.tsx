"use client";

import { MEDIA_HISTORY_PAGE_SIZE } from "next-vibe/agent/media-studio/history/constants";
import mediaHistoryDefinitions, {
  type MediaHistoryResponseOutput,
} from "next-vibe/agent/media-studio/history/definition";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import type { CreateKind } from "./create-kinds";

/** Re-reads the gallery after a generation finished or failed. */
export function refreshStudioHistory(
  logger: EndpointLogger,
  kind: CreateKind | undefined,
): void {
  void apiClient.refetchEndpoint(mediaHistoryDefinitions.GET, logger, {
    requestData: { kind },
  });
}

export function StudioHistory({
  locale,
  user,
  platform,
  kind,
  initialData,
  pageSize = MEDIA_HISTORY_PAGE_SIZE,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  kind?: CreateKind;
  initialData: MediaHistoryResponseOutput | undefined;
  pageSize?: number;
}): JSX.Element {
  const logger = useLogger();
  return (
    <EndpointsPage
      logger={logger}
      locale={locale}
      user={user}
      platform={platform}
      endpoint={mediaHistoryDefinitions}
      endpointOptions={{
        read: {
          initialState: { kind, paginationInfo: { page: 1, limit: pageSize } },
          initialData,
          queryOptions: { refetchOnWindowFocus: true },
        },
      }}
    />
  );
}
