import { createEndpoint } from "next-query-portal/client";
import {
  messageResponseSchema,
  undefinedSchema,
  UserRoleValue,
} from "next-query-portal/shared";

import { registerEndpoint } from "../register/definition";
import { resetPasswordRequestSchema } from "./schema";

export const resetPasswordEndpoint = createEndpoint({
  description: "Send a password reset email",
  method: "POST",
  dirname: __dirname,
  requestSchema: resetPasswordRequestSchema,
  responseSchema: messageResponseSchema,

  examples: {
    payloads: {
      default: {
        id: "9bfb43b8-c361-4f3e-b512-ec2ced9bf687",
        email: registerEndpoint.examples.payloads.default.email,
      },
      example1: {
        id: "9bfb43b8-c361-4f3e-b512-ec2ced9bf688",
        email: registerEndpoint.examples.payloads["customer"]!["email"],
      },
    },
    urlPathVariables: undefined,
  },
  apiQueryOptions: {
    queryKey: ["reset-password"],
  },
  fieldDescriptions: {
    email: "Email address",
  },
  errorCodes: {
    500: "Internal server error",
    400: "Invalid request data",
  },
  allowedRoles: [UserRoleValue.PUBLIC],
  requestUrlSchema: undefinedSchema,
});
