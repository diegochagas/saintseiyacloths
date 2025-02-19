import { render } from "@testing-library/react";
import { IntlProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import ListItem from "./list-item";

describe("ListItem", () => {
  it("should render correctly without news", () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <ListItem />
      </IntlProvider>
    );

    const name = wrapper.getByText("Unknown Character");

    expect(name).toBeInTheDocument();
  });

  it("should render correctly with news", () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <ListItem id="1" image="" cloth="" name="Test" />
      </IntlProvider>
    );

    const name = wrapper.getByText("Test");

    expect(name).toBeInTheDocument();
  });
});
