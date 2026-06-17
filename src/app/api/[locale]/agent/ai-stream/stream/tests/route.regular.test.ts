import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { describeStreamSuite } from "./route-base.test";

describeStreamSuite({
  label: "AI Stream Integration - Regular",
  cachePrefix: "",
});
