declare function clientLocaleLoader(source: string): string;

declare namespace clientLocaleLoader {
  function transformClientLocaleSource(source: string): string;
  function transformDevSsrLocaleSource(source: string): string;
  function transformViteClientLocaleSource(source: string, id: string): string;
}

export = clientLocaleLoader;
