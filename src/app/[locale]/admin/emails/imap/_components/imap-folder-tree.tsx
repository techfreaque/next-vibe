/**
 * IMAP Folder Tree Component
 * Component for displaying IMAP folders in a hierarchical tree format
 */

"use client";

import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { H3 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";

import type { ImapFoldersListResponseOutput } from "@/app/api/[locale]/v1/core/emails/imap-client/folders/list/definition";
import { useImapFoldersList } from "@/app/api/[locale]/v1/core/emails/imap-client/folders/list/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { useTranslation } from "@/i18n/core/client";
import type { TFunction } from "@/i18n/core/static-types";

interface FolderNode {
  id: string;
  name: string;
  displayName: string;
  path: string;
  specialUseType?: string;
  messageCount: number;
  unseenCount: number;
  recentCount: number;
  isSelectable: boolean;
  hasChildren: boolean;
  syncStatus: string;
  lastSyncAt: string;
  children?: FolderNode[];
}

interface ImapFolderTreeProps {
  accountId: string;
  logger: EndpointLogger;
}

interface FolderTreeNodeProps {
  folder: FolderNode;
  level: number;
  onSync: (folderId: string) => void;
  onView: (folderId: string) => void;
  t: TFunction;
}

/**
 * Get sync status color based on status string
 */
function getSyncStatusColor(status: string): string {
  switch (status) {
    case "synced":
      return "text-green-600";
    case "syncing":
      return "text-blue-600";
    case "pending":
      return "text-yellow-600";
    case "error":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}

/**
 * Convert API folder data to tree structure
 */
function buildFolderTree(
  folders: NonNullable<ImapFoldersListResponseOutput["folders"]>,
): FolderNode[] {
  return folders.map((folder) => ({
    id: folder.id,
    name: folder.name,
    displayName: folder.displayName || folder.name,
    path: folder.path,
    specialUseType: folder.specialUseType || undefined,
    messageCount: folder.messageCount,
    unseenCount: folder.unseenCount,
    recentCount: 0, // API doesn't provide recentCount yet
    isSelectable: folder.isSelectable,
    hasChildren: folder.hasChildren,
    syncStatus: folder.syncStatus,
    lastSyncAt: folder.createdAt, // Use createdAt as placeholder until API provides lastSyncAt
    children: [], // Hierarchical structure will be implemented when folder nesting is required
  }));
}

/**
 * Individual Folder Tree Node Component
 */
function FolderTreeNode({
  folder,
  level,
  onSync,
  onView,
  t,
}: FolderTreeNodeProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(true);

  const getSpecialUseIcon = (type?: string): JSX.Element => {
    switch (type) {
      case "inbox":
        return <Mail className="h-4 w-4 text-blue-600" />;
      case "sent":
        return <Mail className="h-4 w-4 text-green-600" />;
      case "drafts":
        return <Mail className="h-4 w-4 text-yellow-600" />;
      case "trash":
        return <Mail className="h-4 w-4 text-red-600" />;
      case "junk":
        return <Mail className="h-4 w-4 text-red-600" />;
      default:
        return folder.hasChildren ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 text-gray-600" />
          ) : (
            <Folder className="h-4 w-4 text-gray-600" />
          )
        ) : (
          <Folder className="h-4 w-4 text-gray-600" />
        );
    }
  };

  return (
    <Div>
      <Div
        className={`flex items-center py-2 px-4 hover:bg-gray-50 border-b ${
          level > 0 ? `ml-${level * 4}` : ""
        }`}
        style={{ paddingLeft: `${level * 20 + 16}px` }}
      >
        {/* Expand/Collapse Button */}
        {folder.hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Folder Icon */}
        <Div className="mr-3">{getSpecialUseIcon(folder.specialUseType)}</Div>

        {/* Folder Info */}
        <Div className="flex-1 min-w-0">
          <Div className="flex items-center space-x-2">
            <Span className="font-medium truncate">
              {folder.displayName || folder.name}
            </Span>
            {folder.specialUseType && (
              <Badge variant="outline" className="text-xs">
                {folder.specialUseType}
              </Badge>
            )}
          </Div>
          <Div className="text-sm text-gray-500 truncate">{folder.path}</Div>
        </Div>

        {/* Message Counts */}
        <Div className="flex items-center space-x-4 text-sm">
          <Div className="text-center">
            <Div className="font-medium">{folder.messageCount}</Div>
            <Div className="text-xs text-gray-500">
              {t("app.admin.emails.imap.common.total")}
            </Div>
          </Div>
          {folder.unseenCount > 0 && (
            <Div className="text-center">
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                {folder.unseenCount}
              </Badge>
              <Div className="text-xs text-gray-500">
                {t("app.admin.emails.imap.common.unread")}
              </Div>
            </Div>
          )}
          {folder.recentCount > 0 && (
            <Div className="text-center">
              <Div className="font-medium text-green-600">
                {folder.recentCount}
              </Div>
              <Div className="text-xs text-gray-500">
                {t("app.admin.emails.imap.common.recent")}
              </Div>
            </Div>
          )}
        </Div>

        {/* Sync Status */}
        <Div className="ml-4 text-center">
          <Div
            className={`text-sm font-medium ${getSyncStatusColor(folder.syncStatus)}`}
          >
            {folder.syncStatus}
          </Div>
          <Div className="text-xs text-gray-500">{folder.lastSyncAt}</Div>
        </Div>

        {/* Actions */}
        <Div className="ml-4 flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onSync(folder.id)}>
            {t("app.admin.emails.imap.folder.actions.sync")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onView(folder.id)}>
            {t("app.admin.emails.imap.common.view")}
          </Button>
        </Div>
      </Div>

      {/* Children */}
      {folder.hasChildren && isExpanded && folder.children && (
        <Div>
          {folder.children.map((child) => (
            <FolderTreeNode
              key={child.id}
              folder={child}
              level={level + 1}
              onSync={onSync}
              onView={onView}
              t={t}
            />
          ))}
        </Div>
      )}
    </Div>
  );
}

