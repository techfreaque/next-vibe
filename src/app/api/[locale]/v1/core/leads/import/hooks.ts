/**
 * Leads Import API Hook
 * React hook for CSV import with file handling logic
 */

import React, { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { envClient } from "@/config/env-client";
import { useTranslation } from "@/i18n/core/client";

import definitions from "./definition";

/**
 * Hook for CSV import with file handling logic
 */
export function useLeadsImportEndpoint(logger: EndpointLogger): EndpointReturn<
  typeof definitions
> & {
  // File handling
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  handleFileSelect: (file: File) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Drag and drop
  dragOver: boolean;
  setDragOver: (dragOver: boolean) => void;

  // Template download
  downloadTemplate: () => void;

  // Form helpers
  processAndSetFile: (file: File) => Promise<void>;
} {
  const { locale } = useTranslation();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const queryOptions = useMemo(
    () => ({
      enabled: false, // Only run when manually triggered
    }),
    [],
  );

  const formOptions = useMemo(
    () => ({
      persistForm: false,
    }),
    [],
  );

  const baseEndpoint = useEndpoint(
    definitions,
    {
      queryOptions,
      formOptions,
    },
    logger,
  );

  // File processing function
  const processAndSetFile = React.useCallback(
    async (file: File): Promise<void> => {
      try {
        // Convert file to base64
        const fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (): void => {
            const result = reader.result as string;
            // Remove data URL prefix to get just base64
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Set form values
        baseEndpoint.create.form.setValue("file", fileContent);
        baseEndpoint.create.form.setValue("fileName", file.name);

        // Trigger validation to ensure form is valid
        await baseEndpoint.create.form.trigger(["file", "fileName"]);
      } catch (error) {
        logger.error("leads.import.file.processing.error", error);
      }
    },
    [baseEndpoint.create.form],
  );

  // File selection handler with validation
  const handleFileSelect = React.useCallback(
    (file: File): void => {
      // eslint-disable-next-line i18next/no-literal-string
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        // Show error for invalid file type
        return;
      }
      setSelectedFile(file);
      // Process file immediately and wait for it to complete
      void processAndSetFile(file);
    },
    [processAndSetFile],
  );

  // Drag and drop handlers
  const handleDrop = React.useCallback(
    (e: React.DragEvent): void => {
      e.preventDefault();
      setDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleFileInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  // Template download functionality
  const downloadTemplate = React.useCallback((): void => {
    const CSV_TEMPLATE_HEADER =
      "email,business_name,contact_name,phone,website,country,language,source,notes";

    const csvContent = [
      CSV_TEMPLATE_HEADER,
      // eslint-disable-next-line i18next/no-literal-string -- Sample data for template
      "john@example.com,Example Corp,John Doe,+1234567890,https://example.com,DE,en,website,Sample lead",
      // eslint-disable-next-line i18next/no-literal-string -- Sample data for template
      "jane@company.com,Company Inc,Jane Smith,+0987654321,https://company.com,PL,en,referral,Another sample",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return {
    ...baseEndpoint,
    // File handling
    selectedFile,
    setSelectedFile,
    handleFileSelect,
    handleDrop,
    handleFileInputChange,

    // Drag and drop
    dragOver,
    setDragOver,

    // Template download
    downloadTemplate,

    // Form helpers
    processAndSetFile,
  };
}

export type LeadsImportEndpointReturn = EndpointReturn<typeof definitions>;
