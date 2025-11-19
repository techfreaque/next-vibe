/**
 * Leads Import API Hook
 * React hook for CSV import with file handling logic
 */

import React from "react";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { DivDragEvent } from "@/packages/next-vibe-ui/web/ui/div";
import type { InputChangeEvent } from "@/packages/next-vibe-ui/web/ui/input";

import definitions from "./definition";

/**
 * Hook for CSV import with file handling logic
 */
export function useLeadsImportEndpoint(
  logger: EndpointLogger,
  params?: { enabled?: boolean },
): EndpointReturn<typeof definitions> & {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleFileSelect: (file: File) => void;
  handleDrop: (e: DivDragEvent) => void;
  handleFileInputChange: (e: InputChangeEvent<"file">) => void;
  dragOver: boolean;
  setDragOver: React.Dispatch<React.SetStateAction<boolean>>;
  downloadTemplate: () => void;
  processAndSetFile: (file: File) => Promise<void>;
} {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const form = useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: params?.enabled !== false,
        refetchOnWindowFocus: false,
        staleTime: 0,
      },
      formOptions: {
        persistForm: false,
        persistenceKey: "leads-import-form",
      },
    },
    logger,
  );

  // File processing function
  const processAndSetFile = React.useCallback(
    async (file: File): Promise<void> => {
      if (!form.create) {
        return;
      }

      try {
        // Convert file to base64
        const fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.addEventListener("load", (): void => {
            if (typeof reader.result !== "string") {
              reject(new Error("Failed to read file as string"));
              return;
            }
            // Remove data URL prefix to get just base64
            const base64 = reader.result.split(",")[1];
            resolve(base64);
          });
          reader.addEventListener("error", reject);
          reader.readAsDataURL(file);
        });

        // Set form values
        form.create.form.setValue("file", fileContent);
        form.create.form.setValue("fileName", file.name);

        // Trigger validation to ensure form is valid
        await form.create.form.trigger(["file", "fileName"]);
      } catch (error) {
        logger.error(
          "app.api.v1.core.leads.import.file.processing.error",
          error instanceof Error ? error.message : String(error),
        );
      }
    },
    [form.create, logger],
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
    (e: DivDragEvent): void => {
      e.preventDefault?.();
      setDragOver(false);

      const files = e.dataTransfer?.files ? [...e.dataTransfer.files] : [];
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleFileInputChange = React.useCallback(
    (e: InputChangeEvent<"file">): void => {
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
    ...form,
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

export type LeadsImportEndpointReturn = ReturnType<
  typeof useLeadsImportEndpoint
>;
