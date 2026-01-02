/**
 * IMAP Folders Sync Hooks
 * React hooks for syncing IMAP folders
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for syncing IMAP folders
 */
export function useImapFoldersSync(logger: EndpointLogger): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      persistForm: false,
    },
    logger,
  );
}

export type ImapFoldersSyncEndpointReturn = EndpointReturn<typeof definitions>;
