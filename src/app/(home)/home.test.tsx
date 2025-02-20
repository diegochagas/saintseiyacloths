import { describe } from "node:test";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import News from "./components/news";
import english from "../../../messages/en.json";

describe("Home", () => {
  it("should render News correctly", () => {
    const wrapper = render(
      <NextIntlClientProvider locale="en" messages={english}>
        <News news={[]} />
      </NextIntlClientProvider>
    );
    const title = wrapper.getByText("Highlights");
    const more = wrapper.getByText("More");

    expect(title).toBeInTheDocument();
    expect(more).toBeInTheDocument();
  });
});
