/* eslint-disable @typescript-eslint/no-explicit-any */
// Test to debug variance issue with CreateApiEndpointAny
import { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "../../../unified-ui/widgets/_shared/types";
import type { CreateApiEndpoint } from "../../endpoints/definition/create";
import { objectField } from "../../field/utils";
import { requestField } from "../../field/utils-new";
import type { UnifiedField } from "../../widgets/configs";
import type { CreateApiEndpointAny } from "../endpoint-base";
import type { Methods } from "../enums";
import { FieldDataType, WidgetType } from "../enums";

// Simulate the exact structure from retry/stop endpoints
const testEndpoint_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    jobId: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.UUID,
      label: "Job ID",
      schema: z.string().uuid(),
    }),
    result: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {
        success: requestField({
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "Success",
          schema: z.boolean(),
        }),
      },
    ),
  },
);

type TestEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly ["app.api.user.userRoles.enums.userRole.admin"],
  string,
  typeof testEndpoint_field
>;

// Test if it's assignable
type Test1 = TestEndpoint extends CreateApiEndpointAny ? "PASS" : "FAIL";
const test1: Test1 = "PASS";

// Try with generic roles
type TestEndpoint2 = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  string,
  AnyChildrenConstrain<string, FieldUsageConfig>,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
>;

type Test2 = TestEndpoint2 extends CreateApiEndpointAny ? "PASS" : "FAIL";
const test2: Test2 = "PASS";

// Export to avoid unused variable warnings
export { test1, test2 };
