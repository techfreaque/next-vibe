import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { imageGenModelOptions } from "../../image-generation/models";
import { getModelPrice } from "../models";
import { ModelCreditDisplay } from "./model-credit-display";

test("credit badges use the decimal separator of the site locale", () => {
  const imageModel = imageGenModelOptions.find(
    (option) => option.creditCostPerImage !== undefined,
  );
  if (!imageModel) {
    expect.unreachable("An image model is needed for the price fixture");
  }
  const model = { ...imageModel, creditCostPerImage: 1 };
  const price = getModelPrice(model);
  expect(Number.isInteger(price)).toBe(false);
  for (const locale of [
    "sk-SK",
    "sk-GLOBAL",
    "en-US",
    "en-IN",
    "hi-IN",
  ] as const) {
    const html = renderToStaticMarkup(
      <ModelCreditDisplay
        modelId={model.id}
        modelOption={model}
        locale={locale}
        interactive={false}
        showMoney={false}
      />,
    );
    expect(html).toContain(price.toLocaleString(locale));
  }
});
