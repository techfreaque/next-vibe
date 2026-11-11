# Backward-compatible migrations for rolling deploys

During a rolling deploy there is a window where the OLD app (on the not-yet-rolled
node) runs against the NEW schema. Migrations MUST be **expand-then-contract** so
that window is safe:

1. **Expand (this release):** only ADDITIVE, backward-compatible DDL —
   - add nullable columns / columns with defaults,
   - add new tables,
   - add indexes `CONCURRENTLY`,
   - backfill in a way the old code tolerates.
     The old app must keep working with the expanded schema untouched.

2. **Contract (a LATER release, after both nodes run the new code):**
   - drop old columns/tables,
   - add NOT NULL / tighten constraints,
   - remove compatibility shims.

Never combine a destructive change with the code that stops using it in the same
release. `vibe dgen` generates the migration; review it against this rule before
shipping. A migration that renames or drops a column in-use by the old app will
break the still-live node mid-roll.

Logical replication note: the Server 2 replica applies the same DDL via the
schema (new tables need the publication's `FOR ALL TABLES` to pick them up — it
does automatically — and the subscriber needs the table to exist, so run
`schema-sync` / let migrations run on the replica DB before the subscription
copies). For a new table mid-release, run the migration on BOTH the primary and
the replica `unbottled` DB.
