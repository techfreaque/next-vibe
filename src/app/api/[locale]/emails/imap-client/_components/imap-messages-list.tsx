/**
 * IMAP Messages List Component
 * Component for displaying IMAP messages in a table format with actions
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { Eye, Mail, MailOpen, Paperclip, Star } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import React, { useState } from "react";

import {
  ImapMessageStatusFilter,
  ImapSyncStatus,
} from "@/app/api/[locale]/emails/imap-client/enum";
import { useImapMessagesListEndpoint } from "@/app/api/[locale]/emails/imap-client/messages/list/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

interface ImapMessagesListProps {
  accountId: string;
  folderId?: string;
  searchQuery?: string;
  statusFilter?: string;
  dateRange?: string;
}

/**
 * Format date to relative display string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

/**
 * Placeholder for marking messages as read
 */
function handleMarkAsRead(): void {
  // TODO: Mark selected messages as read through IMAP message API
  // Implementation needed for: selectedMessages
}

/**
 * Placeholder for marking messages as unread
 */
function handleMarkAsUnread(): void {
  // TODO: Mark selected messages as unread through IMAP message API
  // Implementation needed for: selectedMessages
}

/**
 * Placeholder for toggling flag status
 */
function handleToggleFlag(): void {
  // TODO: Toggle flag status of selected messages through IMAP message API
  // Implementation needed for: selectedMessages
}

/**
 * IMAP Messages List Component
 */
