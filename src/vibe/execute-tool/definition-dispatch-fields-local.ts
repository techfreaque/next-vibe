/**
 * Local-only dispatch fields — the drop-in for deployments that run tools ONLY
 * here, now, inline.
 *
 * Same contract as ./definition-dispatch-fields, with both dispatch fields
 * removed:
 *   - no instanceId    (no remote-connection → nowhere else to run it)
 *   - no callbackMode  (no task system, no confirmation round-trip, no AI loop →
 *                       no other time to run it)
 *
 * These are empty FIELD MAPS, not stubs: the fields do not exist in this
 * deployment's request schema at all. That is the point. A field that is
 * advertised but silently ignored is worse than a missing one — an MCP client
 * sending callbackMode="detach" receives an inline result for a task that was
 * never created, and believes it detached.
 *
 * Note what this does and does not buy: request schemas are not strict, so a
 * stray callbackMode is stripped silently with or without this seam. The fix is
 * that the field leaves the TOOL CATALOG the model reads, and a model only sends
 * what it is offered. Removing the offer is the honest answer; honouring it is
 * impossible here.
 *
 * HOW TO USE IT: point ./definition.ts's `./definition-dispatch-fields` import at
 * this file. That ONE line is the whole switch. It pairs with the
 * repository/orchestration-local.ts seam — that one removes the BEHAVIOUR behind
 * these fields, this one removes the CONTRACT that advertises them. Swap both, or
 * neither: shipping the fields without the orchestration is the silent-lie case
 * above; shipping the orchestration without the fields is dead code.
 */

/** No remote instances, no task system → no dispatch fields. */
export const dispatchRequestFields = {} as const;

/** Nothing is ever dispatched, so there is no taskId to name, no model to steer
 *  with a hint, and no detached outcome to report. Every call returns `result`. */
export const dispatchResponseFields = {} as const;

/** No dispatch → no dispatch request examples. */
export const dispatchRequestExamples = {} as const;

/** No dispatch → no {taskId, hint} response shape to illustrate. */
export const dispatchResponseExamples = {} as const;
