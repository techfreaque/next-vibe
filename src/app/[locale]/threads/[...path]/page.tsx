/**
 * Catch-all route for threads with nested folder support
 * Handles:
 * - /threads/[rootId] - Root folder view
 * - /threads/[rootId]/[sub1]/[sub2]/... - Nested folder view
 * - /threads/[rootId]/[sub1]/.../[threadId] - Thread view
 *
 * All paths render the same ChatInterface component.
 * The ChatInterface will determine from the URL path whether to show:
 * - Folder view (no thread selected, just sidebar + empty chat area)
 * - Thread view (specific thread selected, sidebar + chat messages)
 */

import type { JSX } from "react";

import { ChatProvider } from "@/app/[locale]/chat/features/chat/context";
import type { CountryLanguage } from "@/i18n/core/config";

import { ChatInterface } from "../../chat/components/chat-interface";

interface ThreadsPathPageProps {
  params: Promise<{
    locale: CountryLanguage;
    path: string[];
  }>;
}

export default async function ThreadsPathPage({
  params,
}: ThreadsPathPageProps): Promise<JSX.Element> {
  const { locale, path } = await params;

  // Path structure: [rootId, ...subfolders, possibleThreadId]
  // The ChatInterface will determine from localStorage whether the last segment
  // is a thread or a folder, and render accordingly.

  return (
    <ChatProvider locale={locale}>
      <ChatInterface urlPath={path} />
    </ChatProvider>
  );
}
