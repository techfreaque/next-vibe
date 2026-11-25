export function billDateToday(): Date {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export function billDueDateFromTerms(
  billDate: Date | string | number | undefined,
  terms: number | null | undefined,
): Date | undefined {
  if (
    billDate === undefined ||
    terms === null ||
    terms === undefined ||
    !Number.isInteger(terms) ||
    terms < 0 ||
    terms > 3650
  ) {
    return undefined;
  }
  const dueDate = new Date(billDate);
  if (!Number.isFinite(dueDate.getTime())) {
    return undefined;
  }
  dueDate.setUTCDate(dueDate.getUTCDate() + terms);
  return dueDate;
}
