// Testing infrastructure - messages are for test debugging, not end users

/**
 * Submit an endpoint form whose response can legitimately take longer than
 * the harness's 20s submit window — media generation (image/music/video)
 * while RECORDING fixtures. Replays answer in well under a second; this only
 * stretches the wait, it never retries (a paid call fires exactly once).
 *
 * Note: Playwright's route.fetch caps a single proxied request at 30s, so a
 * recording longer than that still completes server-side (the fixture files
 * are written) but this call times out; the next run replays.
 */

import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import type {
  E2ESubmitSent,
  EndpointForm,
} from "../../../tooling/testing/e2e/endpoint-form";

const POLL_MS = 100;

export async function submitAndAwaitResponse<
  TEndpoint extends CreateApiEndpointAny,
>(
  form: EndpointForm<TEndpoint>,
  timeoutMs: number,
): Promise<E2ESubmitSent<TEndpoint>> {
  const before = form.calls.length;
  await form.submitButton.click();
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const call = form.calls[before];
    if (call) {
      return call;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, POLL_MS);
    });
  }
  // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
  throw new Error(
    `[e2e] ${form.endpointId}: no response within ${timeoutMs}ms (recording a slow generation? the next run replays)`,
  );
}
