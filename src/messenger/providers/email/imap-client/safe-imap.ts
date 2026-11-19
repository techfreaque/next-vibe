/**
 * Crash-safe node-imap construction.
 *
 * With `tls: true`, node-imap wraps a bare net.Socket in tls.connect() and only
 * listens for errors on the TLS wrapper. Under Bun, connect failures
 * (getaddrinfo ENOTFOUND, ECONNREFUSED) are emitted on the bare socket, so the
 * 'error' event has no listener and takes the whole server process down.
 * Prod crashed every ~18 minutes from a signup bounce sync pointed at an
 * invalid IMAP host before this existed.
 *
 * createImap() hands node-imap our own socket, forwards its errors to the Imap
 * instance (where callers listen), and keeps one permanent Imap error listener
 * so the follow-up errors node-imap fires after a failed connect (its connect
 * timer, socket close) cannot become uncaught exceptions once the caller's
 * `once("error")` listener is spent. Callers still receive the first error.
 */

import "server-only";

import { Socket } from "node:net";

import Imap from "imap";

export function createImap(config: Imap.Config): Imap {
  const socket = new Socket();
  const options = { ...config, socket };
  const imap = new Imap(options);
  let forwarded = false;
  socket.on("error", (error: Error) => {
    // Without TLS the bare socket is node-imap's own socket and it already
    // listens. With TLS, forward the first connect error so the caller's
    // promise settles instead of waiting for the connect timeout.
    if (!config.tls || forwarded) {
      return;
    }
    forwarded = true;
    imap.emit("error", error);
  });
  // Follow-up errors of an already failed or ended connection. The first
  // error always reaches the caller's own listener.
  imap.on("error", () => undefined);
  return imap;
}
