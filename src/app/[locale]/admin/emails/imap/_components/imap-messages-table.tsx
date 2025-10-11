/**
 * IMAP Messages Table Component
 * Table component for displaying IMAP messages with sorting and actions
 */

"use client";

import { Eye, Mail, MailOpen, Paperclip, Star } from "lucide-react";
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

import type { ImapMessageResponseType } from "@/app/api/[locale]/v1/core/emails/imap-client/schema";
import { useTranslation } from "@/i18n/core/client";

interface ImapMessagesTableProps {
  messages: ImapMessageResponseType[];
  loading?: boolean;
}

/**
 * IMAP Messages Table Component
 */
export function ImapMessagesTable({
  messages,
  loading = false,
}: ImapMessagesTableProps): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  const handleViewMessage = (messageId: string): void => {
    router.push(`/admin/emails/imap/messages/${messageId}`);
  };

  const getStatusIcon = (message: ImapMessageResponseType): JSX.Element => {
    if (message.isRead) {
      return <MailOpen className="h-4 w-4 text-gray-600" />;
    }
    return <Mail className="h-4 w-4 text-blue-600" />;
  };

  const getStatusBadge = (message: ImapMessageResponseType): JSX.Element => {
    if (!message.isRead) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          {t("imap.messages.unread")}
        </Badge>
      );
    }
    return <Badge variant="outline">{t("imap.messages.read")}</Badge>;
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) {
      return t("imap.common.unknown");
    }

    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } catch {
      return t("imap.common.unknown");
    }
  };

  const truncateText = (text: string, maxLength = 50): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("imap.messages.noMessages")}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">{t("imap.common.status")}</TableHead>
          <TableHead>{t("imap.messages.subject")}</TableHead>
          <TableHead>{t("imap.messages.sender")}</TableHead>
          <TableHead>{t("imap.messages.recipient")}</TableHead>
          <TableHead>{t("imap.messages.sentAt")}</TableHead>
          <TableHead className="w-12">
            {t("imap.messages.attachments")}
          </TableHead>
          <TableHead className="w-12">{t("imap.messages.flagged")}</TableHead>
          <TableHead className="w-32">{t("imap.common.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((message) => (
          <TableRow
            key={message.id}
            className={!message.isRead ? "bg-blue-50 dark:bg-blue-950/20" : ""}
          >
            <TableCell>
              <div className="flex items-center space-x-2">
                {getStatusIcon(message)}
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div
                  className={`font-medium ${!message.isRead ? "font-bold" : ""}`}
                >
                  {truncateText(
                    message.subject || t("imap.messages.noSubject"),
                  )}
                </div>
                {getStatusBadge(message)}
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="font-medium">
                  {message.senderName || message.senderEmail}
                </div>
                {message.senderName && (
                  <div className="text-sm text-muted-foreground">
                    {message.senderEmail}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="font-medium">
                  {message.recipientName || message.recipientEmail}
                </div>
                {message.recipientName && (
                  <div className="text-sm text-muted-foreground">
                    {message.recipientEmail}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">{formatDate(message.sentAt)}</div>
            </TableCell>
            <TableCell>
              {message.hasAttachments && (
                <div className="flex items-center space-x-1">
                  <Paperclip className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{message.attachmentCount}</span>
                </div>
              )}
            </TableCell>
            <TableCell>
              {message.isFlagged && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewMessage(message.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t("imap.common.view")}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
