import { render } from "@testing-library/react";
import NewsList from ".";
import { IntlProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { getNews } from "@/pages/api/news";

describe("NewsList", () => {
  const news = getNews().data;

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
        <NewsList news={news} />
      </IntlProvider>
    );

    const character = wrapper.getByText("Shijima / Asmita");

    expect(character).toBeInTheDocument();
  });

  it("should render correctly with unknown character", () => {
    const unknownCharacter = news[0];
    unknownCharacter.saint.character = undefined;

    const wrapper = render(
      <IntlProvider locale="en" messages={messages}>
        <NewsList news={[unknownCharacter]} />
      </IntlProvider>
    );

    const character = wrapper.getByText("Unknown");

    expect(character).toBeInTheDocument();
  });
});
