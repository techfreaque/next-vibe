/**
 * AI Stream Integration — Regular (CHEAP) + LIVE hermes thread mirror.
 *
 * Identical to route.regular.cheap (same cases, same "cheap-" fixture
 * contexts — nothing is re-recorded) but with atlas ↔ hermes CONNECTED and
 * thread/chat sync enabled. On top of every regular assertion, every stream
 * must mirror to hermes: the thread (with its streamed chunks relayed as
 * remote events) lands at REMOTE/atlas/tests/cheap on the hermes DB while the
 * local copy stays at private/tests/cheap — folder structure asserted on BOTH
 * sides after every case.
 */

import "server-only";

import {
  connectToHermes,
  disconnectFromHermes,
  failSuitePrerequisites,
  isHermesInFixtureMode,
  resolveRemoteUrlSync,
} from "../../testing/remote-setup";
import { describeStreamSuite } from "./route-base.test";

const _remoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

if (_remoteUrl && _isFixtureMode) {
  describeStreamSuite({
    label: "AI Stream Integration - Regular (cheap) + hermes thread mirror",
    // SAME prefix as route.regular.cheap: identical fixture contexts, no new
    // recordings — the mirror rides the events, not the model traffic.
    cachePrefix: "cheap-",
    cheapMode: true,
    // Full connect (both sides, remoteUserId, syncScope threads/chat) so the
    // live mirror + pull-on-connect reconcile are active for the whole suite.
    setup: async (testUser) => {
      await connectToHermes(testUser);
    },
    teardown: async (testUser) => {
      await disconnectFromHermes(testUser.id);
    },
    assertMirrorOnHermes: true,
  });
} else if (!_remoteUrl) {
  failSuitePrerequisites(
    "regular mirror (cheap)",
    "hermes not running — start: vibe --hermes dev --fixture-mode",
  );
} else {
  failSuitePrerequisites(
    "regular mirror (cheap)",
    "hermes not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
}
