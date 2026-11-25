export const JOURNAL_EXPORT_MAX_ROWS = 10_000;
export const JOURNAL_EXPORT_MAX_BYTES = 5 * 1024 * 1024;

interface JournalCsvCell {
  value: string;
  numeric?: boolean;
}

export function journalCsvCell(cell: JournalCsvCell): string {
  if (
    cell.numeric &&
    (cell.value === "" || /^-?[0-9]+(?:\.[0-9]+)?$/.test(cell.value))
  ) {
    return cell.value;
  }

  // Quoting does not prevent spreadsheet programs from evaluating formulas.
  const formula =
    /^[=+\-@\t\r\n]/.test(cell.value) ||
    /^[=+\-@]/.test(cell.value.trimStart());
  const neutralized = formula ? `'${cell.value}` : cell.value;
  return `"${neutralized.replaceAll('"', '""')}"`;
}

export function encodeJournalCsv(
  header: string[],
  rows: Iterable<JournalCsvCell[]>,
): string | null {
  // A BOM lets clients that otherwise assume a local code page detect UTF-8.
  const lines = [
    `\uFEFF${header.map((value) => journalCsvCell({ value })).join(",")}\r\n`,
  ];
  const encoder = new TextEncoder();
  let bytes = encoder.encode(lines[0]).byteLength;
  for (const row of rows) {
    const line = `${row.map(journalCsvCell).join(",")}\r\n`;
    bytes += encoder.encode(line).byteLength;
    if (bytes > JOURNAL_EXPORT_MAX_BYTES) {
      return null;
    }
    lines.push(line);
  }

  return lines.join("");
}
