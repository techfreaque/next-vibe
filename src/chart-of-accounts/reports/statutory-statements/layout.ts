/**
 * Slovak micro entity statements (Úč MÚJ): súvaha and výkaz ziskov a strát.
 *
 * Row numbers, markers and account designations follow the Úč MÚJ template
 * (opatrenie MF/15464/2013-74 as amended by MF/18008/2014-74), as published by
 * the Register účtovných závierok (registeruz.sk template 687, valid from
 * 2014-01-01). Pure mapping from synthetic account balances to lines, so it is
 * testable without a database.
 *
 * Simplifications (documented for the adviser review):
 * - Maturity analytics ("A" accounts) are not tracked, so receivables and
 *   payables count as short-term, bank deposits as current (r. 22), provisions
 *   as short-term (r. 43) and 47x as long-term (r. 35).
 * - Bilateral settlement accounts (31x-37x, 395/398) are netted per synthetic
 *   account; a debit balance is a receivable, a credit balance a liability.
 * - 042/052 assets under construction are shown on r. 07.
 * - Unclosed revenue and expense accounts plus 431 form r. 33.
 */

/** Line amounts are integers in 1/10000 of the report currency. */
export interface LedgerAccountBalance {
  code: string;
  name: string;
  type: string;
  /** Debit minus credit. */
  units: number;
}

export interface StatementPeriodInput {
  /** Cumulative balances as of the balance sheet date. */
  balances: readonly LedgerAccountBalance[];
  /** Movements within the period, without period-closing entries. */
  movements: readonly LedgerAccountBalance[];
}

export type StatementLineKind = "total" | "group" | "item";

export const BALANCE_SHEET_LINE_IDS = [
  "bs01",
  "bs02",
  "bs03",
  "bs04",
  "bs05",
  "bs06",
  "bs07",
  "bs08",
  "bs09",
  "bs10",
  "bs11",
  "bs12",
  "bs13",
  "bs14",
  "bs15",
  "bs16",
  "bs17",
  "bs18",
  "bs19",
  "bs20",
  "bs21",
  "bs22",
  "bs23",
  "bs24",
  "bs25",
  "bs26",
  "bs27",
  "bs28",
  "bs29",
  "bs30",
  "bs31",
  "bs32",
  "bs33",
  "bs34",
  "bs35",
  "bs36",
  "bs37",
  "bs38",
  "bs39",
  "bs40",
  "bs41",
  "bs42",
  "bs43",
  "bs44",
  "bs45",
] as const;

export const PROFIT_LOSS_LINE_IDS = [
  "pl01",
  "pl02",
  "pl03",
  "pl04",
  "pl05",
  "pl06",
  "pl07",
  "pl08",
  "pl09",
  "pl10",
  "pl11",
  "pl12",
  "pl13",
  "pl14",
  "pl15",
  "pl16",
  "pl17",
  "pl18",
  "pl19",
  "pl20",
  "pl21",
  "pl22",
  "pl23",
  "pl24",
  "pl25",
  "pl26",
  "pl27",
  "pl28",
  "pl29",
  "pl30",
  "pl31",
  "pl32",
  "pl33",
  "pl34",
  "pl35",
  "pl36",
  "pl37",
  "pl38",
] as const;

export type BalanceSheetLineId = (typeof BALANCE_SHEET_LINE_IDS)[number];
export type ProfitLossLineId = (typeof PROFIT_LOSS_LINE_IDS)[number];
export type StatementLineId = BalanceSheetLineId | ProfitLossLineId;

interface LineDef<TId extends StatementLineId> {
  id: TId;
  marker: string;
  kind: StatementLineKind;
  /** Sum of other lines (subtracted ids are prefixed in `minus`). */
  plus?: readonly TId[];
  minus?: readonly TId[];
}

