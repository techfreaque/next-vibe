/** Only the newest browser navigation may publish an asynchronously restored endpoint. */
export function createUrlNavigationRestore<TEntry>(): {
  cancel: () => void;
  restore: (
    load: () => Promise<TEntry | null>,
    publish: (entry: TEntry | null) => void,
  ) => Promise<void>;
} {
  let revision = 0;
  return {
    cancel: (): void => {
      revision += 1;
    },
    restore: async (load, publish): Promise<void> => {
      const startedAt = ++revision;
      const entry = await load();
      if (startedAt === revision) {
        publish(entry);
      }
    },
  };
}
