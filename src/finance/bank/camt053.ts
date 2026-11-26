import { BANK_STATEMENT_CSV_LIMIT, BANK_STATEMENT_ROW_LIMIT } from "./csv";
import {
  statementAmount,
  statementCurrency,
  statementDate,
  type StatementRows,
  type StatementSourceRow,
} from "./statement-format";

interface StatementNode {
  name: string;
  attributes: Map<string, string>;
  text: string;
  children: StatementNode[];
}

function decoded(value: string): string {
  const entities = new Map([
    ["amp", "&"],
    ["lt", "<"],
    ["gt", ">"],
    ["quot", '"'],
    ["apos", "'"],
  ]);
  return value.replace(
    /&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/giu,
    (original: string, name: string) => {
      const named = entities.get(name);
      if (named !== undefined) {
        return named;
      }
      const point = name.startsWith("#x")
        ? Number.parseInt(name.slice(2), 16)
        : Number(name.slice(1));
      return point > 0 &&
        point <= 0x10ffff &&
        !(point >= 0xd800 && point <= 0xdfff)
        ? String.fromCodePoint(point)
        : original;
    },
  );
}

function readTree(xml: string): StatementNode | undefined {
  if (/<!DOCTYPE|<!ENTITY/iu.test(xml)) {
    return undefined;
  }
  const tree: StatementNode = {
    name: "",
    attributes: new Map(),
    text: "",
    children: [],
  };
  const stack = [tree];
  const tokens =
    /<!--(?:[^-]|-(?!->))*-->|<\?xml\s[^?]*\?>|<\/?[A-Za-z_][\w:.-]*(?:\s+[A-Za-z_][\w:.-]*\s*=\s*(?:"[^"]*"|'[^']*'))*\s*\/?>|[^<]+/gu;
  let cursor = 0;
  for (const match of xml.replace(/^\uFEFF/u, "").matchAll(tokens)) {
    if (cursor !== match.index) {
      return undefined;
    }
    const token = match[0];
    cursor += token.length;
    if (token.startsWith("<!--") || token.startsWith("<?xml")) {
      continue;
    }
    const head = stack.at(-1);
    if (!head) {
      return undefined;
    }
    if (!token.startsWith("<")) {
      head.text += decoded(token);
      continue;
    }
    const [, qualified] = /^<\/?([\w:.-]+)/u.exec(token) ?? [];
    if (!qualified) {
      return undefined;
    }
    const name = qualified.split(":").at(-1) ?? qualified;
    if (token.startsWith("</")) {
      if (head.name !== name || stack.length < 2) {
        return undefined;
      }
      stack.pop();
      continue;
    }
    const children: StatementNode[] = [];
    const attributes = new Map<string, string>();
    for (const attribute of token.matchAll(
      /\s+([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gu,
    )) {
      const [, key, double, single] = attribute;
      if (attributes.has(key)) {
        return undefined;
      }
      attributes.set(key, decoded(double ?? single ?? ""));
    }
    const parsedNode = { name, attributes, text: "", children };
    head.children.push(parsedNode);
    if (!token.endsWith("/>")) {
      stack.push(parsedNode);
      if (stack.length > 50) {
        return undefined;
      }
    }
  }
  return stack.length === 1 &&
    tree.children.length === 1 &&
    tree.text.trim() === "" &&
    cursor === xml.replace(/^\uFEFF/u, "").length
    ? tree.children[0]
    : undefined;
}

function node(
  entry: StatementNode | undefined,
  ...path: string[]
): StatementNode | undefined {
  return path.reduce<StatementNode | undefined>(
    (current, part) => current?.children.find(({ name }) => name === part),
    entry,
  );
}

function text(
  entry: StatementNode | undefined,
  ...path: string[]
): string | undefined {
  return node(entry, ...path)?.text.trim() || undefined;
}

function date(entry: StatementNode, key: string): string | undefined {
  return statementDate(text(entry, key, "Dt") ?? text(entry, key, "DtTm"));
}

function signed(
  value: string | undefined,
  direction: string | undefined,
): string | undefined {
  if (
    (direction !== "CRDT" && direction !== "DBIT") ||
    value?.startsWith("-")
  ) {
    return undefined;
  }
  return statementAmount(
    `${direction === "DBIT" ? "-" : ""}${value ?? ""}`,
    ".",
  );
}

export function parseCamt053(raw: string): StatementRows {
  if (new TextEncoder().encode(raw).length > BANK_STATEMENT_CSV_LIMIT) {
    return { success: false, error: "size" };
  }
  const root = readTree(raw);
  const report = node(root, "BkToCstmrStmt");
  if (root?.name !== "Document" || !report) {
    return { success: false, error: "header" };
  }
  const rows: StatementSourceRow[] = [];
  const statements = report.children.filter(({ name }) => name === "Stmt");
  const accountIds = statements.map(
    (statement) =>
      text(statement, "Acct", "Id", "IBAN") ??
      text(statement, "Acct", "Id", "Othr", "Id"),
  );
  if (
    statements.length > 1 &&
    (!accountIds[0] || !accountIds.every((id) => id === accountIds[0]))
  ) {
    return { success: false, error: "header" };
  }
  for (const statement of statements) {
    for (const entry of statement.children.filter(
      ({ name }) => name === "Ntry",
    )) {
      const status = text(entry, "Sts", "Cd") ?? text(entry, "Sts");
      if (status && status !== "BOOK") {
        continue;
      }
      const bookedDate = date(entry, "BookgDt");
      const valueDate = date(entry, "ValDt");
      const amountNode = node(entry, "Amt");
      const direction = text(entry, "CdtDbtInd");
      const amount = signed(amountNode?.text.trim(), direction);
      const currency = statementCurrency(amountNode?.attributes.get("Ccy"));
      const parts = entry.children
        .filter(({ name }) => name === "NtryDtls")
        .flatMap(({ children }) =>
          children.filter(({ name }) => name === "TxDtls"),
        );
      if (!bookedDate || !amount || !currency || parts.length > 1) {
        return { success: false, error: "row", row: rows.length + 1 };
      }
      const part = parts[0];
      const original = node(part, "AmtDtls", "InstdAmt", "Amt");
      const nativeAmount = original
        ? signed(original.text.trim(), direction)
        : undefined;
      const nativeCurrency = statementCurrency(original?.attributes.get("Ccy"));
      if (original && (!nativeAmount || !nativeCurrency)) {
        return { success: false, error: "row", row: rows.length + 1 };
      }
      const feeNode =
        node(part, "Chrgs", "TtlChrgsAndTaxAmt") ??
        node(entry, "Chrgs", "TtlChrgsAndTaxAmt");
      const feeAmount =
        feeNode && !/^0+(?:\.0+)?$/u.test(feeNode.text.trim())
          ? signed(feeNode.text.trim(), "DBIT")
          : undefined;
      const feeCurrency = feeAmount
        ? statementCurrency(feeNode?.attributes.get("Ccy"))
        : undefined;
      if (feeAmount && !feeCurrency) {
        return { success: false, error: "row", row: rows.length + 1 };
      }
      const remittance = node(part, "RmtInf")
        ?.children.filter(({ name }) => name === "Ustrd")
        .map(({ text: memo }) => memo.trim())
        .filter(Boolean)
        .join(" ");
      const counterparty = direction === "DBIT" ? "Cdtr" : "Dbtr";
      rows.push({
        transactionId:
          text(entry, "AcctSvcrRef") ??
          text(part, "Refs", "AcctSvcrRef") ??
          text(entry, "NtryRef"),
        bookedDate,
        valueDate,
        amount,
        currency,
        nativeAmount,
        nativeCurrency,
        feeAmount,
        feeCurrency,
        description: remittance || text(entry, "AddtlNtryInf"),
        counterparty:
          text(part, "RltdPties", counterparty, "Pty", "Nm") ??
          text(part, "RltdPties", counterparty, "Nm"),
        counterpartyIban: text(
          part,
          "RltdPties",
          `${counterparty}Acct`,
          "Id",
          "IBAN",
        ),
      });
      if (rows.length > BANK_STATEMENT_ROW_LIMIT) {
        return { success: false, error: "size" };
      }
    }
  }
  return rows.length
    ? { success: true, rows }
    : { success: false, error: "empty" };
}
