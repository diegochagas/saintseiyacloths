import { render } from "@testing-library/react";
import NewsList from ".";
import { IntlProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { newsMock } from "@/pages/mocks/news-mock";

describe("NewsList", () => {
  it("should render correctly with no news", () => {
    const wrapper = render(
      <IntlProvider locale="en" messages={messages}>
        <NewsList news={[]} />
      </IntlProvider>
    );
    const message = wrapper.getByText("Error: News not found!");

    expect(message).toBeInTheDocument();
  });

  it("should render correctly with news", () => {
    const wrapper = render(
      <IntlProvider locale="en" messages={messages}>
        <NewsList news={newsMock} />
      </IntlProvider>
    );

    const news = wrapper.getByText("Shijima / Asmita");

    expect(news).toBeInTheDocument();
  });

  it("should render correctly with unknown character", () => {
    const wrapper = render(
      <IntlProvider locale="en" messages={messages}>
        <NewsList
          news={newsMock.map((item) => ({
            ...item,
            saint: { ...item.saint, character: undefined },
          }))}
        />
      </IntlProvider>
    );

    const news = wrapper.getByText("Unknown");

    expect(news).toBeInTheDocument();
  });
});
