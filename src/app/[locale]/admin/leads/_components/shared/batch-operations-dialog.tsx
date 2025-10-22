/**
 * Batch Operations Dialog Component
 * Provides confirmation and preview for batch operations
 */

"use client";

import { AlertTriangle, CheckCircle, Eye, Users } from "lucide-react";
import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import type React from "react";

import type {
  EmailCampaignStage,
  LeadSource,
  LeadStatus,
} from "@/app/api/[locale]/v1/core/leads/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

interface BatchOperationsDialogProps {
  locale: CountryLanguage;
  isOpen: boolean;
  onClose: () => void;
  mode: "preview" | "confirm" | "result";
  operationType: "update" | "delete";
  title: TranslationKey;
  description?: TranslationKey;
  leads?: Array<{
    id: string;
    email: string;
    businessName: string;
    currentStatus: (typeof LeadStatus)[keyof typeof LeadStatus];
    currentCampaignStage: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage] | null;
  }>;
  updates?: {
    status?: (typeof LeadStatus)[keyof typeof LeadStatus];
    currentCampaignStage?: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
    source?: (typeof LeadSource)[keyof typeof LeadSource];
    notes?: string;
  };
  result?: {
    success: boolean;
    totalMatched: number;
    totalProcessed: number;
    totalUpdated?: number;
    totalDeleted?: number;
    errors: Array<{ leadId: string; error: string }>;
  };
  onConfirm?: () => void;
  isLoading?: boolean;
}

export function BatchOperationsDialog({
  locale,
  isOpen,
  onClose,
  mode,
  operationType,
  title,
  description,
  leads = [],
  updates,
  result,
  onConfirm,
  isLoading = false,
}: BatchOperationsDialogProps): React.JSX.Element {
  const { t } = simpleT(locale);

  const renderPreviewContent = (): React.JSX.Element => (
    <div className="space-y-4">
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <Alert>
        <Eye className="h-4 w-4" />
        <AlertDescription>
          {t("app.admin.leads.leads.batch.preview_description", { count: leads.length })}
        </AlertDescription>
      </Alert>

      {updates && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            {t("app.admin.leads.leads.batch.planned_changes")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {updates.status && (
              <Badge variant="outline">
                {t("app.admin.leads.leads.batch.change_status", {
                  status: t(updates.status),
                })}
              </Badge>
            )}
            {updates.currentCampaignStage && (
              <Badge variant="outline">
                {t("app.admin.leads.leads.batch.change_stage", {
                  stage: t(updates.currentCampaignStage),
                })}
              </Badge>
            )}
            {updates.source && (
              <Badge variant="outline">
                {t("app.admin.leads.leads.batch.change_source", {
                  source: t(updates.source),
                })}
              </Badge>
            )}
          </div>
        </div>
      )}

      <ScrollArea className="h-64 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("app.admin.leads.leads.table.business")}</TableHead>
              <TableHead>{t("app.admin.leads.leads.table.email")}</TableHead>
              <TableHead>{t("app.admin.leads.leads.table.status")}</TableHead>
              <TableHead>{t("app.admin.leads.leads.table.campaign_stage")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">
                  {lead.businessName}
                </TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{t(lead.currentStatus)}</Badge>
                </TableCell>
                <TableCell>
                  {lead.currentCampaignStage ? (
                    <Badge variant="outline">
                      {t(lead.currentCampaignStage)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">
                      {t("app.admin.leads.leads.formatting.fallbacks.notAvailable")}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );

  const renderResultContent = (): React.JSX.Element => (
    <div className="space-y-4">
      {result?.success ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            {operationType === "delete"
              ? t("app.admin.leads.leads.batch.delete_success_message", {
                  deleted: result.totalDeleted || 0,
                  total: result.totalMatched,
                })
              : t("app.admin.leads.leads.batch.success_message", {
                  updated: result.totalUpdated || 0,
                  total: result.totalMatched,
                })}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("app.admin.leads.leads.batch.error_message")}
          </AlertDescription>
        </Alert>
      )}

      {result?.errors && result.errors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-destructive">
            {t("app.admin.leads.leads.batch.errors_title", {
              count: result.errors.length,
            })}
          </h4>
          <ScrollArea className="h-32 border rounded-md p-2">
            <div className="space-y-1">
              {result.errors.map((error, index) => (
                <div key={index} className="text-sm text-destructive">
                  {error.error}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {title}
          </DialogTitle>
          {description && mode !== "preview" && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        {mode === "preview" && renderPreviewContent()}
        {mode === "result" && renderResultContent()}

        <DialogFooter>
          {mode === "preview" && onConfirm && (
            <>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                {t("app.common.actions.cancel")}
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                variant={operationType === "delete" ? "destructive" : "default"}
              >
                {isLoading
                  ? t("app.common.actions.processing")
                  : operationType === "delete"
                    ? t("app.admin.leads.leads.batch.confirm_delete")
                    : t("app.admin.leads.leads.batch.confirm_update")}
              </Button>
            </>
          )}
          {mode === "result" && (
            <Button onClick={onClose}>{t("app.common.actions.close")}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