const BALANCE_SHEET: readonly LineDef<BalanceSheetLineId>[] = [
  { id: "bs01", marker: "", kind: "total", plus: ["bs02", "bs14"] },
  {
    id: "bs02",
    marker: "A.",
    kind: "group",
    plus: ["bs03", "bs04", "bs09"],
  },
  { id: "bs03", marker: "A.I.", kind: "group" },
  {
    id: "bs04",
    marker: "A.II.",
    kind: "group",
    plus: ["bs05", "bs06", "bs07", "bs08"],
  },
  { id: "bs05", marker: "A.II.1.", kind: "item" },
  { id: "bs06", marker: "2.", kind: "item" },
  { id: "bs07", marker: "3.", kind: "item" },
  { id: "bs08", marker: "4.", kind: "item" },
  {
    id: "bs09",
    marker: "A.III.",
    kind: "group",
    plus: ["bs10", "bs11", "bs12", "bs13"],
  },
  { id: "bs10", marker: "A.III.1.", kind: "item" },
  { id: "bs11", marker: "2.", kind: "item" },
  { id: "bs12", marker: "3.", kind: "item" },
  { id: "bs13", marker: "4.", kind: "item" },
  {
    id: "bs14",
    marker: "B.",
    kind: "group",
    plus: ["bs15", "bs16", "bs17", "bs21"],
  },
  { id: "bs15", marker: "B.I.", kind: "group" },
  { id: "bs16", marker: "B.II.", kind: "group" },
  {
    id: "bs17",
    marker: "B.III.",
    kind: "group",
    plus: ["bs18", "bs19", "bs20"],
  },
  { id: "bs18", marker: "B.III.1.", kind: "item" },
  { id: "bs19", marker: "2.", kind: "item" },
  { id: "bs20", marker: "3.", kind: "item" },
  { id: "bs21", marker: "B.IV.", kind: "group", plus: ["bs22", "bs23"] },
  { id: "bs22", marker: "B.IV.1.", kind: "item" },
  { id: "bs23", marker: "2.", kind: "item" },
  { id: "bs24", marker: "", kind: "total", plus: ["bs25", "bs34"] },
  {
    id: "bs25",
    marker: "A.",
    kind: "group",
    plus: ["bs26", "bs29", "bs30", "bs31", "bs32", "bs33"],
  },
  { id: "bs26", marker: "A.I.", kind: "group", plus: ["bs27", "bs28"] },
  { id: "bs27", marker: "A.I.1.", kind: "item" },
  { id: "bs28", marker: "2.", kind: "item" },
  { id: "bs29", marker: "A.II.", kind: "group" },
  { id: "bs30", marker: "A.III.", kind: "group" },
  { id: "bs31", marker: "A.IV.", kind: "group" },
  { id: "bs32", marker: "A.V.", kind: "group" },
  { id: "bs33", marker: "A.VI.", kind: "group" },
  {
    id: "bs34",
    marker: "B.",
    kind: "group",
    plus: ["bs35", "bs36", "bs37", "bs38", "bs43", "bs44", "bs45"],
  },
  { id: "bs35", marker: "B.I.", kind: "group" },
  { id: "bs36", marker: "B.II.", kind: "group" },
  { id: "bs37", marker: "B.III.", kind: "group" },
  {
    id: "bs38",
    marker: "B.IV.",
    kind: "group",
    plus: ["bs39", "bs40", "bs41", "bs42"],
  },
  { id: "bs39", marker: "B.IV.1.", kind: "item" },
  { id: "bs40", marker: "2.", kind: "item" },
  { id: "bs41", marker: "3.", kind: "item" },
  { id: "bs42", marker: "4.", kind: "item" },
  { id: "bs43", marker: "B.V.", kind: "group" },
  { id: "bs44", marker: "B.VI.", kind: "group" },
  { id: "bs45", marker: "B.VII.", kind: "group" },
];

