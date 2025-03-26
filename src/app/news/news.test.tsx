import { IntlProvider } from "next-intl";
import messages from "../../../messages/en.json";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Content from "./content";

const tabsMock = [
  { id: "1", name: "manga" },
  { id: "2", name: "anime" },
];
const onTabChange = jest.fn();

describe("News", () => {
  beforeEach(() => {
    onTabChange.mockClear();
  });

  it("should render correctly", () => {
    const wrapper = render(
      <IntlProvider locale="en" messages={messages}>
        <Content
          news={[]}
          currentPage={0}
          totalPages={0}
          onPageChange={() => {}}
          tabs={[]}
          activeTab=""
          onTabChange={() => {}}
          searchValue=""
          onSearchValue={() => {}}
          onSearchClear={() => {}}
        />
      </IntlProvider>
    );

    const title = wrapper.getByText("News");

    expect(title).toBeInTheDocument();
  });

  it("should render tabs", () => {
    const wrapper = render(
      <IntlProvider locale="en" messages={messages}>
        <Content
          news={[]}
          currentPage={0}
          totalPages={0}
          onPageChange={() => {}}
          tabs={tabsMock}
          activeTab=""
          onTabChange={() => {}}
          searchValue=""
          onSearchValue={() => {}}
          onSearchClear={() => {}}
        />
      </IntlProvider>
    );

    const tab1 = wrapper.getByText("Manga");
    const tab2 = wrapper.getByText("Anime");

    expect(tab1).toBeInTheDocument();
    expect(tab2).toBeInTheDocument();
  });

  it("should click on diferent tab", async () => {
    const user = userEvent.setup();

    const wrapper = render(
      <IntlProvider locale="en" messages={messages}>
        <Content
          news={[]}
          currentPage={0}
          totalPages={0}
          onPageChange={() => {}}
          tabs={tabsMock}
          activeTab=""
          onTabChange={onTabChange}
          searchValue=""
          onSearchValue={() => {}}
          onSearchClear={() => {}}
        />
      </IntlProvider>
    );

    const tab1 = wrapper.getByRole("button", { name: "Anime" });

    await user.click(tab1);

    expect(onTabChange).toHaveBeenCalledWith("2");
  });

  it("should click on activeTab", () => {
    const wrapper = render(
      <IntlProvider locale="en" messages={messages}>
        <Content
          news={[]}
          currentPage={0}
          totalPages={0}
          onPageChange={() => {}}
          tabs={tabsMock}
          activeTab="1"
          onTabChange={onTabChange}
          searchValue=""
          onSearchValue={() => {}}
          onSearchClear={() => {}}
        />
      </IntlProvider>
    );

    const tab2 = wrapper.getByText("Manga");
    tab2.click();

    expect(onTabChange).toHaveBeenCalledWith("");
  });

  it("should call onSearchValue when typing", () => {
    const mockOnSearchValue = jest.fn();

    const wrapper = render(
      <IntlProvider locale="en" messages={messages}>
        <Content
          news={[]}
          currentPage={0}
          totalPages={0}
          onPageChange={() => {}}
          tabs={tabsMock}
          activeTab="1"
          onTabChange={onTabChange}
          searchValue=""
          onSearchValue={mockOnSearchValue}
          onSearchClear={() => {}}
        />
      </IntlProvider>
    );

    const input = wrapper.getByRole("textbox");

    fireEvent.change(input, { target: { value: "Saint Seiya" } });

    expect(mockOnSearchValue).toHaveBeenCalledWith("Saint Seiya");
  });
});
