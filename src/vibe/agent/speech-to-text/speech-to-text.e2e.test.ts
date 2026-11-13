/**
 * E2E: speech-to-text tool page — real browser against the running server.
 * Provider calls record once into src/generated/ai-fixtures/http-cache/e2e-vibe-agent-speech-to-text-<test>/
 * and replay on every later run (delete the folder to re-record).
 *
 * Transcription needs OPENAI_API_KEY, EDEN_AI_API_KEY or DEEPGRAM_API_KEY (or
 * a system inference provider). Without one the page must say exactly that —
 * the upload test asserts whichever the server under test can do.
 *
 * The file is attached straight to the field's input: `fileUpload.files` is a
 * File[] and form.fill()'s file driver only takes a single File.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { createE2ECreditUser } from "../ai-stream/testing/e2e-credit-user";
import { getEnvAvailability } from "../env-availability";
import { DEFAULT_STT_MODEL_SELECTION } from "./constants";
import speechToTextEndpoints from "./definition";
import { scopedTranslation } from "./i18n";
import { getBestSttModel } from "./models";

const endpoint = speechToTextEndpoints.POST;
const FILE_FIELD = "fileUpload.files";

/** 0.5s 8kHz mono 16-bit PCM WAV of a 440Hz tone — a real, playable file. */
function toneWav(): Buffer {
  const sampleRate = 8000;
  const samples = sampleRate / 2;
  const dataBytes = samples * 2;
  const wav = Buffer.alloc(44 + dataBytes);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + dataBytes, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); // PCM
  wav.writeUInt16LE(1, 22); // mono
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(dataBytes, 40);
  for (let i = 0; i < samples; i++) {
    wav.writeInt16LE(Math.round(Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 8000), 44 + i * 2);
  }
  return wav;
}

describe("E2E: speech to text", () => {
  const e2e = useE2E("vibe/agent/speech-to-text", { fixtures: true });
  const { t } = scopedTranslation.scopedT(defaultLocale);

  e2e.it("transcribes an uploaded recording, or says which provider key is missing", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("stt", 50);
    cleanup(buyer.remove);
    await loginAs(buyer.user);
    const model = getBestSttModel(DEFAULT_STT_MODEL_SELECTION, buyer.user, await getEnvAvailability());

    const form = await open(endpoint);
    await form
      .field(FILE_FIELD)
      .locator('input[type="file"]')
      .setInputFiles({ name: "tone.wav", mimeType: "audio/wav", buffer: toneWav() });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;

    if (model) {
      expect(result.response.success, JSON.stringify(result.response)).toBe(true);
      return;
    }

    // No STT provider on this server: a clear setup message
    expect(result.response.success).toBe(false);
    await form.alert.waitFor({ state: "visible" });
    expect(await form.alert.textContent()).toContain(
      t("post.errors.noSttProviderConfigured"),
    );
  });

  e2e.it("rejects a file that is not audio before uploading it", async ({ open }) => {
    const form = await open(endpoint);
    await form
      .field(FILE_FIELD)
      .locator('input[type="file"]')
      .setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("not audio") });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(result.fieldErrors[FILE_FIELD]).toBe(t("post.audio.validation.audioOnly"));
  });
});
