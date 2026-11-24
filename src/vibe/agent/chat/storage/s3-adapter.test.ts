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
