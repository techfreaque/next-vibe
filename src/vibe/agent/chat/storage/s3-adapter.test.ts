import { expect, mock, test } from "bun:test";

test("attachment namespace listing bounds each page and follows continuation tokens", async () => {
  const requests: {
    maxKeys: string | null;
    delimiter: string | null;
    token: string | null;
  }[] = [];
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch(request) {
      const params = new URL(request.url).searchParams;
      const token = params.get("continuation-token");
      requests.push({
        maxKeys: params.get("max-keys"),
        delimiter: params.get("delimiter"),
        token,
      });
      const continuation =
        token === null
          ? "<IsTruncated>true</IsTruncated><NextContinuationToken>next-page</NextContinuationToken>"
          : "<IsTruncated>false</IsTruncated>";
      const thread = token === null ? "first" : "second";
      return new Response(
        `<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">${continuation}<CommonPrefixes><Prefix>chat-attachments/${thread}/</Prefix></CommonPrefixes></ListBucketResult>`,
        { headers: { "Content-Type": "application/xml" } },
      );
    },
  });
  void mock.module("../../env", () => ({
    agentEnv: {
      CHAT_STORAGE_TYPE: "s3",
      S3_ENDPOINT: server.url.origin,
      S3_REGION: "us-east-1",
      S3_BUCKET: "fixture-media",
      S3_ACCESS_KEY_ID: "fixture-access-key",
      S3_SECRET_ACCESS_KEY: "fixture-secret-key",
    },
  }));
  try {
    const { S3StorageAdapter } = await import("./s3-adapter");
    const adapter = new S3StorageAdapter();
    await expect(adapter.listThreadIds()).resolves.toEqual(["first", "second"]);
    expect(requests).toEqual([
      { maxKeys: "100", delimiter: "/", token: null },
      { maxKeys: "100", delimiter: "/", token: "next-page" },
    ]);
  } finally {
    await server.stop(true);
  }
});

test("readFileBytes returns raw bytes and metadata with a single metadata read", async () => {
  const fileBytes = new Uint8Array([0, 1, 2, 250, 251, 252, 253, 254, 255]);
  const paths: string[] = [];
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch(request) {
      const { pathname } = new URL(request.url);
      paths.push(pathname);
      if (pathname.endsWith("/.metadata/file-1.json")) {
        return Response.json({
          id: "file-1",
          filename: "file-1.mp4",
          originalFilename: "clip.mp4",
          mimeType: "video/mp4",
          size: fileBytes.byteLength,
          threadId: "thread-1",
          uploadedAt: "2026-11-25T13:30:39.000Z",
        });
      }
      if (pathname.endsWith("/thread-1/file-1.mp4")) {
        return new Response(fileBytes, {
          headers: { "Content-Type": "video/mp4" },
        });
      }
      return new Response(
        `<Error><Code>NoSuchKey</Code><Message>missing</Message></Error>`,
        { status: 404, headers: { "Content-Type": "application/xml" } },
      );
    },
  });
  void mock.module("../../env", () => ({
    agentEnv: {
      CHAT_STORAGE_TYPE: "s3",
      S3_ENDPOINT: server.url.origin,
      S3_REGION: "us-east-1",
      S3_BUCKET: "fixture-media",
      S3_ACCESS_KEY_ID: "fixture-access-key",
      S3_SECRET_ACCESS_KEY: "fixture-secret-key",
    },
  }));
  try {
    const { S3StorageAdapter } = await import("./s3-adapter");
    const adapter = new S3StorageAdapter();
    const file = await adapter.readFileBytes("file-1", "thread-1");
    expect(file?.metadata.mimeType).toBe("video/mp4");
    expect(file ? [...file.bytes] : null).toEqual([...fileBytes]);
    expect(
      paths.filter((p) => p.includes("/.metadata/")).length,
    ).toBe(1);
    await expect(
      adapter.readFileAsBase64("file-1", "thread-1"),
    ).resolves.toBe(Buffer.from(fileBytes).toString("base64"));
    await expect(
      adapter.readFileBytes("missing", "thread-1"),
    ).resolves.toBeNull();
  } finally {
    await server.stop(true);
  }
});

test("HTTP media reads send a ranged GetObject and use HeadObject for bodyless responses", async () => {
  const fileBytes = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const requests: { method: string; range: string | null }[] = [];
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch(request) {
      const range = request.headers.get("Range");
      requests.push({ method: request.method, range });
      if (request.method === "HEAD") {
        return new Response(null, {
          headers: { "Content-Length": String(fileBytes.length) },
        });
      }
      if (range === "bytes=4-8") {
        return new Response(fileBytes.subarray(4), {
          status: 206,
          headers: {
            "Content-Range": "bytes 4-8/9",
            "Content-Length": "5",
          },
        });
      }
      return new Response(fileBytes, {
        headers: { "Content-Length": String(fileBytes.length) },
      });
    },
  });
  void mock.module("../../env", () => ({
    agentEnv: {
      CHAT_STORAGE_TYPE: "s3",
      S3_ENDPOINT: server.url.origin,
      S3_REGION: "us-east-1",
      S3_BUCKET: "fixture-media",
      S3_ACCESS_KEY_ID: "fixture-access-key",
      S3_SECRET_ACCESS_KEY: "fixture-secret-key",
    },
  }));
  try {
    const { serveStoredFile } = await import("./file-response");
    const source = {
      threadId: "thread-1",
      filename: "file-1.mp4",
      contentType: "video/mp4",
    };
    const url = "http://localhost/video";
    const rangeResponse = await serveStoredFile(
      source,
      new Request(url, { headers: { Range: "bytes=4-" } }),
      {},
    );
    expect(rangeResponse?.status).toBe(206);
    expect(rangeResponse?.headers.get("Content-Length")).toBe("5");
    expect(rangeResponse?.headers.get("Content-Range")).toBe("bytes 4-8/9");
    expect(await rangeResponse?.bytes()).toEqual(fileBytes.subarray(4));

    const head = await serveStoredFile(source, new Request(url, { method: "HEAD" }), {});
    expect(head?.headers.get("Content-Length")).toBe("9");
    expect(head?.body).toBeNull();
    const unsatisfiable = await serveStoredFile(
      source,
      new Request(url, { headers: { Range: "bytes=9-" } }),
      {},
    );
    expect(unsatisfiable?.status).toBe(416);
    expect(unsatisfiable?.headers.get("Content-Range")).toBe("bytes */9");
    expect(unsatisfiable?.body).toBeNull();

    expect(requests).toEqual([
      { method: "HEAD", range: null },
      { method: "GET", range: "bytes=4-8" },
      { method: "HEAD", range: null },
      { method: "HEAD", range: null },
    ]);
  } finally {
    await server.stop(true);
  }
});
