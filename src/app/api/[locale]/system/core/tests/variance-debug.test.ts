/* eslint-disable @typescript-eslint/no-explicit-any */
// Test to debug variance issue with CreateApiEndpointAny
import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "next-vibe-ui/unified/_shared/types";
import { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import type { EndpointEventsMap } from "../../../websocket/structured-events";
import type { CreateApiEndpoint } from "../../endpoints/definition/create";
import { objectField, requestField } from "../../field/utils";
import type { UnifiedField } from "../../widgets/configs";
import type { CreateApiEndpointAny } from "../endpoint-base";
import type { Methods } from "../enums";
import { FieldDataType, WidgetType } from "../enums";

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