const PROFIT_LOSS: readonly LineDef<ProfitLossLineId>[] = [
  {
    id: "pl01",
    marker: "*",
    kind: "total",
    plus: ["pl02", "pl03", "pl04", "pl05", "pl06", "pl07"],
  },
  { id: "pl02", marker: "I.", kind: "item" },
  { id: "pl03", marker: "II.", kind: "item" },
  { id: "pl04", marker: "III.", kind: "item" },
  { id: "pl05", marker: "IV.", kind: "item" },
  { id: "pl06", marker: "V.", kind: "item" },
  { id: "pl07", marker: "VI.", kind: "item" },
  {
    id: "pl08",
    marker: "*",
    kind: "total",
    plus: [
      "pl09",
      "pl10",
      "pl11",
      "pl12",
      "pl13",
      "pl14",
      "pl15",
      "pl16",
      "pl17",
    ],
  },
  { id: "pl09", marker: "A.", kind: "item" },
  { id: "pl10", marker: "B.", kind: "item" },
  { id: "pl11", marker: "C.", kind: "item" },
  { id: "pl12", marker: "D.", kind: "item" },
  { id: "pl13", marker: "E.", kind: "item" },
  { id: "pl14", marker: "F.", kind: "item" },
  { id: "pl15", marker: "G.", kind: "item" },
  { id: "pl16", marker: "H.", kind: "item" },
  { id: "pl17", marker: "I.", kind: "item" },
  {
    id: "pl18",
    marker: "**",
    kind: "total",
    plus: ["pl01"],
    minus: ["pl08"],
  },
  {
    id: "pl19",
    marker: "*",
    kind: "group",
    plus: ["pl02", "pl03", "pl04", "pl05"],
    minus: ["pl09", "pl10", "pl11"],
  },
  {
    id: "pl20",
    marker: "*",
    kind: "total",
    plus: ["pl21", "pl22", "pl23", "pl24", "pl25", "pl26"],
  },
  { id: "pl21", marker: "VII.", kind: "item" },
  { id: "pl22", marker: "VIII.", kind: "item" },
  { id: "pl23", marker: "IX.", kind: "item" },
  { id: "pl24", marker: "X.", kind: "item" },
  { id: "pl25", marker: "XI.", kind: "item" },
  { id: "pl26", marker: "XII.", kind: "item" },
  {
    id: "pl27",
    marker: "*",
    kind: "total",
    plus: ["pl28", "pl29", "pl30", "pl31", "pl32", "pl33"],
  },
  { id: "pl28", marker: "J.", kind: "item" },
  { id: "pl29", marker: "K.", kind: "item" },
  { id: "pl30", marker: "L.", kind: "item" },
  { id: "pl31", marker: "M.", kind: "item" },
  { id: "pl32", marker: "N.", kind: "item" },
  { id: "pl33", marker: "O.", kind: "item" },
  {
    id: "pl34",
    marker: "**",
    kind: "total",
    plus: ["pl20"],
    minus: ["pl27"],
  },
  {
    id: "pl35",
    marker: "**",
    kind: "total",
    plus: ["pl18", "pl34"],
  },
  { id: "pl36", marker: "P.", kind: "item" },
  { id: "pl37", marker: "Q.", kind: "item" },
  {
    id: "pl38",
    marker: "***",
    kind: "total",
    plus: ["pl35"],
    minus: ["pl36", "pl37"],
  },
];

type BalanceRule =
  | {
      prefixes: readonly string[];
      /** Asset side shows debit balances, pasíva shows credit balances. */
      side: "assets" | "liabilities";
      line: BalanceSheetLineId;
    }
  | {
      prefixes: readonly string[];
      side: "bilateral";
      debit: BalanceSheetLineId;
      credit: BalanceSheetLineId;
    };

