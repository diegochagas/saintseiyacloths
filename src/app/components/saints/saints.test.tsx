import { render } from "@testing-library/react";
import { IntlProvider } from "next-intl";
import Saints from ".";
import ListItem from "./list-item";
import messages from "../../../../messages/en.json";

describe("Saints", () => {
  it("should render correctly", () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Saints data={[]} />
      </IntlProvider>
    );

    expect(wrapper.getByTestId("saints")).toBeInTheDocument();
  });

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
        <ListItem id="1" cloth="" name="Test" />
      </IntlProvider>
    );

    const name = wrapper.getByText("Test");

    expect(name).toBeInTheDocument();
  });
});
