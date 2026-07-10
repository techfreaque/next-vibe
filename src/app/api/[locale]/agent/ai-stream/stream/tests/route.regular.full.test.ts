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
  // A NON-EMPTY cachePrefix is required: the fixture engine treats an empty
  // prefix as "not a fixture run" (readAndBumpFixture's `!row.prefix` guard),
  // so `cachePrefix: ""` silently disabled record/replay for this whole suite
  // — every call went live and nothing was stored. Its own folder (distinct
  // from cheap's "cheap") keeps the two suites' ordinal sequences separate.
  label: "AI Stream Integration - Regular (full)",
  cachePrefix: "regular",
  cheapMode: false,
});
