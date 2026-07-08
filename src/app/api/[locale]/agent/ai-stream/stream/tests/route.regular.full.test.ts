/**
 * AI Stream Integration — Regular, FULL.
 *
 * The complete suite: every case including real media generation (image/music/
 * video/attachments), replayed from fetch-cache fixtures on normal runs (live
 * only on first record). No case skipped, no hacks.
 */

import "server-only";

import { describeStreamSuite } from "./route-base.test";

describeStreamSuite({
  label: "AI Stream Integration - Regular (full)",
  cachePrefix: "",
  cheapMode: false,
});
