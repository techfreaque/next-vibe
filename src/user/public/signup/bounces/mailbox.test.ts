import { expect, it } from "bun:test";

import { signupMailboxConfigs } from "./mailbox";

it("skips a mailbox address used as a host without borrowing its credentials", () => {
  const invalid: string[] = [];
  const matches = signupMailboxConfigs(
    [
      {
        source: "legacy",
        host: "sender@example.test",
        username: "legacy@example.test",
        password: "legacy-fixture",
      },
      {
        source: "incomplete",
        host: "imap.example.test",
        username: "sender@example.test",
        password: undefined,
      },
      {
        source: "smtp",
        host: "mail.example.test",
        username: "sender@example.test",
        password: "smtp-fixture",
      },
    ],
    (source) => invalid.push(source),
  );
  expect(invalid).toEqual(["legacy"]);
  expect(matches).toEqual([
    {
      host: "mail.example.test",
      port: 993,
      secure: true,
      username: "sender@example.test",
      password: "smtp-fixture",
    },
  ]);
});

it("preserves different credentials for a mail host and avoids duplicate logins", () => {
  const stored = {
    source: "row",
    host: "mail.example.test",
    username: "sender@example.test",
    password: "stored-fixture",
  };
  const matches = signupMailboxConfigs(
    [
      stored,
      { ...stored, source: "env" },
      { ...stored, source: "smtp", password: "current-fixture" },
      { ...stored, source: "plaintext", port: 143, secure: false },
    ],
    () => undefined,
  );
  expect(matches.map((config) => config.password)).toEqual([
    "stored-fixture",
    "current-fixture",
  ]);
});
