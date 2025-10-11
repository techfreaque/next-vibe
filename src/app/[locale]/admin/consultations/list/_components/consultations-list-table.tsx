/**
 * Consultations List Table Component
 * Table display for consultation list
 */

"use client";

import { Edit, Loader2 } from "lucide-react";
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

import type { ConsultationAdminListGetResponseTypeOutput } from "@/app/api/[locale]/v1/core/consultation/admin/list/definition";
import {
  ConsultationStatus,
  type ConsultationStatusValue,
} from "@/app/api/[locale]/v1/core/consultation/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

type ConsultationItem =
  ConsultationAdminListGetResponseTypeOutput["consultations"][number];

interface ConsultationsListTableProps {
  consultations: ConsultationItem[];
  loading: boolean;
  locale: CountryLanguage;
}

export function ConsultationsListTable({
  consultations,
  loading,
  locale,
}: ConsultationsListTableProps): React.JSX.Element {
  const { t } = simpleT(locale);

  const getStatusBadgeVariant = (
    status: typeof ConsultationStatusValue,
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return "secondary";
      case ConsultationStatus.SCHEDULED:
        return "default";
      case ConsultationStatus.CONFIRMED:
        return "default";
      case ConsultationStatus.COMPLETED:
        return "default";
      case ConsultationStatus.CANCELLED:
        return "destructive";
      case ConsultationStatus.NO_SHOW:
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) {
      return "-";
    }
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string | null, maxLength = 50): string => {
    if (!text) {
      return "-";
    }
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>{t("consultations.admin.list.table.loading")}</span>
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("consultations.admin.list.table.noResults")}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("consultations.admin.list.table.user")}</TableHead>
            <TableHead>{t("consultations.admin.list.table.status")}</TableHead>
            <TableHead>
              {t("consultations.admin.list.table.businessType")}
            </TableHead>
            <TableHead>
              {t("consultations.admin.list.table.preferredDate")}
            </TableHead>
            <TableHead>
              {t("consultations.admin.list.table.scheduledDate")}
            </TableHead>
            <TableHead>{t("consultations.admin.list.table.message")}</TableHead>
            <TableHead>
              {t("consultations.admin.list.table.createdAt")}
            </TableHead>
            <TableHead className="text-right">
              {t("consultations.admin.list.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations.map((consultation) => (
            <TableRow key={consultation.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {consultation.userName || t("consultations.admin.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {consultation.userEmail}
                  </div>
                  {consultation.userContactPhone && (
                    <div className="text-sm text-muted-foreground">
                      {consultation.userContactPhone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(consultation.status)}>
                  {t("consultations.admin.stats.pending")}
                </Badge>
              </TableCell>
              <TableCell>{consultation.userBusinessType || "-"}</TableCell>
              <TableCell>
                {formatDate(consultation.preferredDate)}
                {consultation.preferredTime && (
                  <div className="text-sm text-muted-foreground">
                    {consultation.preferredTime}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {formatDate(consultation.scheduledDate)}
                {consultation.scheduledTime && (
                  <div className="text-sm text-muted-foreground">
                    {consultation.scheduledTime}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {truncateText(consultation.message)}
                </div>
              </TableCell>
              <TableCell>{formatDate(consultation.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/${locale}/admin/consultations/consultation/${consultation.id}`}
                >
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    {t("consultations.admin.list.table.edit")}
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
