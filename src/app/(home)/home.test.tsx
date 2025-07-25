import { describe } from "node:test";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import Classes from "./components/classes";
import english from "../../../messages/en.json";

describe("Home", () => {
  it("should render classes correctly", () => {
    const wrapper = render(
      <NextIntlClientProvider locale="en" messages={english}>
        <Classes saints={[]} />
      </NextIntlClientProvider>
    );
    const title = wrapper.getByText("Highlights");
    const more = wrapper.getByText("More");

    expect(title).toBeInTheDocument();
    expect(more).toBeInTheDocument();
  });
});
