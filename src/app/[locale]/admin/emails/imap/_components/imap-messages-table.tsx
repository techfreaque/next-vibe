/**
 * IMAP Messages Table Component
 * Table component for displaying IMAP messages with sorting and actions
 */

"use client";

import { Eye, Mail, MailOpen, Paperclip, Star } from 'next-vibe-ui/ui/icons';
import { Div } from "next-vibe-ui/ui/div";
import { useRouter } from "next-vibe-ui/hooks/use-navigation";
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
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { ImapMessageResponseType } from "@/app/api/[locale]/v1/core/emails/imap-client/messages/list/definition";
import { useTranslation } from "@/i18n/core/client";

interface ImapMessagesTableProps {
  messages: ImapMessageResponseType[];
  loading?: boolean;
}

const getStatusIcon = (message: ImapMessageResponseType): JSX.Element => {
  if (message.isRead) {
    return <MailOpen className="h-4 w-4 text-gray-600" />;
  }
  return <Mail className="h-4 w-4 text-blue-600" />;
};

const getStatusBadge = (
  message: ImapMessageResponseType,
  t: ReturnType<typeof useTranslation>["t"],
): JSX.Element => {
  if (!message.isRead) {
    return (
      <Badge variant="default" className="bg-blue-100 text-blue-800">
        {t("app.admin.emails.imap.messages.unread")}
      </Badge>
    );
  }
  return (
    <Badge variant="outline">
      {t("app.admin.emails.imap.messages.read")}
    </Badge>
  );
};

const formatDate = (
  dateString: string | null,
  t: ReturnType<typeof useTranslation>["t"],
): string => {
  if (!dateString) {
    return t("app.admin.emails.imap.common.unknown");
  }

  try {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  } catch {
    return t("app.admin.emails.imap.common.unknown");
  }
};

const truncateText = (text: string, maxLength = 50): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

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

  if (loading) {
    return (
      <Div className="text-center py-8">
        <P>{t("app.admin.emails.imap.common.loading")}</P>
      </Div>
    );
  }

  if (messages.length === 0) {
    return (
      <Div className="text-center py-8">
        <P className="text-muted-foreground">
          {t("app.admin.emails.imap.messages.noMessages")}
        </P>
      </Div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            {t("app.admin.emails.imap.common.status")}
          </TableHead>
          <TableHead>{t("app.admin.emails.imap.messages.subject")}</TableHead>
          <TableHead>{t("app.admin.emails.imap.messages.sender")}</TableHead>
          <TableHead>{t("app.admin.emails.imap.messages.recipient")}</TableHead>
          <TableHead>{t("app.admin.emails.imap.messages.sentAt")}</TableHead>
          <TableHead className="w-12">
            {t("app.admin.emails.imap.messages.attachments")}
          </TableHead>
          <TableHead className="w-12">
            {t("app.admin.emails.imap.messages.flagged")}
          </TableHead>
          <TableHead className="w-32">
            {t("app.admin.emails.imap.common.actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((message) => (
          <TableRow
            key={message.id}
            className={!message.isRead ? "bg-blue-50 dark:bg-blue-950/20" : ""}
          >
            <TableCell>
              <Div className="flex items-center space-x-2">
                {getStatusIcon(message)}
              </Div>
            </TableCell>
            <TableCell>
              <Div className="space-y-1">
                <Div
                  className={`font-medium ${!message.isRead ? "font-bold" : ""}`}
                >
                  {truncateText(
                    message.subject ||
                      t("app.admin.emails.imap.messages.noSubject"),
                  )}
                </Div>
                {getStatusBadge(message, t)}
              </Div>
            </TableCell>
            <TableCell>
              <Div className="space-y-1">
                <Div className="font-medium">
                  {message.senderName || message.senderEmail}
                </Div>
                {message.senderName && (
                  <Div className="text-sm text-muted-foreground">
                    {message.senderEmail}
                  </Div>
                )}
              </Div>
            </TableCell>
            <TableCell>
              <Div className="text-sm text-muted-foreground">-</Div>
            </TableCell>
            <TableCell>
              <Div className="text-sm">{formatDate(message.sentAt, t)}</Div>
            </TableCell>
            <TableCell>
              {message.hasAttachments && (
                <Div className="flex items-center space-x-1">
                  <Paperclip className="h-4 w-4 text-gray-600" />
                </Div>
              )}
            </TableCell>
            <TableCell>
              {message.isFlagged && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </TableCell>
            <TableCell>
              <Div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewMessage(message.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t("app.admin.emails.imap.common.view")}
                </Button>
              </Div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
