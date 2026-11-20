export function documentPage(
  total: number,
  requestedPage: number,
  pageSize: number,
): { currentPage: number; pageSizeApplied: number; pageCount: number } {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return {
    currentPage: Math.min(requestedPage, pageCount),
    pageSizeApplied: pageSize,
    pageCount,
  };
}

export function documentSearchPattern(search: string): string {
  return `%${search.replaceAll(/[\\%_]/g, "\\$&")}%`;
}
