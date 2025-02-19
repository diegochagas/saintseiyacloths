import { IntlProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { render } from "@testing-library/react";
import { act } from "react";
import Tabs from ".";

describe("Tabs", () => {
  it("should render correctly", async () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Tabs
          tabs={[{ id: "1", name: "official" }]}
          activeTab="1"
          onTabChange={() => {}}
        />
      </IntlProvider>
    );

    const title = wrapper.getByText("Official");

    expect(title).toBeInTheDocument();
  });
});
