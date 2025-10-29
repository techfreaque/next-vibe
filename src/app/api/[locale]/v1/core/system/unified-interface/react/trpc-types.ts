/**
 * Re-export tRPC types from unified-interface to avoid duplicate type definitions
 * This ensures type compatibility across the codebase
 */
export type {
  InferJwtPayloadTypeFromRoles,
  TRPCContext,
  TrpcHandlerReturnType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/trpc/types";
