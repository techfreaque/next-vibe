import { expect, it } from "bun:test";

import { pickerButtonLabel, pickerFieldLabel } from "./label";

it("never says ID on a picker", () => {
  expect(pickerFieldLabel("Company ID")).toBe("Company");
  expect(pickerFieldLabel("Company Id")).toBe("Company");
  expect(pickerFieldLabel("Customer")).toBe("Customer");
  expect(pickerFieldLabel("ID")).toBe("ID");
});

it("writes the label in sentence case inside the button", () => {
  expect(pickerButtonLabel("Company", "en-US")).toBe("company");
  expect(pickerButtonLabel("VAT rate", "en-US")).toBe("VAT rate");
  expect(pickerButtonLabel("Unternehmen", "de-DE")).toBe("Unternehmen");
  expect(pickerButtonLabel("Spoločnosť", "sk-SK")).toBe("spoločnosť");
});
