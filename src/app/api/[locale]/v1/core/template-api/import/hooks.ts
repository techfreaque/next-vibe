/**
 * Template Import Hook
 *
 * Single comprehensive hook that provides utilities and state for template import operations.
 * UI logic stays in UI components - this hook only provides business logic and state.
 */

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import definitions from "./definition";
import { ImportFormat } from "./enum";

// =============================================================================
// VALIDATION TYPES
// =============================================================================

export interface ImportValidationResult {
  valid: boolean;
  error: string | null;
  warnings?: string[];
}

// =============================================================================
// MAIN HOOK
// =============================================================================

/**
 * Main template import hook - provides all utilities and state needed
 */
export function useTemplateImport(
  logger: EndpointLogger,
  params: {
    locale: CountryLanguage;
    enabled?: boolean;
  },
): {
  validateImportData: (
    data: string,
    format: ImportFormat,
  ) => ImportValidationResult;
  handleValidation: (
    data: string,
    format: ImportFormat,
  ) => ImportValidationResult;
  validationResult: ImportValidationResult | null;
  setValidationResult: Dispatch<SetStateAction<ImportValidationResult | null>>;
  form: EndpointReturn<typeof definitions>["create"]["form"];
  handleSubmit: EndpointReturn<typeof definitions>["create"]["onSubmit"];
  isSubmitting: boolean;
  isSuccess: boolean;
  hasError: boolean;
  alert: EndpointReturn<typeof definitions>["alert"];
  canSubmit: boolean;
} {
  const { t } = simpleT(params.locale);
  const [validationResult, setValidationResult] =
    useState<ImportValidationResult | null>(null);

  // Basic endpoint
  const endpoint = useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: params.enabled !== false,
        refetchOnWindowFocus: false,
        staleTime: 0,
      },
      formOptions: {
        persistForm: false,
      },
    },
    logger,
  );

  // Validation utility
  const validateImportData = useCallback(
    (data: string, format: ImportFormat): ImportValidationResult => {
      if (!data.trim()) {
        return {
          valid: false,
          error: t(
            "templateApiImport.templateApi.import.form.errors.dataEmpty.description",
          ),
        };
      }

      const warnings: string[] = [];

      switch (format) {
        case ImportFormat.CSV: {
          if (!data.includes(",") && !data.includes("\n")) {
            return {
              valid: false,
              error: t(
                "templateApiImport.templateApi.import.form.errors.csvFormat.description",
              ),
            };
          }

          const lines = data.split("\n").filter((line) => line.trim());
          if (lines.length < 2) {
            warnings.push(
              t(
                "templateApiImport.templateApi.import.form.warnings.csvMinRows",
              ),
            );
          }
          break;
        }

        case ImportFormat.JSON: {
          try {
            JSON.parse(data);
          } catch {
            return {
              valid: false,
              error: t(
                "templateApiImport.templateApi.import.form.errors.jsonFormat.description",
              ),
            };
          }
          break;
        }

        case ImportFormat.XML: {
          if (!data.includes("<") || !data.includes(">")) {
            return {
              valid: false,
              error: t(
                "templateApiImport.templateApi.import.form.errors.xmlFormat.description",
              ),
            };
          }
          break;
        }
      }

      return {
        valid: true,
        error: null,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    },
    [t],
  );

  // Validation handler
  const handleValidation = useCallback(
    (data: string, format: ImportFormat) => {
      const result = validateImportData(data, format);
      setValidationResult(result);
      return result;
    },
    [validateImportData],
  );

  return {
    // Form utilities
    form: endpoint.create.form,
    handleSubmit: endpoint.create.onSubmit,

    // State
    isSubmitting: endpoint.create.isSubmitting ?? false,
    isSuccess: endpoint.create.response?.success ?? false,
    hasError: endpoint.create.response?.success === false,

    // Validation
    validateImportData,
    handleValidation,
    validationResult,
    setValidationResult,

    // UI utilities
    alert: endpoint.alert,
    canSubmit: !endpoint.create.isSubmitting,
  };
}
