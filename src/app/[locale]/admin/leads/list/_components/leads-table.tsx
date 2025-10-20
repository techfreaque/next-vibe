"use client";

import { Edit, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";
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
import type React from "react";
import { useCallback } from "react";

import { LeadStatus } from "@/app/api/[locale]/v1/core/leads/enum";
import type { LeadResponseType } from "@/app/api/[locale]/v1/core/leads/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

interface LeadsTableProps {
  locale: CountryLanguage;
  leads: LeadResponseType[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function LeadsTable({
  locale,
  leads,
  isLoading,
  onRefresh,
}: LeadsTableProps): React.JSX.Element {
  const { t } = simpleT(locale);

  // Get status configuration
  const getStatusConfig = (
    status: LeadStatus,
  ): {
    variant: "default" | "destructive" | "secondary";
    label: TranslationKey;
  } => {
    switch (status) {
      case LeadStatus.NEW:
        return {
          variant: "secondary" as const,
          label: `leads.admin.status.new`,
        };
      case LeadStatus.PENDING:
        return {
          variant: "secondary" as const,
          label: `leads.admin.status.pending`,
        };
      case LeadStatus.CAMPAIGN_RUNNING:
        return {
          variant: "default" as const,
          label: `leads.admin.status.campaign_running`,
        };
      case LeadStatus.WEBSITE_USER:
        return {
          variant: "default" as const,
          label: `leads.admin.status.website_user`,
        };
      case LeadStatus.NEWSLETTER_SUBSCRIBER:
        return {
          variant: "default" as const,
          label: `leads.admin.status.newsletter_subscriber`,
        };
      case LeadStatus.IN_CONTACT:
        return {
          variant: "default" as const,
          label: `leads.admin.status.in_contact`,
        };
      case LeadStatus.SIGNED_UP:
        return {
          variant: "default" as const,
          label: `leads.admin.status.signed_up`,
        };
      case LeadStatus.CONSULTATION_BOOKED:
        return {
          variant: "default" as const,
          label: `leads.admin.status.consultation_booked`,
        };
      case LeadStatus.SUBSCRIPTION_CONFIRMED:
        return {
          variant: "default" as const,
          label: `leads.admin.status.subscription_confirmed`,
        };
      case LeadStatus.UNSUBSCRIBED:
        return {
          variant: "destructive" as const,
          label: `leads.admin.status.unsubscribed`,
        };
      case LeadStatus.BOUNCED:
        return {
          variant: "destructive" as const,
          label: `leads.admin.status.bounced`,
        };
      case LeadStatus.INVALID:
        return {
          variant: "destructive" as const,
          label: `leads.admin.status.invalid`,
        };
      default:
        return {
          variant: "secondary" as const,
          label: "app.admin.leads.leads.admin.status.unknown",
        };
    }
  };

  // Utility function for formatting dates
  const formatDate = useCallback(
    (date: Date | string | number | null): string => {
      if (!date) {
        return t("app.admin.leads.leads.admin.formatting.fallbacks.never");
      }
      const dateObj =
        typeof date === "string" || typeof date === "number"
          ? new Date(date)
          : date;
      return dateObj.toLocaleDateString(locale);
    },
    [locale, t],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("app.common.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {t("app.admin.leads.leads.list.noResults")}
        </p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" className="mt-4">
            {t("app.common.refresh")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          {t("app.admin.leads.leads.admin.table.scroll_hint")}
        </p>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">
                {t("app.admin.leads.leads.admin.table.business")}
              </TableHead>
              <TableHead className="min-w-[200px]">
                {t("app.admin.leads.leads.admin.table.email")}
              </TableHead>
              <TableHead className="min-w-[120px]">
                {t("app.admin.leads.leads.admin.table.status")}
              </TableHead>
              <TableHead className="min-w-[150px]">
                {t("app.admin.leads.leads.admin.table.campaign_stage")}
              </TableHead>
              <TableHead className="min-w-[80px]">
                {t("app.admin.leads.leads.admin.table.country")}
              </TableHead>
              <TableHead className="min-w-[80px]">
                {t("app.admin.leads.leads.admin.table.language")}
              </TableHead>
              <TableHead className="min-w-[100px]">
                {t("app.admin.leads.leads.admin.table.source")}
              </TableHead>
              <TableHead className="min-w-[120px]">
                {t("app.admin.leads.leads.admin.table.phone")}
              </TableHead>
              <TableHead className="min-w-[100px]">
                {t("app.admin.leads.leads.admin.table.website")}
              </TableHead>
              <TableHead className="min-w-[80px] text-center">
                {t("app.admin.leads.leads.admin.table.emails_sent")}
              </TableHead>
              <TableHead className="min-w-[80px] text-center">
                {t("app.admin.leads.leads.admin.table.emails_opened")}
              </TableHead>
              <TableHead className="min-w-[80px] text-center">
                {t("app.admin.leads.leads.admin.table.emails_clicked")}
              </TableHead>
              <TableHead className="min-w-[140px]">
                {t("app.admin.leads.leads.admin.table.last_engagement")}
              </TableHead>
              <TableHead className="min-w-[140px]">
                {t("app.admin.leads.leads.admin.table.last_email_sent")}
              </TableHead>
              <TableHead className="min-w-[100px]">
                {t("app.admin.leads.leads.admin.table.created")}
              </TableHead>
              <TableHead className="min-w-[100px]">
                {t("app.admin.leads.leads.admin.table.updated")}
              </TableHead>
              <TableHead className="min-w-[200px]">
                {t("app.admin.leads.leads.admin.table.notes")}
              </TableHead>
              <TableHead className="text-right min-w-[100px]">
                {t("app.admin.leads.leads.admin.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead: LeadResponseType) => {
              const statusConfig = getStatusConfig(lead.status);
              return (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/${locale}/admin/leads/${lead.id}/edit`}
                      className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {lead.businessName}
                    </Link>
                  </TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig.variant}>
                      {t(statusConfig.label)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lead.currentCampaignStage ? (
                      <Badge variant="outline">
                        {t(`leads.admin.stage.${lead.currentCampaignStage}`)}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">
                        {t("app.admin.leads.leads.admin.formatting.fallbacks.notAvailable")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {lead.country}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                      {lead.language}
                    </span>
                  </TableCell>
                  <TableCell>
                    {lead.source ? (
                      <Badge variant="secondary" className="text-xs">
                        {lead.source}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">
                        {t("app.admin.leads.leads.admin.formatting.fallbacks.notAvailable")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400">
                        {t("app.admin.leads.leads.admin.formatting.fallbacks.notAvailable")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.website ? (
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {t("app.admin.leads.leads.admin.table.website")}
                      </a>
                    ) : (
                      <span className="text-gray-400">
                        {t("app.admin.leads.leads.admin.formatting.fallbacks.notAvailable")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {lead.emailsSent}
                      </div>
                      <div className="text-xs text-gray-500">sent</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {lead.emailsOpened}
                      </div>
                      <div className="text-xs text-gray-500">opened</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {lead.emailsClicked}
                      </div>
                      <div className="text-xs text-gray-500">clicked</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.lastEngagementAt ? (
                      <div className="text-sm">
                        <div>{formatDate(lead.lastEngagementAt)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(lead.lastEngagementAt).toLocaleTimeString(
                            locale,
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        {t("app.admin.leads.leads.admin.formatting.fallbacks.never")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.lastEmailSentAt ? (
                      <div className="text-sm">
                        <div>{formatDate(lead.lastEmailSentAt)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(lead.lastEmailSentAt).toLocaleTimeString(
                            locale,
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        {t("app.admin.leads.leads.admin.formatting.fallbacks.never")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(lead.createdAt)}</TableCell>
                  <TableCell>{formatDate(lead.updatedAt)}</TableCell>
                  <TableCell className="max-w-[200px]">
                    {lead.notes ? (
                      <div
                        className="text-sm text-gray-600 truncate"
                        title={lead.notes}
                      >
                        {lead.notes}
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        {t("app.admin.leads.leads.admin.formatting.fallbacks.notAvailable")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${locale}/admin/leads/${lead.id}/edit`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${locale}/admin/leads/${lead.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
