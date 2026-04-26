/**
 * Thread Detail Widget - domain enrichment for /threads/ paths
 *
 * Renders the actual messages widget for the thread using EndpointsPage,
 * so the full thread view (read-only) appears below the Cortex file content.
 */

"use client";

import { useMemo } from "react";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import messagesDefinitions from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetLocale,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

interface ThreadDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

interface ThreadPathInfo {
  threadId: string;
  rootFolderId: DefaultFolderId;
}

/**
 * Extract thread info from a cortex path like:
 *   /threads/private/abc123-uuid.md
 *   /threads/private/folder-id/abc123-uuid.md
 * segments: ["threads", rootFolder, ...rest, threadId.md]
 */
function extractThreadInfo(path: string): ThreadPathInfo | null {
  const segments = path.split("/").filter(Boolean);
  // Need at least: threads / rootFolder / threadId.md
  if (segments.length < 3) {
    return null;
  }
  const rootFolderSegment = segments[1];
  const last = segments[segments.length - 1];
  const threadId = last.replace(/\.md$/, "");
  if (!threadId) {
    return null;
  }
  // Validate rootFolder is a known DefaultFolderId
  const rootFolderId = Object.values(DefaultFolderId).includes(
    rootFolderSegment as DefaultFolderId,
  )
    ? (rootFolderSegment as DefaultFolderId)
    : DefaultFolderId.PRIVATE;

  return { threadId, rootFolderId };
}

export function ThreadDetailWidget({
  path,
}: ThreadDetailWidgetProps): React.JSX.Element | null {
  const locale = useWidgetLocale();
  const user = useWidgetUser();

  const info = useMemo(() => extractThreadInfo(path), [path]);

  if (!info) {
    return null;
  }

  return (
    <EndpointsPage
      endpoint={messagesDefinitions}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          urlPathParams: { threadId: info.threadId },
          initialState: { rootFolderId: info.rootFolderId },
        },
        create: {
          urlPathParams: { threadId: info.threadId },
        },
      }}
    />
  );
}
