import { describe, expect, it } from "vitest";

import { isPrivateAddress } from "./ssrf-guard";

describe("isPrivateAddress", () => {
  it.each([
    "localhost",
    "api.localhost",
    "127.0.0.1",
    "0.0.0.0",
    "10.1.2.3",
    "100.64.0.1",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "169.254.169.254",
    "::1",
    "[::1]",
    "::ffff:127.0.0.1",
    "fc00::1",
    "fd12:3456::1",
    "fe80::1",
  ])("blocks %s", (host) => {
    expect(isPrivateAddress(host)).toBe(true);
  });

  it.each([
    "example.com",
    "8.8.8.8",
    "172.32.0.1",
    "100.128.0.1",
    "::ffff:8.8.8.8",
    "2606:4700::1111",
  ])("allows %s", (host) => {
    expect(isPrivateAddress(host)).toBe(false);
  });
});