/**
 * IMAP Folder Tree Component
 */
export function ImapFolderTree({
  accountId,
  logger,
}: ImapFolderTreeProps): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  // Use the IMAP folders list endpoint
  const foldersEndpoint = useImapFoldersList(accountId, logger);

  // Access data through the read operation following leads pattern
  const apiResponse = foldersEndpoint.read?.response;
  const folders = apiResponse?.success ? apiResponse.data.folders : [];
  const isLoading = foldersEndpoint.read?.isLoading || false;

  const handleSync = (folderId: string): void => {
    logger.debug("Folder sync triggered", { folderId });
    // Trigger folder sync by refetching the folders data
    // This will trigger a re-sync of the specific folder through the API
    void foldersEndpoint.read?.refetch();
  };

  const handleView = (folderId: string): void => {
    // Navigate to messages view for the specific folder
    router.push(`/admin/emails/imap/messages?folderId=${folderId}`);
  };

  const folderTree = buildFolderTree(folders);

  if (isLoading) {
    return (
      <Div className="border rounded-lg">
        <Div className="bg-gray-50 px-4 py-3 border-b">
          <H3 className="font-medium">
            {t("app.admin.emails.imap.admin.folders.title")}
          </H3>
        </Div>
        <Div className="p-4 text-center text-gray-500">
          {t("app.admin.emails.imap.common.loading")}
        </Div>
      </Div>
    );
  }

  return (
    <Div className="border rounded-lg">
      <Div className="bg-gray-50 px-4 py-3 border-b">
        <H3 className="font-medium">
          {t("app.admin.emails.imap.admin.folders.title")}
        </H3>
      </Div>
      <Div className="max-h-96 overflow-y-auto">
        {folderTree.length === 0 ? (
          <Div className="p-4 text-center text-gray-500">
            {t("app.admin.emails.imap.admin.folders.no_folders")}
          </Div>
        ) : (
          folderTree.map((folder: FolderNode) => (
            <FolderTreeNode
              key={folder.id}
              folder={folder}
              level={0}
              onSync={handleSync}
              onView={handleView}
              t={t}
            />
          ))
        )}
      </Div>
    </Div>
  );
}
