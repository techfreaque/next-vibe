import { beforeAll, describe, expect, it } from "vitest";

import loginOptionsEndpoints from "./definition";
import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

testEndpoint(endpoint.GET);