/** Ordered: exact synthetic accounts before account groups. */
const BALANCE_RULES: readonly BalanceRule[] = [
  { prefixes: ["353"], side: "liabilities", line: "bs28" },
  { prefixes: ["323"], side: "liabilities", line: "bs43" },
  { prefixes: ["391"], side: "assets", line: "bs18" },
  { prefixes: ["381", "382", "385"], side: "assets", line: "bs20" },
  { prefixes: ["383", "384"], side: "liabilities", line: "bs42" },
  {
    prefixes: ["041", "051", "091", "093", "01", "07"],
    side: "assets",
    line: "bs03",
  },
  { prefixes: ["021", "031", "081"], side: "assets", line: "bs05" },
  { prefixes: ["022", "082"], side: "assets", line: "bs06" },
  {
    prefixes: [
      "025",
      "026",
      "029",
      "032",
      "042",
      "052",
      "085",
      "086",
      "089",
      "092",
      "094",
      "095",
    ],
    side: "assets",
    line: "bs07",
  },
  { prefixes: ["097", "098"], side: "assets", line: "bs08" },
  {
    prefixes: ["061", "062", "063", "043", "053"],
    side: "assets",
    line: "bs10",
  },
  {
    prefixes: ["065", "066", "067", "069", "096"],
    side: "assets",
    line: "bs11",
  },
  { prefixes: ["11", "12", "13", "19"], side: "assets", line: "bs15" },
  { prefixes: ["21", "22", "26"], side: "assets", line: "bs22" },
  { prefixes: ["25", "29"], side: "assets", line: "bs23" },
  { prefixes: ["23"], side: "liabilities", line: "bs44" },
  { prefixes: ["24"], side: "liabilities", line: "bs45" },
  {
    prefixes: ["31", "321", "322", "324", "325", "326"],
    side: "bilateral",
    debit: "bs18",
    credit: "bs39",
  },
  {
    prefixes: ["331", "333", "335"],
    side: "bilateral",
    debit: "bs20",
    credit: "bs40",
  },
  { prefixes: ["336"], side: "bilateral", debit: "bs19", credit: "bs40" },
  { prefixes: ["34"], side: "bilateral", debit: "bs19", credit: "bs41" },
  {
    prefixes: ["35", "36", "37", "395", "398"],
    side: "bilateral",
    debit: "bs20",
    credit: "bs42",
  },
  { prefixes: ["411", "419", "491"], side: "liabilities", line: "bs27" },
  {
    prefixes: ["412", "413", "417", "418"],
    side: "liabilities",
    line: "bs29",
  },
  {
    prefixes: ["421", "422", "423", "427"],
    side: "liabilities",
    line: "bs30",
  },
  { prefixes: ["414", "415", "416"], side: "liabilities", line: "bs31" },
  { prefixes: ["428", "429"], side: "liabilities", line: "bs32" },
  { prefixes: ["431"], side: "liabilities", line: "bs33" },
  { prefixes: ["45"], side: "liabilities", line: "bs43" },
  { prefixes: ["46"], side: "liabilities", line: "bs37" },
  { prefixes: ["47"], side: "liabilities", line: "bs35" },
];

interface ProfitLossRule {
  prefixes: readonly string[];
  side: "revenue" | "expense";
  line: ProfitLossLineId;
}

const PROFIT_LOSS_RULES: readonly ProfitLossRule[] = [
  { prefixes: ["604", "607"], side: "revenue", line: "pl02" },
  { prefixes: ["601", "602", "606"], side: "revenue", line: "pl03" },
  { prefixes: ["61"], side: "revenue", line: "pl04" },
  { prefixes: ["62"], side: "revenue", line: "pl05" },
  { prefixes: ["641", "642"], side: "revenue", line: "pl06" },
  {
    prefixes: ["644", "645", "646", "648", "655", "657"],
    side: "revenue",
    line: "pl07",
  },
  { prefixes: ["661"], side: "revenue", line: "pl21" },
  { prefixes: ["665"], side: "revenue", line: "pl22" },
  { prefixes: ["666"], side: "revenue", line: "pl23" },
  { prefixes: ["662"], side: "revenue", line: "pl24" },
  { prefixes: ["663"], side: "revenue", line: "pl25" },
  { prefixes: ["668"], side: "revenue", line: "pl26" },
  { prefixes: ["504", "505", "507"], side: "expense", line: "pl09" },
  { prefixes: ["501", "502", "503"], side: "expense", line: "pl10" },
  { prefixes: ["551", "553"], side: "expense", line: "pl14" },
  { prefixes: ["541", "542"], side: "expense", line: "pl15" },
  { prefixes: ["547"], side: "expense", line: "pl16" },
  {
    prefixes: ["543", "544", "545", "546", "548", "549", "555", "557"],
    side: "expense",
    line: "pl17",
  },
  { prefixes: ["561"], side: "expense", line: "pl28" },
  { prefixes: ["566"], side: "expense", line: "pl29" },
  { prefixes: ["565"], side: "expense", line: "pl30" },
  { prefixes: ["562"], side: "expense", line: "pl31" },
  { prefixes: ["563"], side: "expense", line: "pl32" },
  { prefixes: ["568", "569"], side: "expense", line: "pl33" },
  // 592 deferred tax is not part of the micro layout; shown with income tax.
  { prefixes: ["591", "592", "595"], side: "expense", line: "pl36" },
  { prefixes: ["596"], side: "expense", line: "pl37" },
  { prefixes: ["51"], side: "expense", line: "pl11" },
  { prefixes: ["52"], side: "expense", line: "pl12" },
  { prefixes: ["53"], side: "expense", line: "pl13" },
];

