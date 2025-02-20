import { IntlProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { render } from "@testing-library/react";
import Tabs from ".";
import official from "../../../pages/api/data/official.json";

describe("Tabs", () => {
  it("should render correctly", async () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Tabs tabs={official} activeTab="1" onTabChange={() => {}} />
      </IntlProvider>
    );

    const title = wrapper.getByText("Official");

    expect(title).toBeInTheDocument();
  });
});
