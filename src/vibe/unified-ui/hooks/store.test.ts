import { expect, it } from "bun:test";
import { z } from "zod";

import { deserializeQueryParams } from "./store";

it("leaves JSON-shaped form text intact while restoring serialized filters", () => {
  const schema = z.object({
    query: z.string().min(1),
    filter: z.object({ status: z.string() }),
  });
  const query = '{"kind":"message"}';
  const request = deserializeQueryParams(
    { query, filter: '{"status":"open"}' },
    schema,
  );
  expect(schema.parse(request)).toEqual({ query, filter: { status: "open" } });
});
