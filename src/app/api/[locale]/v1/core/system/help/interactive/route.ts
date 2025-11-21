import { createRouteHandlers } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/create-handlers";
import definitions from "./definition";

export const { POST, tools } = createRouteHandlers(definitions);
