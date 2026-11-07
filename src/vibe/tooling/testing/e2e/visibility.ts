/**
 * Visibility assertions for e2e specs.
 *
 * `waitFor()` only proves an element is in the DOM with a box. Overlays
 * (popovers, sheets, mobile sidebars) can still cover it - the classic
 * "menu does nothing" bug where a dropdown opens BEHIND a higher layer.
 */

import type { Locator } from "playwright";

/**
 * True when the element under the locator's center point is the element
 * itself (or one of its children) - i.e. nothing is stacked on top of it.
 */
export async function isOnTop(locator: Locator): Promise<boolean> {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    // eslint-disable-next-line restricted/no-browser-globals -- runs inside the browser page, not app code
    const top = document.elementFromPoint(
      r.x + r.width / 2,
      r.y + r.height / 2,
    );
    return top !== null && (top === el || el.contains(top));
  });
}
