/**
 * Batch Operations Hooks
 * React hooks for batch operations on leads
 */

"use client";

import { Environment, parseError } from "next-vibe/shared/utils";
import { useCallback, useEffect, useState } from "react";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { envClient } from "@/config/env-client";
import { useTranslation } from "@/i18n/core/client";

import type { EmailCampaignStage, LeadSource, LeadStatus } from "../enum";
import type { LeadListGetRequestTypeOutput } from "../list/definition";
import definitions, { type BatchOperationScope } from "./definition";

/**
 * Hook for batch updating leads
 * Provides form-based batch operations with preview capability
 */
export function useBatchUpdateEndpoint(): EndpointReturn<{
  PATCH: typeof definitions.PATCH;
}> {
  const { locale } = useTranslation();
  const isDevelopment = envClient.NODE_ENV === Environment.DEVELOPMENT;
  const logger = createEndpointLogger(isDevelopment, Date.now(), locale);

  return useEndpoint(
    { PATCH: definitions.PATCH },
    {
      queryOptions: {
        enabled: false, // Only run when explicitly triggered
        refetchOnWindowFocus: false,
        staleTime: 0, // Don't cache mutations
      },
      formOptions: {
        persistForm: false,
      },
    },
    logger,
  );
}

/**
 * Hook for batch deleting leads
 * Provides form-based batch delete operations with preview capability
 */
export function useBatchDeleteEndpoint(): EndpointReturn<{
  DELETE: typeof definitions.DELETE;
}> {
  const { locale } = useTranslation();
  const isDevelopment = envClient.NODE_ENV === Environment.DEVELOPMENT;
  const logger = createEndpointLogger(isDevelopment, Date.now(), locale);

  return useEndpoint(
    {
      DELETE: definitions.DELETE,
    },
    {
      queryOptions: {
        enabled: false, // Only run when explicitly triggered
        refetchOnWindowFocus: false,
        staleTime: 0, // Don't cache mutations
      },
      formOptions: {
        persistForm: false,
      },
    },
    logger,
  );
}

export type BatchUpdateEndpointReturn = EndpointReturn<{
  PATCH: typeof definitions.PATCH;
}>;
export type BatchDeleteEndpointReturn = EndpointReturn<{
  DELETE: typeof definitions.DELETE;
}>;

interface BatchOperationsReturn {
  // State
  batchDialogOpen: boolean;
  batchDialogMode: "preview" | "confirm" | "result";
  operationType: "update" | "delete";
  pendingUpdates: {
    status?: (typeof LeadStatus)[keyof typeof LeadStatus];
    currentCampaignStage?: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
    source?: (typeof LeadSource)[keyof typeof LeadSource];
    notes?: string;
  };
  previewLeads: Array<{
    id: string;
    email: string | null;
    businessName: string;
    currentStatus: (typeof LeadStatus)[keyof typeof LeadStatus];
    currentCampaignStage:
      | (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage]
      | null;
  }>;

  // Handlers
  handlePreview: (
    currentFilters: LeadListGetRequestTypeOutput,
    updates: {
      status?: (typeof LeadStatus)[keyof typeof LeadStatus];
      currentCampaignStage?: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
      source?: (typeof LeadSource)[keyof typeof LeadSource];
      notes?: string;
    },
  ) => Promise<void>;
  handleDeletePreview: (
    currentFilters: LeadListGetRequestTypeOutput,
  ) => Promise<void>;
  handleBatchUpdate: (
    updates: {
      status?: (typeof LeadStatus)[keyof typeof LeadStatus];
      currentCampaignStage?: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
      source?: (typeof LeadSource)[keyof typeof LeadSource];
      notes?: string;
    },
    currentFilters: LeadListGetRequestTypeOutput,
    scope: (typeof BatchOperationScope)[keyof typeof BatchOperationScope],
  ) => Promise<void>;
  handleBatchDelete: (
    currentFilters: LeadListGetRequestTypeOutput,
    scope: (typeof BatchOperationScope)[keyof typeof BatchOperationScope],
  ) => Promise<void>;
  handleConfirmBatchUpdate: (
    currentFilters: LeadListGetRequestTypeOutput,
    onSuccess?: () => void,
  ) => Promise<void>;
  handleConfirmBatchDelete: (
    currentFilters: LeadListGetRequestTypeOutput,
    onSuccess?: () => void,
  ) => Promise<void>;
  handleCloseDialog: () => void;

