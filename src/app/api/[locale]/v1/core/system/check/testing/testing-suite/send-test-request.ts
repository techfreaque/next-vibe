/* eslint-disable i18next/no-literal-string */
// Testing infrastructure - error messages are for test debugging, not end users

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import request from "supertest";
import type z from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { env } from "@/config/env";

import type { UserRoleValue } from "../../../../user/user-roles/enum";
import type { InferJwtPayloadTypeFromRoles } from "../../../unified-ui/cli/vibe/endpoints/endpoint-handler/types";
import type { UnifiedField } from "../../../unified-ui/cli/vibe/endpoints/endpoint-types/core/types";
import type { Methods } from "../../../unified-ui/cli/vibe/endpoints/endpoint-types/types";

/**
 * Call the api on the test server
 */

export async function sendTestRequest<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields extends UnifiedField<z.ZodTypeAny>,
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TResponseOutput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
>({
  endpoint,
  data,
  urlParams,
  user,
}: {
  endpoint: CreateApiEndpoint<
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields,
    TRequestInput,
    TRequestOutput,
    TResponseInput,
    TResponseOutput,
    TUrlVariablesInput,
    TUrlVariablesOutput
  >;
  data: TRequestOutput;
  urlParams: TUrlVariablesOutput;
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue>;
}): Promise<ResponseType<TResponseOutput>> {
  try {
    const searchParams = new URLSearchParams();
    if (urlParams) {
      for (const [key, value] of Object.entries(urlParams)) {
        searchParams.append(key, String(value));
      }
    }
    const url = `/${endpoint.path.join("/")}?${searchParams.toString()}`;
    // In a real implementation, we would create a session for the user
    // This is a placeholder for session creation
    const token = user ? `test-token-${user.id}` : undefined;
    // Use a test server URL (this would be configured in a real environment)
    const testServer = env.NEXT_PUBLIC_TEST_SERVER_URL;
    const response = await request(testServer)
      .post(url)
      .set("Authorization", `Bearer ${token}`)
      .send(data as Parameters<typeof request.Test.prototype.send>[0]);

    // In a real implementation, we would clean up the session here
    // This is a placeholder for session cleanup

    const responseData = response.body as
      | ResponseType<TResponseOutput>
      | undefined;
    if (!responseData) {
      return createErrorResponse(
        "app.api.v1.core.system.check.testing.test.errors.internal.title",
        ErrorResponseTypes.NO_RESPONSE_DATA,
        { endpoint: endpoint.path.join("/") },
      );
    }
    // TODO parse response schema
    return responseData;
  } catch (error) {
    return createErrorResponse(
      "app.api.v1.core.system.check.testing.test.errors.internal.title",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: parseError(error).message },
    );
  }
}
