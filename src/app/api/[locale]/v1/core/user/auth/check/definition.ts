/**
 * Auth Check Endpoint Definition
 */

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import { objectField } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/fields/object-field";
import { primitiveField } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/fields/primitive-field";
import { z } from "zod";

const GET = createEndpoint({
  method: Methods.GET,
  title: "app.api.v1.core.user.auth.check.get.title",
  description: "app.api.v1.core.user.auth.check.get.description",
  path: ["api", "[locale]", "v1", "core", "user", "auth", "check"],
  fields: objectField({}, { request: "none" }),
  responseSchema: objectField({
    authenticated: primitiveField(z.boolean(), { response: "data" }),
    tokenValid: primitiveField(z.boolean(), { response: "data" }),
  }, { response: "data" }),
});

const endpoints = { GET };

export default endpoints;