const RESULT_TYPES = new Set(["REVENUE", "EXPENSE"]);

/** Synthetic three-digit account of a code ("343.1" -> "343"), if numeric. */
export function syntheticAccount(code: string): string | undefined {
  const synthetic = code.trim().split(".")[0] ?? "";
  return /^\d{3}$/.test(synthetic) ? synthetic : undefined;
}

function findRule<TRule extends { prefixes: readonly string[] }>(
  rules: readonly TRule[],
  synthetic: string,
): TRule | undefined {
  return rules.find((rule) =>
    rule.prefixes.some((prefix) => synthetic.startsWith(prefix)),
  );
}

export interface StatementLineValue<TId extends StatementLineId> {
  id: TId;
  row: number;
  marker: string;
  kind: StatementLineKind;
  current: number;
  previous: number;
}

export interface UnmappedAccount {
  code: string;
  name: string;
  statement: "balanceSheet" | "profitLoss";
  current: number;
  previous: number;
}

export interface MujStatement {
  balanceSheet: StatementLineValue<BalanceSheetLineId>[];
  profitLoss: StatementLineValue<ProfitLossLineId>[];
  unmapped: UnmappedAccount[];
  /** Total assets minus total equity and liabilities. */
  difference: { current: number; previous: number };
}

type UnmappedSink = Map<string, UnmappedAccount>;

function addUnmapped(
  sink: UnmappedSink,
  account: LedgerAccountBalance,
  statement: UnmappedAccount["statement"],
  period: "current" | "previous",
  units: number,
): void {
  if (units === 0) {
    return;
  }
  const key = `${statement}:${account.code}`;
  const entry = sink.get(key) ?? {
    code: account.code,
    name: account.name,
    statement,
    current: 0,
    previous: 0,
  };
  entry[period] += units;
  sink.set(key, entry);
}

function balanceSheetLeaves(
  balances: readonly LedgerAccountBalance[],
  period: "current" | "previous",
  sink: UnmappedSink,
): Map<BalanceSheetLineId, number> {
  const leaves = new Map<BalanceSheetLineId, number>();
  const add = (line: BalanceSheetLineId, units: number): void => {
    leaves.set(line, (leaves.get(line) ?? 0) + units);
  };
  const bilateral = new Map<
    string,
    { units: number; debit: BalanceSheetLineId; credit: BalanceSheetLineId }
  >();

  for (const account of balances) {
    const synthetic = syntheticAccount(account.code);
    const accountClass = synthetic?.[0];
    if (
      accountClass === "5" ||
      accountClass === "6" ||
      (synthetic === undefined && RESULT_TYPES.has(account.type))
    ) {
      // Unclosed revenue and expenses are this period's result (r. 33).
      add("bs33", -account.units);
      continue;
    }
    const rule = synthetic ? findRule(BALANCE_RULES, synthetic) : undefined;
    if (!synthetic || !rule) {
      addUnmapped(sink, account, "balanceSheet", period, account.units);
      continue;
    }
    if (rule.side === "bilateral") {
      const entry = bilateral.get(synthetic) ?? {
        units: 0,
        debit: rule.debit,
        credit: rule.credit,
      };
      entry.units += account.units;
      bilateral.set(synthetic, entry);
      continue;
    }
    add(rule.line, rule.side === "assets" ? account.units : -account.units);
  }

  for (const { units, debit, credit } of bilateral.values()) {
    if (units > 0) {
      add(debit, units);
    } else if (units < 0) {
      add(credit, -units);
    }
  }
  return leaves;
}

