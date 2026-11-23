import { parentPort, workerData } from "node:worker_threads";

import { scrapeBrowserPage, scrapeOptionsSchema } from "./browser-scraper";

const port = parentPort;
if (port) {
  const options = scrapeOptionsSchema.parse(workerData);
  void scrapeBrowserPage((message, details) => {
    port.postMessage({ type: "log", message, details });
  }, options).then((text) => {
    port.postMessage({ type: "result", text });
    return undefined;
  });
}
