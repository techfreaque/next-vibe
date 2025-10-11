import { Environment } from "../../shared/utils";
import { env } from "../env";

if (env.NODE_ENV !== Environment.TEST) {
  void import("server-only");
}
