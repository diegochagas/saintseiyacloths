import { IntlProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { render } from "@testing-library/react";
import Tabs from ".";
import midias from "../../../pages/api/data/midias.json";
import { getHistory } from "@/pages/api/history";

describe("Tabs", () => {
  it("should render correctly", () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Tabs tabs={midias} activeTab="1" onTabChange={() => {}} />
      </IntlProvider>
    );

    const title = wrapper.getByText("Audio");

    expect(title).toBeInTheDocument();
  });

  it("should render correctly with subtabs", () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Tabs
          tabs={midias}
          activeTab="1"
          onTabChange={() => {}}
          subTabs={getHistory()}
          subTabId="midia"
        />
      </IntlProvider>
    );

    const artist = wrapper.getByText("Never released: Never released");

    expect(artist).toBeInTheDocument();
  });
});
