/**
 * AI Stream Integration — Regular, CHEAP.
 *
 * Same suite as route.regular.full but with cheapMode: media-gen steps swap to
 * cheap cortex/tool-help equivalents producing the same observable thread shape.
 * Every callback mode and folder assertion still runs — no case is skipped.
 * Run this first for the fastest full-coverage signal.
 */

import "server-only";

import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { describeStreamSuite } from "./route-base.test";

describeStreamSuite({
  label: "AI Stream Integration - Regular (cheap)",
  cachePrefix: "cheap-",
  cheapMode: true,
});
