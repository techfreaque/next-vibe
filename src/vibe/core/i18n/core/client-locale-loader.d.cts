declare function clientLocaleLoader(source: string): string;

declare namespace clientLocaleLoader {
  function transformClientLocaleSource(source: string): string;
}

export = clientLocaleLoader;
