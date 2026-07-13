/* eslint-disable @typescript-eslint/no-explicit-any */
// Test to debug variance issue with CreateApiEndpointAny
import type { CreateApiEndpoint } from "next-vibe/core/definition/create";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { Methods } from "next-vibe/core/definition/enums";
import { FieldDataType, WidgetType } from "next-vibe/core/definition/enums";
import type { UserRoleValue } from "next-vibe/identity/roles/enum";
import type { EndpointEventsMap } from "next-vibe/realtime/structured-events";
import type { UnifiedField } from "next-vibe/unified-ui/_shared/configs";
import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "next-vibe/unified-ui/_shared/types";
import { objectField, requestField } from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

const genericST: { ScopedTranslationKey: string } = {
  ScopedTranslationKey: "",
};

// Simulate the exact structure from retry/stop endpoints
const testEndpoint_field = objectField(genericST, {
  type: WidgetType.CONTAINER,
  usage: { request: "data" },
  children: {
    jobId: requestField(genericST, {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.UUID,
      label: "Job ID",
      schema: z.string().uuid(),
    }),
    result: objectField(genericST, {
      type: WidgetType.CONTAINER,
      usage: { request: "data" },
      children: {
        success: requestField(genericST, {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "Success",
          schema: z.boolean(),
        }),
      },
    }),
  },
});

type TestEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly ["enums.userRole.admin"],
  string,
  typeof testEndpoint_field,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EndpointEventsMap<any, any, any>
>;

// Test if it's assignable
type Test1 = TestEndpoint extends CreateApiEndpointAny ? "PASS" : "FAIL";
const test1: Test1 = "PASS";

// Try with generic roles
type TestEndpoint2 = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  string,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EndpointEventsMap<any, any, any>
>;

type Test2 = TestEndpoint2 extends CreateApiEndpointAny ? "PASS" : "FAIL";
const test2: Test2 = "PASS";

// Export to avoid unused variable warnings
export { test1, test2 };
