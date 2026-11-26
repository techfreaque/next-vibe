import "server-only";

import { sign } from "node:crypto";

const apiOrigin = "https://api.enablebanking.com";
export type BankTransport = (url: URL, init: RequestInit) => Promise<Response>;

const encode = (claims: Record<string, string | number>): string =>
  Buffer.from(JSON.stringify(claims)).toString("base64url");

function authorization(appId: string, privateKey: string): string {
  const issued = Math.floor(Date.now() / 1000);
  const signed = `${encode({ typ: "JWT", alg: "RS256", kid: appId })}.${encode({
    iss: "enablebanking.com",
    aud: "api.enablebanking.com",
    iat: issued,
    exp: issued + 300,
  })}`;
  return `Bearer ${signed}.${sign(
    "RSA-SHA256",
    Buffer.from(signed),
    privateKey.replaceAll("\\n", "\n"),
  ).toString("base64url")}`;
}

/** Sign requests to the one registered upstream, including during a local synthetic replay. */
export function createEnableBankingTransport(
  appId: string,
  privateKey: string,
  transport: BankTransport,
): (path: string, init: RequestInit) => Promise<Response> {
  return async (path, init) => {
    const url = URL.parse(path, apiOrigin);
    if (
      !url ||
      url.origin !== apiOrigin ||
      url.username ||
      url.password ||
      url.hash
    ) {
      return new Response(null, { status: 400 });
    }
    const allowed =
      init.method === "GET"
        ? url.pathname === "/application" ||
          url.pathname === "/aspsps" ||
          /^\/accounts\/[a-f0-9-]{36}\/transactions$/iu.test(url.pathname)
        : init.method === "POST" &&
          (url.pathname === "/auth" || url.pathname === "/sessions");
    if (!allowed) {
      return new Response(null, { status: 400 });
    }
    try {
      const headers = new Headers(init.headers);
      headers.set("authorization", authorization(appId, privateKey));
      headers.set("accept", "application/json");
      return await transport(url, {
        ...init,
        headers,
        redirect: "error",
        signal: init.signal ?? AbortSignal.timeout(15000),
      });
    } catch {
      return new Response(null, { status: 503 });
    }
  };
}
