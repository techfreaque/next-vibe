import { createEnumOptions } from "../../../unified-interface/shared/field/enum";
import { scopedTranslation } from "./i18n";

/**
 * TRPC Validation Operation Types
 */
export const {
  enum: TRPCValidationOperationType,
  options: TRPCValidationOperationTypeOptions,
} = createEnumOptions(scopedTranslation, {
  VALIDATE_INTEGRATION: "operations.validateIntegration",
  VALIDATE_ROUTE_FILE: "operations.validateRouteFile",
  GENERATE_REPORT: "operations.generateReport",
  FIX_ROUTES: "operations.fixRoutes",
  CHECK_ROUTER_EXISTS: "operations.checkRouterExists",
});

/**
 * Validation Severity Types
 */
export const { enum: ValidationSeverity, options: ValidationSeverityOptions } =
  createEnumOptions(scopedTranslation, {
    ERROR: "severity.error",
    WARNING: "severity.warning",
    INFO: "severity.info",
  });
