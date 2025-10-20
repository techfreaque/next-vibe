/**
 * IMAP Folders List Component
 * Component for displaying IMAP folders in a table format
 */

"use client";

import { useRouter } from "next/navigation";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import type { JSX } from "react";

import { useImapFoldersListEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/folders/list/hooks";
import { useTranslation } from "@/i18n/core/client";

interface ImapFoldersListProps {
  accountId: string;
}

/**
 * IMAP Folders List Component
 */
export function ImapFoldersList({
  accountId,
}: ImapFoldersListProps): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  // Use the IMAP folders list endpoint
  const foldersEndpoint = useImapFoldersListEndpoint(accountId);

  // Access data through the read operation following leads pattern
  const apiResponse = foldersEndpoint.read?.response;
  const folders = apiResponse?.success ? apiResponse.data.folders : [];
  const totalFolders = apiResponse?.success ? apiResponse.data.total : 0;
  const isLoading = foldersEndpoint.read?.isLoading || false;
  const error = foldersEndpoint.read?.error;

  const getSpecialUseBadge = (type: string): JSX.Element => {
    switch (type) {
      case "inbox":
        return (
          <Badge variant="default">
            {t("app.admin.emails.imap.folder.types.inbox")}
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="secondary">
            {t("app.admin.emails.imap.folder.types.sent")}
          </Badge>
        );
      case "drafts":
        return (
          <Badge variant="outline">
            {t("app.admin.emails.imap.folder.types.drafts")}
          </Badge>
        );
      case "trash":
        return (
          <Badge variant="destructive">
            {t("app.admin.emails.imap.folder.types.trash")}
          </Badge>
        );
      case "junk":
        return (
          <Badge variant="destructive">
            {t("app.admin.emails.imap.folder.types.junk")}
          </Badge>
        );
      case "archive":
        return (
          <Badge variant="secondary">
            {t("app.admin.emails.imap.folder.types.archive")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t("app.admin.emails.imap.folder.types.custom")}
          </Badge>
        );
    }
  };

  const getSyncStatusBadge = (status: string): JSX.Element => {
    switch (status) {
      case "synced":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {t("app.admin.emails.imap.sync.status.synced")}
          </Badge>
        );
      case "syncing":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            {t("app.admin.emails.imap.sync.status.syncing")}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            {t("app.admin.emails.imap.sync.status.pending")}
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            {t("app.admin.emails.imap.sync.status.error")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t("app.admin.emails.imap.sync.status.unknown")}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">{t("app.admin.emails.imap.common.loading")}</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        {t("app.admin.emails.imap.common.error")}
      </div>
    );
  }

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("app.admin.emails.imap.folder.name")}</TableHead>
            <TableHead>{t("app.admin.emails.imap.folder.type")}</TableHead>
            <TableHead>
              {t("app.admin.emails.imap.folder.messageCount")}
            </TableHead>
            <TableHead>{t("app.admin.emails.imap.folder.unread")}</TableHead>
            <TableHead>{t("app.admin.emails.imap.folder.recent")}</TableHead>
            <TableHead>
              {t("app.admin.emails.imap.folder.syncStatus")}
            </TableHead>
            <TableHead>{t("app.admin.emails.imap.folder.lastSync")}</TableHead>
            <TableHead>{t("app.admin.emails.imap.common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                {t("app.admin.emails.imap.admin.folders.no_folders")}
              </TableCell>
            </TableRow>
          ) : (
            folders.map((folder) => (
              <TableRow key={folder.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {folder.displayName || folder.name}
                    </div>
                    <div className="text-sm text-gray-500">{folder.path}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {folder.specialUseType
                    ? getSpecialUseBadge(folder.specialUseType)
                    : "-"}
                </TableCell>
                <TableCell>{folder.messageCount}</TableCell>
                <TableCell>
                  {folder.unseenCount > 0 ? (
                    <Badge
                      variant="default"
                      className="bg-blue-100 text-blue-800"
                    >
                      {folder.unseenCount}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </TableCell>
                <TableCell>{folder.recentCount}</TableCell>
                <TableCell>{getSyncStatusBadge(folder.syncStatus)}</TableCell>
                <TableCell>{folder.lastSyncAt}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.push(
                          `/admin/emails/imap/folders/${folder.id}/sync`,
                        );
                      }}
                    >
                      {t("app.admin.emails.imap.common.sync")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.push(
                          `/admin/emails/imap/messages?folderId=${folder.id}`,
                        );
                      }}
                    >
                      {t("app.admin.emails.imap.common.view")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Footer with total count */}
      {totalFolders > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          {t("app.admin.emails.imap.folder.total", { count: totalFolders })}
        </div>
      )}
    </div>
  );
}
