import { describe, expect, it } from "bun:test";

import { createImap } from "./safe-imap";

function firstError(host: string): Promise<string> {
  const imap = createImap({
    user: "probe",
    password: "probe",
    host,
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false, servername: "localhost" },
    connTimeout: 500,
    authTimeout: 500,
  });
  return new Promise<string>((resolve) => {
    imap.once("error", (error: Error) => resolve(error.message));
    imap.connect();
  });
}

describe("createImap", () => {
  it("reports a DNS failure to the caller instead of crashing", async () => {
    // A mailbox address as host: prod crashed on exactly this every ~18 min.
    expect(await firstError("hi@example.invalid")).toContain("ENOTFOUND");
  });

  it("reports a refused connection and survives the late connect timeout", async () => {
    expect(await firstError("127.0.0.1")).toContain("ECONNREFUSED");
    // node-imap's own connect timer fires after this; it must not throw.
    await new Promise((resolve) => setTimeout(resolve, 800));
  });
});