export function ImapMessagesList({
  accountId,
  folderId,
  searchQuery,
  statusFilter,
  dateRange,
}: ImapMessagesListProps): React.JSX.Element {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 20; // Messages per page

  // Create logger for endpoint
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Use the IMAP messages list endpoint following leads pattern
  const messagesEndpoint = useImapMessagesListEndpoint(logger);

  // Set filter values in the form when props change
  React.useEffect(() => {
    if (messagesEndpoint.read?.form) {
      if (accountId) {
        messagesEndpoint.read.form.setValue("accountId", accountId);
      }
      if (folderId) {
        messagesEndpoint.read.form.setValue("folderId", folderId);
      }
      if (searchQuery) {
        messagesEndpoint.read.form.setValue("search", searchQuery);
      }
      if (statusFilter) {
        // Convert string to enum if needed
        const statusEnum = statusFilter as keyof typeof ImapMessageStatusFilter;
        if (statusEnum in ImapMessageStatusFilter) {
          messagesEndpoint.read.form.setValue(
            "status",
            ImapMessageStatusFilter[statusEnum],
          );
        }
      }
      // Parse dateRange if provided (assuming format like "2024-01-01,2024-12-31")
      if (dateRange?.includes(",")) {
        const [dateFrom, dateTo] = dateRange.split(",");
        messagesEndpoint.read.form.setValue("dateFrom", dateFrom.trim());
        messagesEndpoint.read.form.setValue("dateTo", dateTo.trim());
      }
      messagesEndpoint.read.form.setValue("page", page);
      messagesEndpoint.read.form.setValue("limit", limit);
    }
  }, [
    messagesEndpoint.read?.form,
    accountId,
    folderId,
    searchQuery,
    statusFilter,
    dateRange,
    page,
    limit,
  ]);

  // Access data through the read operation following leads pattern
  const apiResponse = messagesEndpoint.read?.response;
  const messages = apiResponse?.success ? apiResponse.data.messages : [];
  const totalMessages = apiResponse?.success ? apiResponse.data.total : 0;
  const isLoading = messagesEndpoint.read?.isLoading || false;

  // TODO: Re-enable when messageSize is added to API definition
  // const formatSize = (bytes: number): string => {
  // if (bytes < 1024) {
  // return `${bytes} B`;
  // }
  // if (bytes < 1024 * 1024) {
  // return `${(bytes / 1024).toFixed(1)} KB`;
  // }
  // return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  // };

  const handleSelectMessage = (messageId: string, checked: boolean): void => {
    if (checked) {
      setSelectedMessages([...selectedMessages, messageId]);
    } else {
      setSelectedMessages(selectedMessages.filter((id) => id !== messageId));
    }
  };

  const handleSelectAll = (checked: boolean): void => {
    if (checked) {
      setSelectedMessages(messages.map((m) => m.id));
    } else {
      setSelectedMessages([]);
    }
  };

  const handleViewMessage = (messageId: string): void => {
    router.push(`/admin/emails/imap/messages/${messageId}`);
  };

  if (isLoading) {
    return (
      <Div className="p-4">{t("app.admin.emails.imap.common.loading")}</Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {/* Bulk Actions */}
      {selectedMessages.length > 0 && (
        <Div className="flex items-center flex flex-row gap-2 p-3 bg-blue-50 rounded-lg">
          <Span className="text-sm font-medium">
            {t("app.admin.emails.imap.message.selected", {
              count: selectedMessages.length,
            })}
          </Span>
          <Button size="sm" variant="outline" onClick={handleMarkAsRead}>
            {t("app.admin.emails.imap.admin.messages.actions.markAsRead")}
          </Button>
          <Button size="sm" variant="outline" onClick={handleMarkAsUnread}>
            {t("app.admin.emails.imap.admin.messages.actions.markAsUnread")}
          </Button>
          <Button size="sm" variant="outline" onClick={handleToggleFlag}>
            {t("app.admin.emails.imap.admin.messages.actions.toggleFlag")}
          </Button>
        </Div>
      )}

      {/* Messages Table */}
      <Div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedMessages.length === messages.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-12" />
              <TableHead>
                {" "}
                {t("app.admin.emails.imap.common.subject")}
              </TableHead>
              <TableHead> {t("app.admin.emails.imap.common.from")} </TableHead>
              <TableHead> {t("app.admin.emails.imap.common.date")} </TableHead>
              <TableHead> {t("app.admin.emails.imap.common.size")} </TableHead>
              <TableHead>
                {" "}
                {t("app.admin.emails.imap.common.status")}{" "}
              </TableHead>
              <TableHead>
                {" "}
                {t("app.admin.emails.imap.common.actions")}{" "}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {t("app.admin.emails.imap.admin.messages.no_messages")}
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow
                  key={message.id}
                  className={`${!message.isRead ? "bg-blue-50" : ""} hover:bg-gray-50`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedMessages.includes(message.id)}
                      onCheckedChange={(checked) =>
                        handleSelectMessage(message.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Div className="flex items-center flex flex-row gap-1">
                      {message.isRead ? (
                        <MailOpen className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Mail className="h-4 w-4 text-blue-600" />
                      )}
                      {message.isFlagged && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                      {message.hasAttachments && (
                        <Paperclip className="h-4 w-4 text-gray-600" />
                      )}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div
                      className={`truncate max-w-xs ${!message.isRead ? "font-semibold" : ""}`}
                    >
                      {message.subject}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className="truncate max-w-xs">
                      <Div className={!message.isRead ? "font-semibold" : ""}>
                        {message.senderName || message.senderEmail}
                      </Div>
                      {message.senderName && (
                        <Div className="text-sm text-gray-500">
                          {message.senderEmail}
                        </Div>
                      )}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className="text-sm">
                      {message.sentAt ? formatDate(message.sentAt) : "-"}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className="text-sm">
                      {/* TODO: Add messageSize to API definition */}-
                    </Div>
                  </TableCell>
                  <TableCell>
                    {/* TODO: Add syncStatus to API definition */}
                    <Badge variant="secondary">{ImapSyncStatus.SYNCED}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMessage(message.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Div>

      {/* Pagination */}
      {messages.length > 0 && (
        <Div className="flex items-center justify-between">
          <Div className="text-sm text-gray-600">
            {t("app.admin.emails.imap.admin.messages.pagination.showing", {
              start: (page - 1) * limit + 1,
              end: Math.min(page * limit, totalMessages),
              total: totalMessages,
            })}
          </Div>
          <Div className="flex items-center flex flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              {t("app.admin.emails.imap.common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
            >
              {t("app.admin.emails.imap.common.next")}
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}