function profitLossLeaves(
  movements: readonly LedgerAccountBalance[],
  period: "current" | "previous",
  sink: UnmappedSink,
): Map<ProfitLossLineId, number> {
  const leaves = new Map<ProfitLossLineId, number>();
  for (const account of movements) {
    const synthetic = syntheticAccount(account.code);
    const accountClass = synthetic?.[0];
    const isResult =
      accountClass === "5" ||
      accountClass === "6" ||
      (synthetic === undefined && RESULT_TYPES.has(account.type));
    if (!isResult) {
      continue;
    }
    const rule = synthetic ? findRule(PROFIT_LOSS_RULES, synthetic) : undefined;
    if (!rule) {
      addUnmapped(sink, account, "profitLoss", period, account.units);
      continue;
    }
    const value = rule.side === "revenue" ? -account.units : account.units;
    leaves.set(rule.line, (leaves.get(rule.line) ?? 0) + value);
  }
  return leaves;
}

function resolveLines<TId extends StatementLineId>(
  layout: readonly LineDef<TId>[],
  leaves: Map<TId, number>,
): Map<TId, number> {
  const byId = new Map(layout.map((line) => [line.id, line]));
  const values = new Map<TId, number>();
  const resolve = (id: TId): number => {
    const known = values.get(id);
    if (known !== undefined) {
      return known;
    }
    const line = byId.get(id);
    let value = leaves.get(id) ?? 0;
    if (line?.plus || line?.minus) {
      value =
        (line.plus ?? []).reduce((sum, child) => sum + resolve(child), 0) -
        (line.minus ?? []).reduce((sum, child) => sum + resolve(child), 0);
    }
    values.set(id, value);
    return value;
  };
  layout.forEach((line) => resolve(line.id));
  return values;
}

function buildLines<TId extends StatementLineId>(
  layout: readonly LineDef<TId>[],
  current: Map<TId, number>,
  previous: Map<TId, number>,
): StatementLineValue<TId>[] {
  return layout.map((line, index) => ({
    id: line.id,
    row: index + 1,
    marker: line.marker,
    kind: line.kind,
    current: current.get(line.id) ?? 0,
    previous: previous.get(line.id) ?? 0,
  }));
}

/** Maps ledger balances to the Úč MÚJ súvaha and výkaz ziskov a strát. */
export function buildMujStatement(
  current: StatementPeriodInput,
  previous: StatementPeriodInput,
): MujStatement {
  const sink: UnmappedSink = new Map();
  const bsCurrent = resolveLines(
    BALANCE_SHEET,
    balanceSheetLeaves(current.balances, "current", sink),
  );
  const bsPrevious = resolveLines(
    BALANCE_SHEET,
    balanceSheetLeaves(previous.balances, "previous", sink),
  );
  const plCurrent = resolveLines(
    PROFIT_LOSS,
    profitLossLeaves(current.movements, "current", sink),
  );
  const plPrevious = resolveLines(
    PROFIT_LOSS,
    profitLossLeaves(previous.movements, "previous", sink),
  );

  return {
    balanceSheet: buildLines(BALANCE_SHEET, bsCurrent, bsPrevious),
    profitLoss: buildLines(PROFIT_LOSS, plCurrent, plPrevious),
    unmapped: [...sink.values()].toSorted(
      (a, b) =>
        a.statement.localeCompare(b.statement) ||
        a.code.localeCompare(b.code, undefined, { numeric: true }),
    ),
    difference: {
      current: (bsCurrent.get("bs01") ?? 0) - (bsCurrent.get("bs24") ?? 0),
      previous: (bsPrevious.get("bs01") ?? 0) - (bsPrevious.get("bs24") ?? 0),
    },
  };
}
