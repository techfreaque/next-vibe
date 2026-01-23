// Test to debug variance issue with CreateApiEndpointAny
import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import type { CreateApiEndpoint } from "../../endpoints/definition/create";
import type { WidgetConfig } from "../../widgets/configs";
import type {
  CreateApiEndpointAny,
  ObjectField,
  PrimitiveField,
  UnifiedField,
} from "../endpoint";
import type { FieldUsageConfig } from "../endpoint";
import type { Methods } from "../enums";

// Simulate the exact structure from retry/stop endpoints
type TestEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly ["app.api.user.userRoles.enums.userRole.admin"],
  string,
  ObjectField<
    {
      jobId: PrimitiveField<z.ZodUUID, FieldUsageConfig>;
      result: ObjectField<
        {
          success: PrimitiveField<z.ZodBoolean, FieldUsageConfig>;
        },
        FieldUsageConfig,
        string,
        WidgetConfig<
          string,
          z.ZodTypeAny,
          FieldUsageConfig,
          Record<string, UnifiedField<string, z.ZodTypeAny>>
        >
      >;
    },
    FieldUsageConfig
  >
>;

// Test if it's assignable
type Test1 = TestEndpoint extends CreateApiEndpointAny ? "PASS" : "FAIL";
const test1: Test1 = "PASS";

// Try with simpler types
type TestEndpoint2 = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  string,
  UnifiedField<string, z.ZodTypeAny>
>;

type Test2 = TestEndpoint2 extends CreateApiEndpointAny ? "PASS" : "FAIL";
const test2: Test2 = "PASS";

// Export to avoid unused variable warnings
export { test1, test2 };
