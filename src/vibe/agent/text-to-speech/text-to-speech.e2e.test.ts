/**
 * E2E: text-to-speech tool page — real browser against the running server.
 * Provider calls record once into src/generated/ai-fixtures/http-cache/e2e-vibe-agent-text-to-speech-<test>/
 * and replay on every later run (delete the folder to re-record).
 *
 * Voices need OPENAI_API_KEY, EDEN_AI_API_KEY or ELEVENLABS_API_KEY (or a
 * system inference provider). Without one the page must say exactly that —
 * the speaking test asserts whichever the server under test can do.
 */

import { describe, expect } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { createE2ECreditUser } from "../ai-stream/testing/e2e-credit-user";
import { getEnvAvailability } from "../env-availability";
import { ModelSelectionType } from "../skills/enum";
import { DEFAULT_TTS_VOICE_ID } from "./constants";
import textToSpeechEndpoints from "./definition";
import { scopedTranslation } from "./i18n";
import { getBestTtsModel } from "./models";

const endpoint = textToSpeechEndpoints.POST;

describe("E2E: text to speech", () => {
  const e2e = useE2E("vibe/agent/text-to-speech", { fixtures: true });
  const { t } = scopedTranslation.scopedT(defaultLocale);

  e2e.it("speaks the text, or says which provider key is missing", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("tts", 50);
    cleanup(buyer.remove);
    await loginAs(buyer.user);
    const voice = getBestTtsModel(
      { selectionType: ModelSelectionType.MANUAL, manualModelId: DEFAULT_TTS_VOICE_ID },
      buyer.user,
      await getEnvAvailability(),
    );

    const form = await open(endpoint);
    await form.fill({ text: "Hi." });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;

    if (voice) {
      expect(result.response.success, JSON.stringify(result.response)).toBe(true);
      if (!result.response.success) return;
      expect(result.response.data.audioUrl.length).toBeGreaterThan(0);
      return;
    }

    // No voice provider on this server: a clear setup message, not "Not Found"
    expect(result.response.success).toBe(false);
    await form.alert.waitFor({ state: "visible" });
    expect(await form.alert.textContent()).toContain(
      t("post.errors.noTtsProviderConfigured"),
    );
  });

  e2e.it("blocks an empty text before sending", async ({ open }) => {
    const form = await open(endpoint);

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["text"]);
  });
});
