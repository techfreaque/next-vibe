/**
 * Emails List Table Component
 * Table display for emails list
 */

"use client";

import { Eye, Mail, MousePointer } from "next-vibe-ui/ui/icons";
import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Span } from "next-vibe-ui/ui/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import { H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { EmailsListResponseType } from "@/app/api/[locale]/emails/messages/list/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface EmailsListTableProps {
  emails: EmailsListResponseType["emails"];
  loading: boolean;
  locale: CountryLanguage;
}

const getStatusBadgeVariant = (
  status: string,
): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case "sent":
    case "delivered":
      return "default";
    case "opened":
      return "secondary";
    case "clicked":
      return "outline";
    case "bounced":
    case "failed":
      return "destructive";
    case "pending":
      return "secondary";
    default:
      return "outline";
  }
};

const getTypeBadgeVariant = (
  type: string,
): "default" | "secondary" | "outline" | "destructive" => {
  switch (type) {
    case "transactional":
      return "default";
    case "marketing":
      return "secondary";
    case "notification":
      return "outline";
    case "system":
      return "destructive";
    default:
      return "outline";
  }
};

export function EmailsListTable({
  emails,
  loading,
  locale,
}: EmailsListTableProps): JSX.Element {
  const { t } = simpleT(locale);

  if (loading) {
    return (
      <Div className="flex flex-col gap-4">
        {Array.from({ length: 5 }, (item, i) => {
          void item;
          return (
            <Div key={i} className="items-center flex flex-row gap-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </Div>
          );
        })}
      </Div>
    );
  }

  if (emails.length === 0) {
    return (
      <Div className="text-center py-8">
        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <H3 className="text-lg font-medium text-muted-foreground mb-2">
          {t("app.admin.emails.list.admin.messages.noEmails")}
        </H3>
        <P className="text-sm text-muted-foreground">
          {t("app.admin.emails.list.admin.messages.noEmailsDescription")}
        </P>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {t("app.admin.emails.list.admin.table.subject")}
            </TableHead>
            <TableHead>
              {t("app.admin.emails.list.admin.table.recipient")}
            </TableHead>
            <TableHead>
              {t("app.admin.emails.list.admin.table.status")}
            </TableHead>
            <TableHead>{t("app.admin.emails.list.admin.table.type")}</TableHead>
            <TableHead>
              {t("app.admin.emails.list.admin.table.sentAt")}
            </TableHead>
            <TableHead>
              {t("app.admin.emails.list.admin.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow key={email.emailCore.id}>
              <TableCell className="font-medium">
                <Div className="max-w-48 truncate">
                  {email.emailCore.subject}
                </Div>
              </TableCell>
              <TableCell>
                <Div className="flex flex-col gap-1">
                  <Div className="text-sm font-medium">
                    {email.emailParties.recipient.recipientEmail}
                  </Div>
                  {email.emailParties.recipient.recipientName && (
                    <Div className="text-xs text-muted-foreground">
                      {email.emailParties.recipient.recipientName}
                    </Div>
                  )}
                </Div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(email.emailCore.status)}>
                  {email.emailCore.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getTypeBadgeVariant(email.emailMetadata.type)}>
                  {email.emailMetadata.type.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell>
                {email.emailEngagement.sentAt ? (
                  <Div className="text-sm">
                    {new Date(email.emailEngagement.sentAt).toLocaleDateString(
                      locale,
                    )}
                  </Div>
                ) : (
                  <Span className="text-muted-foreground">-</Span>
                )}
              </TableCell>
              <TableCell>
                <Div className="flex items-center gap-2">
                  {email.emailEngagement.openedAt && (
                    <Eye className="h-4 w-4 text-green-600" />
                  )}
                  {email.emailEngagement.clickedAt && (
                    <MousePointer className="h-4 w-4 text-blue-600" />
                  )}
                </Div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Div>
  );
}
