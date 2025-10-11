/**
 * Import Job Stop Action API Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { undefinedSchema } from "next-vibe/shared/types/common.schema";
import type { TranslationKey } from "@/i18n/core/static-types";

import { UserRole } from "../../../../../user/user-roles/enum";

// Stop job endpoint (POST)
const stopJobEndpoint = createEndpoint({
  description: "Stop a running import job",
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
    jobId: "ID of the import job to stop",
  },
  allowedRoles: [UserRole.ADMIN],
  errorTypes: {
    unauthorized: {
      title: "leadsErrors.leadsImport.stop.error.unauthorized.title",
      description:
        "leadsErrors.leadsImport.stop.error.unauthorized.description",
    },
    forbidden: {
      title: "leadsErrors.leadsImport.stop.error.forbidden.title",
      description: "leadsErrors.leadsImport.stop.error.forbidden.description",
    },
    not_found: {
      title: "leadsErrors.leadsImport.stop.error.not_found.title",
      description: "leadsErrors.leadsImport.stop.error.not_found.description",
    },
    validation_failed: {
      title: "leadsErrors.leadsImport.stop.error.validation.title",
      description: "leadsErrors.leadsImport.stop.error.validation.description",
    },
    server_error: {
      title: "leadsErrors.leadsImport.stop.error.server.title",
      description: "leadsErrors.leadsImport.stop.error.server.description",
    },
  },
  successTypes: {
    title: "leadsErrors.leadsImport.stop.success.title",
    description: "leadsErrors.leadsImport.stop.success.description",
  },
  path: ["v1", "leads", "import", "jobs", "[jobId]", "stop"],
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
        message: "leadsErrors.leadsImport.stop.success.description",
      },
    },
  },
});

const definitions = {
  POST: stopJobEndpoint.POST,
} as const;

export default definitions;

export type ImportJobStopResponseType = z.infer<
  typeof stopJobEndpoint.POST.responseSchema
>;
