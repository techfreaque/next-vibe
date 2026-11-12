-- Data repair: graph nodes saved before the framework moved under src/vibe/
-- reference canonical endpoint ids without the "vibe_" segment, e.g.
-- "agent_chat_data-sources_chat-downvotes-total_POST" (now
-- "vibe_agent_chat_data-sources_chat-downvotes-total_POST"). Rewrite them to
-- the current ids. The prefix list is every top-level segment that moved
-- under vibe/; none of them exists as a non-vibe canonical id, so the rewrite
-- cannot hit a live endpoint. Aliases (no method suffix) are untouched.
-- Idempotent: ids already starting with "vibe_" never match.
UPDATE "pipeline_graphs" AS g
SET "config" = jsonb_set(
  g."config",
  '{nodes}',
  (
    SELECT jsonb_object_agg(
      n.key,
      CASE
        WHEN n.value->>'endpointPath' ~ '^(agent|database|dataflow|env|execute-tool|help-tool|logger|platforms|realtime|remote-connection|tasks|tooling)_.+_(GET|POST|PUT|PATCH|DELETE)$'
          THEN jsonb_set(n.value, '{endpointPath}', to_jsonb('vibe_' || (n.value->>'endpointPath')))
        ELSE n.value
      END
    )
    FROM jsonb_each(g."config"->'nodes') AS n
  )
)
WHERE EXISTS (
  SELECT 1
  FROM jsonb_each(g."config"->'nodes') AS n
  WHERE n.value->>'endpointPath' ~ '^(agent|database|dataflow|env|execute-tool|help-tool|logger|platforms|realtime|remote-connection|tasks|tooling)_.+_(GET|POST|PUT|PATCH|DELETE)$'
);
