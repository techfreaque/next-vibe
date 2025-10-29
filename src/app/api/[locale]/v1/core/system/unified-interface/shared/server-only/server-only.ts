import { Environment } from "next-vibe/shared/utils/env-util";

import { env } from "@/config/env";

if (env.NODE_ENV !== Environment.TEST) {
  void import("server-only");
}
