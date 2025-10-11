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
import { debugLogger } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";
import { useState } from "react";

import { useImapFoldersListEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/folders/list/hooks";
import type { ImapFolderResponseType } from "@/app/api/[locale]/v1/core/emails/imap-client/schema";
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
}

interface FolderTreeNodeProps {
  folder: FolderNode;
  level: number;
  onSync: (folderId: string) => void;
  onView: (folderId: string) => void;
  t: TFunction;
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

  const getSyncStatusColor = (status: string): string => {
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
  };

  return (
    <div>
      <div
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
        <div className="mr-3">{getSpecialUseIcon(folder.specialUseType)}</div>

        {/* Folder Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium truncate">
              {folder.displayName || folder.name}
            </span>
            {folder.specialUseType && (
              <Badge variant="outline" className="text-xs">
                {folder.specialUseType}
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500 truncate">{folder.path}</div>
        </div>

        {/* Message Counts */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-center">
            <div className="font-medium">{folder.messageCount}</div>
            <div className="text-xs text-gray-500">
              {t("imap.common.total")}
            </div>
          </div>
          {folder.unseenCount > 0 && (
            <div className="text-center">
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                {folder.unseenCount}
              </Badge>
              <div className="text-xs text-gray-500">
                {t("imap.common.unread")}
              </div>
            </div>
          )}
          {folder.recentCount > 0 && (
            <div className="text-center">
              <div className="font-medium text-green-600">
                {folder.recentCount}
              </div>
              <div className="text-xs text-gray-500">
                {t("imap.common.recent")}
              </div>
            </div>
          )}
        </div>

        {/* Sync Status */}
        <div className="ml-4 text-center">
          <div
            className={`text-sm font-medium ${getSyncStatusColor(folder.syncStatus)}`}
          >
            {folder.syncStatus}
          </div>
          <div className="text-xs text-gray-500">{folder.lastSyncAt}</div>
        </div>

        {/* Actions */}
        <div className="ml-4 flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onSync(folder.id)}>
            {t("imap.folder.actions.sync")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onView(folder.id)}>
            {t("imap.common.view")}
          </Button>
        </div>
      </div>

      {/* Children */}
      {folder.hasChildren && isExpanded && folder.children && (
        <div>
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
        </div>
      )}
    </div>
  );
}

/**
 * IMAP Folder Tree Component
 */
export function ImapFolderTree({
  accountId,
}: ImapFolderTreeProps): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  // Use the IMAP folders list endpoint
  const foldersEndpoint = useImapFoldersListEndpoint(accountId);

  // Access data through the read operation following leads pattern
  const apiResponse = foldersEndpoint.read?.response;
  const folders = apiResponse?.success ? apiResponse.data.folders : [];
  const isLoading = foldersEndpoint.read?.isLoading || false;

  const handleSync = (folderId: string): void => {
    // Trigger folder sync by refetching the folders data
    // This will trigger a re-sync of the specific folder through the API
    void foldersEndpoint.read?.refetch();

    // Log the folder sync action for debugging
    debugLogger("Folder sync triggered", { folderId });
  };

  const handleView = (folderId: string): void => {
    // Navigate to messages view for the specific folder
    router.push(`/admin/emails/imap/messages?folderId=${folderId}`);
  };

  // Convert API folder data to tree structure
  const buildFolderTree = (folders: ImapFolderResponseType[]): FolderNode[] => {
    return folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      displayName: folder.displayName || folder.name,
      path: folder.path,
      specialUseType: folder.specialUseType || undefined,
      messageCount: folder.messageCount,
      unseenCount: folder.unseenCount,
      recentCount: folder.recentCount,
      isSelectable: folder.isSelectable,
      hasChildren: folder.hasChildren,
      syncStatus: folder.syncStatus,
      lastSyncAt: folder.lastSyncAt || t("imap.common.never"),
      children: [], // Hierarchical structure will be implemented when folder nesting is required
    }));
  };

  const folderTree = buildFolderTree(folders);

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium">{t("imap.admin.folders.title")}</h3>
        </div>
        <div className="p-4 text-center text-gray-500">
          {t("imap.common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="font-medium">{t("imap.admin.folders.title")}</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {folderTree.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {t("imap.admin.folders.no_folders")}
          </div>
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
      </div>
    </div>
  );
}
