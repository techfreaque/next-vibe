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