  // Dialog state setters
  setBatchDialogOpen: (open: boolean) => void;
  setBatchDialogMode: (mode: "preview" | "confirm" | "result") => void;

  // Endpoints
  batchUpdateEndpoint: BatchUpdateEndpointReturn;
  batchDeleteEndpoint: BatchDeleteEndpointReturn;

  // Operation completion callback
  onOperationComplete?: () => void;
}

/**
 * Batch operations state and logic hook
 * Manages selection state and batch operations workflow
 */
export function useBatchOperations(
  onOperationComplete?: () => void,
): BatchOperationsReturn {
  // Initialize client logger
  const { locale } = useTranslation();
  const isDevelopment = envClient.NODE_ENV === Environment.DEVELOPMENT;
  const logger = createEndpointLogger(isDevelopment, Date.now(), locale);

  // Dialog state
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchDialogMode, setBatchDialogMode] = useState<
    "preview" | "confirm" | "result"
  >("preview");
  const [operationType, setOperationType] = useState<"update" | "delete">(
    "update",
  );
  const [pendingUpdates, setPendingUpdates] = useState<{
    status?: (typeof LeadStatus)[keyof typeof LeadStatus];
    currentCampaignStage?: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
    source?: (typeof LeadSource)[keyof typeof LeadSource];
    notes?: string;
  }>({});
  const [previewLeads, setPreviewLeads] = useState<
    Array<{
      id: string;
      email: string | null;
      businessName: string;
      currentStatus: (typeof LeadStatus)[keyof typeof LeadStatus];
      currentCampaignStage:
        | (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage]
        | null;
    }>
  >([]);

  // Batch endpoints
  const batchUpdateEndpoint = useBatchUpdateEndpoint();
  const batchDeleteEndpoint = useBatchDeleteEndpoint();

  // Watch for responses and auto-open modal
  useEffect(() => {
    if (
      operationType === "delete" &&
      batchDeleteEndpoint.create?.response?.success &&
      batchDeleteEndpoint.create?.response?.data?.response?.preview &&
      !batchDialogOpen
    ) {
      logger.debug(
        "app.api.v1.core.leads.batch.delete.preview.modal.auto.open",
        {
          previewCount:
            batchDeleteEndpoint.create.response.data.response.preview.length,
        },
      );
      setPreviewLeads(
        batchDeleteEndpoint.create.response.data.response.preview,
      );
      setBatchDialogMode("preview");
      setBatchDialogOpen(true);
    }
  }, [
    operationType,
    batchDeleteEndpoint.create?.response,
    batchDialogOpen,
    logger,
  ]);

  useEffect(() => {
    if (
      operationType === "update" &&
      batchUpdateEndpoint.create?.response?.success &&
      batchUpdateEndpoint.create?.response?.data?.response?.preview &&
      !batchDialogOpen
    ) {
      logger.debug(
        "app.api.v1.core.leads.batch.update.preview.modal.auto.open",
        {
          previewCount:
            batchUpdateEndpoint.create.response.data.response.preview.length,
        },
      );
      setPreviewLeads(
        batchUpdateEndpoint.create.response.data.response.preview,
      );
      setBatchDialogMode("preview");
      setBatchDialogOpen(true);
    }
  }, [
    operationType,
    batchUpdateEndpoint.create?.response,
    batchDialogOpen,
    logger,
  ]);

  // Preview handlers

  // Preview handler
  const handlePreview = useCallback(
    async (
      currentFilters: LeadListGetRequestTypeOutput,
      updates: {
        status?: (typeof LeadStatus)[keyof typeof LeadStatus];
        currentCampaignStage?: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
        source?: (typeof LeadSource)[keyof typeof LeadSource];
        notes?: string;
      },
    ) => {
      try {
        setPendingUpdates(updates);

        // Set form values
        batchUpdateEndpoint.create.form.reset({
          ...currentFilters,
          updates,
          dryRun: true,
          maxRecords: 1000,
        });

        // Submit the form
        await batchUpdateEndpoint.create.submitForm(undefined);

        // Response will be handled by useEffect
      } catch (error) {
        logger.error(
          "app.api.v1.core.leads.batch.preview.failed",
          parseError(error).message,
        );
      }
    },
    [batchUpdateEndpoint.create, logger],
  );

  // Batch update handler
  const handleBatchUpdate = useCallback(
    async (
      updates: {
        status?: (typeof LeadStatus)[keyof typeof LeadStatus];
        currentCampaignStage?: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
        source?: (typeof LeadSource)[keyof typeof LeadSource];
        notes?: string;
      },
      currentFilters: LeadListGetRequestTypeOutput,
      scope: (typeof BatchOperationScope)[keyof typeof BatchOperationScope],
    ): Promise<void> => {
      try {
        // Prevent double calls by checking if already submitting
        if (batchUpdateEndpoint.create.isSubmitting) {
          logger.debug(
            "app.api.v1.core.leads.batch.update.in.progress.ignored",
          );
          return;
        }

        setOperationType("update");
        setPendingUpdates(updates);

        // Set form values with all filters including scope
        batchUpdateEndpoint.create.form.reset({
          ...currentFilters,
          scope,
          updates,
          dryRun: true,
          maxRecords: 1000,
        });

        // Submit the form
        await batchUpdateEndpoint.create.submitForm(undefined);

        // Check response
        if (
          batchUpdateEndpoint.create?.response?.success &&
          batchUpdateEndpoint.create?.response?.data?.response?.preview
        ) {
          setPreviewLeads(
            batchUpdateEndpoint.create.response.data.response.preview,
          );
          setBatchDialogMode("preview");
          setBatchDialogOpen(true);
        }
      } catch (error) {
        logger.error(
          "app.api.v1.core.leads.batch.update.failed",
          parseError(error).message,
        );
      }
    },
    [batchUpdateEndpoint.create, logger],
  );

  // Confirm batch update handler
  const handleConfirmBatchUpdate = useCallback(
    async (
      currentFilters: LeadListGetRequestTypeOutput,
      onSuccess?: () => void,
    ) => {
      try {
        setBatchDialogMode("result");

        // Set form values
        batchUpdateEndpoint.create.form.reset({
          ...currentFilters,
          updates: pendingUpdates,
          dryRun: false,
          maxRecords: 1000,
        });

        // Submit the form
        await batchUpdateEndpoint.create.submitForm(undefined);

        // Check response
        if (batchUpdateEndpoint.create.response?.success) {
          onSuccess?.();
          onOperationComplete?.();
        }
      } catch (error) {
        logger.error(
          "app.api.v1.core.leads.batch.update.failed",
          parseError(error).message,
        );
      }
    },
    [batchUpdateEndpoint.create, pendingUpdates, onOperationComplete, logger],
  );

  // Delete preview handler
  const handleDeletePreview = useCallback(
    async (currentFilters: LeadListGetRequestTypeOutput) => {
      try {
        setOperationType("delete");

        // Set form values for delete preview
        batchDeleteEndpoint.create.form.reset({
          ...currentFilters,
          confirmDelete: true,
          dryRun: true,
          maxRecords: 1000,
        });

        // Submit the form
        await batchDeleteEndpoint.create.submitForm(undefined);

        // Check response
        if (
          batchDeleteEndpoint.create?.response?.success &&
          batchDeleteEndpoint.create?.response?.data?.response?.preview
        ) {
          setPreviewLeads(
            batchDeleteEndpoint.create.response.data.response.preview,
          );
          setBatchDialogMode("preview");
          setBatchDialogOpen(true);
        }
      } catch (error) {
        logger.error(
          "app.api.v1.core.leads.batch.delete.preview.failed",
          parseError(error).message,
        );
      }
    },
    [batchDeleteEndpoint.create, logger],
  );

  // Batch delete handler
  const handleBatchDelete = useCallback(
    async (
      currentFilters: LeadListGetRequestTypeOutput,
      scope: (typeof BatchOperationScope)[keyof typeof BatchOperationScope],
    ): Promise<void> => {
      try {
        // Prevent double calls by checking if already submitting
        if (batchDeleteEndpoint.create.isSubmitting) {
          logger.debug(
            "app.api.v1.core.leads.batch.delete.in.progress.ignored",
          );
          return;
        }

        logger.debug("app.api.v1.core.leads.batch.delete.hook.called", {
          currentFilters,
        });
        setOperationType("delete");

        // Set form values for delete preview with all filters including scope
        const formData = {
          ...currentFilters,
          scope,
          confirmDelete: true,
          dryRun: true,
          maxRecords: 1000,
        };

        logger.debug("app.api.v1.core.leads.batch.delete.form.data.set", {
          formData,
        });
        batchDeleteEndpoint.create.form.reset(formData);

        // Submit the form
        logger.debug("app.api.v1.core.leads.batch.delete.form.submitting");
        await batchDeleteEndpoint.create.submitForm(undefined);

        // Response will be handled by useEffect
        logger.debug(
          "app.api.v1.core.leads.batch.delete.form.submitted.waiting.response",
        );
      } catch (error) {
        logger.error(
          "app.api.v1.core.leads.batch.delete.preview.failed",
          parseError(error).message,
        );
      }
    },
    [batchDeleteEndpoint.create, logger],
  );

  // Confirm batch delete handler
  const handleConfirmBatchDelete = useCallback(
    async (
      currentFilters: LeadListGetRequestTypeOutput,
      onSuccess?: () => void,
    ) => {
      try {
        setBatchDialogMode("result");

        // Set form values
        batchDeleteEndpoint.create.form.reset({
          ...currentFilters,
          confirmDelete: true,
          dryRun: false,
          maxRecords: 1000,
        });

        // Submit the form
        await batchDeleteEndpoint.create.submitForm(undefined);

        // Check response
        if (batchDeleteEndpoint.create.response?.success) {
          onSuccess?.();
          onOperationComplete?.();
        }
      } catch (error) {
        logger.error(
          "app.api.v1.core.leads.batch.delete.failed",
          parseError(error).message,
        );
      }
    },
    [batchDeleteEndpoint.create, onOperationComplete, logger],
  );

  // Dialog handlers
  const handleCloseDialog = useCallback(() => {
    setBatchDialogOpen(false);
    // Reset operation state when dialog closes
    setOperationType("update");
    setPendingUpdates({});
    setPreviewLeads([]);
  }, []);

  return {
    // State
    batchDialogOpen,
    batchDialogMode,
    operationType,
    pendingUpdates,
    previewLeads,

    // Handlers
    handlePreview,
    handleDeletePreview,
    handleBatchUpdate,
    handleBatchDelete,
    handleConfirmBatchUpdate,
    handleConfirmBatchDelete,
    handleCloseDialog,

    // Dialog state setters
    setBatchDialogOpen,
    setBatchDialogMode,

    // Endpoints
    batchUpdateEndpoint,
    batchDeleteEndpoint,

    // Operation completion callback
    onOperationComplete,
  };
}
