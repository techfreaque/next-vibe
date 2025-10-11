/**
 * Import Job Retry Action API Definition
 */

import { undefinedSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

// Retry job endpoint (POST)
const retryJobEndpoint = createEndpoint({
  description: "Retry a failed import job",
  method: Methods.POST,
  requestSchema: undefinedSchema,
  responseSchema: z.object({
    success: z.boolean(),
    message: z.string() as z.ZodType<TranslationKey>,
  }),
  requestUrlSchema: z.object({
    jobId: z.uuid(),
  }),
  apiQueryOptions: {
    queryKey: ["import-jobs"],
  },
  fieldDescriptions: {
    jobId: "ID of the import job to retry",
  },
  allowedRoles: [UserRole.ADMIN],
  errorTypes: {
    unauthorized: {
      title: "leadsErrors.leadsImport.retry.error.unauthorized.title",
      description:
        "leadsErrors.leadsImport.retry.error.unauthorized.description",
    },
    forbidden: {
      title: "leadsErrors.leadsImport.retry.error.forbidden.title",
      description: "leadsErrors.leadsImport.retry.error.forbidden.description",
    },
    not_found: {
      title: "leadsErrors.leadsImport.retry.error.not_found.title",
      description: "leadsErrors.leadsImport.retry.error.not_found.description",
    },
    validation_failed: {
      title: "leadsErrors.leadsImport.retry.error.validation.title",
      description: "leadsErrors.leadsImport.retry.error.validation.description",
    },
    server_error: {
      title: "leadsErrors.leadsImport.retry.error.server.title",
      description: "leadsErrors.leadsImport.retry.error.server.description",
    },
  },
  successTypes: {
    title: "leadsErrors.leadsImport.retry.success.title",
    description: "leadsErrors.leadsImport.retry.success.description",
  },
  path: ["v1", "leads", "import", "jobs", "[jobId]", "retry"],
  examples: {
    urlPathVariables: {
      default: {
        jobId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    payloads: undefined,
    responses: {
      default: {
        success: true,
        message: "leadsErrors.leadsImport.retry.success.description",
      },
    },
  },
});

const definitions = {
  POST: retryJobEndpoint.POST,
} as const;

export default definitions;

export type ImportJobRetryResponseType = z.infer<
  typeof retryJobEndpoint.POST.responseSchema
>;
