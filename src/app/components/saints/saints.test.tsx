import { render } from "@testing-library/react";
import { IntlProvider } from "next-intl";
import Saints from ".";
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
});
