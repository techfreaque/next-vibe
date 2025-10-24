import { env } from "@/config/env";
import { Environment } from "@/packages/next-vibe/shared";

if (env.NODE_ENV !== Environment.TEST) {
  void import("server-only");
}
