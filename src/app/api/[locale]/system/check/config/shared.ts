/** Issue severity levels */
type IssueSeverity = "error" | "warning" | "info";

/** Base issue structure */
interface BaseIssue {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: IssueSeverity;
  message: string;
}

/**
 * Sort issues by file path, then by line number.
 *
 * @param issues - Array of issues to sort
 * @returns New sorted array (does not mutate original)
 */
export function sortIssuesByLocation<T extends BaseIssue>(issues: T[]): T[] {
  return issues.toSorted((a, b) => {
    if (a.file !== b.file) {
      return a.file.localeCompare(b.file);
    }
    return (a.line || 0) - (b.line || 0);
  });
}
