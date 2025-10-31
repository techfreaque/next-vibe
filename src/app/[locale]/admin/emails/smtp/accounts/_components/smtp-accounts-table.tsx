/**
 * SMTP Accounts Table Component
 * Table for displaying SMTP accounts
 */

"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { SmtpHealthStatus } from "@/app/api/[locale]/v1/core/emails/smtp-client/enum";
import type { SmtpAccountsListGETResponseOutput } from "@/app/api/[locale]/v1/core/emails/smtp-client/list/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SmtpAccountsTableProps {
  accounts: SmtpAccountsListGETResponseOutput["accounts"];
  isLoading: boolean;
  locale: CountryLanguage;
  viewMode?: "list" | "table";
}

const getStatusBadgeVariant = (
  status: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "active":
      return "default";
    case "inactive":
      return "secondary";
    case "error":
      return "destructive";
    case "testing":
      return "outline";
    default:
      return "secondary";
  }
};

export function SmtpAccountsTable({
  accounts,
  isLoading,
  locale,
}: SmtpAccountsTableProps): React.JSX.Element {
  const { t } = simpleT(locale);

  if (isLoading) {
    return (
      <Div className="flex items-center justify-center h-64">
        <Div className="text-center">
          <Div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <P className="text-gray-500">
            {t("app.admin.emails.smtp.list.loading")}
          </P>
        </Div>
      </Div>
    );
  }

  if (accounts.length === 0) {
    return (
      <Div className="flex items-center justify-center h-64">
        <Div className="text-center">
          <P className="text-gray-500 mb-4">
            {t("app.admin.emails.smtp.list.no_results")}
          </P>
          <P className="text-sm text-gray-400">
            {t("app.admin.emails.smtp.list.description")}
          </P>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("app.admin.emails.smtp.list.table.name")}</TableHead>
            <TableHead>{t("app.admin.emails.smtp.list.table.host")}</TableHead>
            <TableHead>
              {t("app.admin.emails.smtp.admin.fields.campaignTypes")}
            </TableHead>
            <TableHead>
              {t("app.admin.emails.smtp.list.table.status")}
            </TableHead>
            <TableHead>
              {t("app.admin.emails.smtp.list.table.health")}
            </TableHead>
            <TableHead>
              {t("app.admin.emails.smtp.list.table.fromEmail")}
            </TableHead>
            <TableHead>
              {t("app.admin.emails.smtp.list.table.actions")}
            </TableHead>
            <TableHead className="text-right">
              {t("app.admin.emails.smtp.list.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <Div>
                  <Div className="font-medium">{account.name}</Div>
                  <Div className="text-sm text-gray-500">
                    {account.id.slice(0, 13)}...
                  </Div>
                </Div>
              </TableCell>
              <TableCell>
                <Div className="text-sm">
                  <Div className="text-gray-500">
                    {t("app.admin.emails.smtp.list.table.status")}:{" "}
                    {account.status}
                  </Div>
                </Div>
              </TableCell>
              <TableCell>
                <Span className="text-sm text-gray-500">-</Span>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(account.status)}>
                  {account.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Div className="text-sm">
                  {account.healthCheckStatus ? (
                    <Badge
                      variant={
                        account.healthCheckStatus === SmtpHealthStatus.HEALTHY
                          ? "default"
                          : account.healthCheckStatus ===
                              SmtpHealthStatus.DEGRADED
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {account.healthCheckStatus}
                    </Badge>
                  ) : (
                    <Span className="text-gray-400">
                      {t("app.admin.emails.smtp.admin.health.unknown")}
                    </Span>
                  )}
                </Div>
              </TableCell>
              <TableCell>
                <Div className="text-sm">
                  <Div className="text-xs text-gray-500">
                    {t("app.admin.emails.smtp.list.table.totalSent", {
                      count: account.totalEmailsSent,
                    })}
                  </Div>
                </Div>
              </TableCell>
              <TableCell>
                <Div className="text-sm">
                  <Span className="font-medium">{account.priority}</Span>
                </Div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/admin/emails/smtp/edit/${account.id}`}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t("app.admin.emails.smtp.admin.edit.title")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("app.admin.emails.smtp.list.actions.delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Div>
  );
}
