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
import type React from "react";

import { SmtpHealthStatus } from "@/app/api/[locale]/v1/core/emails/smtp-client/enum";
import type { SmtpAccountResponseType } from "@/app/api/[locale]/v1/core/emails/smtp-client/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SmtpAccountsTableProps {
  accounts: SmtpAccountResponseType[];
  isLoading: boolean;
  locale: CountryLanguage;
  viewMode?: "list" | "table";
}

export function SmtpAccountsTable({
  accounts,
  isLoading,
  locale,
}: SmtpAccountsTableProps): React.JSX.Element {
  const { t } = simpleT(locale);

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

  const getCampaignTypeBadgeVariant = (
    campaignType: string,
  ): "default" | "secondary" | "outline" => {
    switch (campaignType) {
      case "SYSTEM":
        return "default";
      case "LEAD_CAMPAIGN":
        return "secondary";
      case "TRANSACTIONAL":
        return "outline";
      case "NOTIFICATION":
        return "secondary";
      case "NEWSLETTER":
        return "outline";
      default:
        return "secondary";
    }
  };

  const renderCampaignTypeBadges = (
    campaignTypes: string[],
  ): React.JSX.Element => {
    if (!campaignTypes || campaignTypes.length === 0) {
      return (
        <Badge variant="secondary">
          {t("app.admin.emails.smtp.admin.fields.campaignTypes")}
        </Badge>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {campaignTypes.map((campaignType, index) => (
          <Badge
            key={index}
            variant={getCampaignTypeBadgeVariant(campaignType)}
          >
            {campaignType}
          </Badge>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-500">{t("app.admin.emails.smtp.list.loading")}</p>
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            {t("app.admin.emails.smtp.list.no_results")}
          </p>
          <p className="text-sm text-gray-400">
            {t("app.admin.emails.smtp.list.description")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("app.admin.emails.smtp.list.table.name")}</TableHead>
            <TableHead>{t("app.admin.emails.smtp.list.table.host")}</TableHead>
            <TableHead>{t("app.admin.emails.smtp.admin.fields.campaignTypes")}</TableHead>
            <TableHead>{t("app.admin.emails.smtp.list.table.status")}</TableHead>
            <TableHead>{t("app.admin.emails.smtp.list.table.health")}</TableHead>
            <TableHead>{t("app.admin.emails.smtp.list.table.fromEmail")}</TableHead>
            <TableHead>{t("app.admin.emails.smtp.list.table.actions")}</TableHead>
            <TableHead className="text-right">
              {t("app.admin.emails.smtp.list.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{account.name}</div>
                  {account.description && (
                    <div className="text-sm text-gray-500">
                      {account.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>
                    {account.host}:{account.port}
                  </div>
                  <div className="text-gray-500">{account.securityType}</div>
                </div>
              </TableCell>
              <TableCell>
                {renderCampaignTypeBadges(account.campaignTypes || [])}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(account.status)}>
                  {account.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
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
                      {t(
                        `app.admin.emails.smtp.admin.health.${account.healthCheckStatus}`,
                      )}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">
                      {t("app.admin.emails.smtp.admin.health.unknown")}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="text-gray-900 dark:text-gray-100">
                    {account.emailsSentToday} /{" "}
                    {account.rateLimitPerHour || t("app.admin.emails.smtp.list.table.unlimited")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t("app.admin.emails.smtp.list.table.todayLimit")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t("app.admin.emails.smtp.list.table.totalSent", {
                      count: account.totalEmailsSent,
                    })}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{account.priority || 0}</span>
                    {account.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        {t("app.admin.emails.smtp.list.table.default")}
                      </Badge>
                    )}
                  </div>
                  {account.weight && (
                    <div className="text-xs text-gray-500">
                      {t("app.admin.emails.smtp.list.table.weight", {
                        weight: account.weight,
                      })}
                    </div>
                  )}
                </div>
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
    </div>
  );
}
