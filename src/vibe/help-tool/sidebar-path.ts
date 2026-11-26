/** Admin sidebar path ([cat] or [cat, sub]) encoded in the URL search params. */
export function parseSidebarPathFromSearch(search: {
  get: (key: string) => string | null;
}): string[] {
  // Links saved while the "All tools" button leaked its click event into the
  // path carry cat=[object Object]; treat those as the catalog root.
  const read = (key: string): string | null => {
    const value = search.get(key);
    return value?.startsWith("[object ") ? null : value;
  };
  const cat = read("cat");
  const sub = cat ? read("sub") : null;
  if (cat && sub) {
    return [cat, sub];
  }
  if (cat) {
    return [cat];
  }
  return [];
}
