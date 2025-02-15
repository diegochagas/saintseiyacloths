import { render } from "@testing-library/react";
import NewsList from ".";
import { IntlProvider } from "next-intl";
import messages from "../../../../messages/en.json";

describe("NewsList", () => {
  const newsMock = [
    {
      amazon: "https://www.test.com",
      date: "2/13/2025",
      saint: {
        artist: {
          id: "21",
          name: "Tomas Jefferson",
          official: "2",
          site: "http://www.test.com",
        },
        character: { id: "40", name: "Shijima / Asmita" },
        cloth: {
          artist: {
            id: "21",
            name: "Tomas Jefferson",
            official: "2",
            site: "http://www.test.com",
          },
          history: {
            description: "",
            id: "0",
            midia: { id: "0", name: "neverReleased" },
            name: "neverReleased",
            release: "",
          },
          id: "781",
          name: ["virgocloth", "theLostCanvas"],
        },
        god: { id: "582", name: "Athena" },
        group: {
          id: "athena-saints-86",
          class: "saints",
          name: "virgoConstellation",
        },
        history: {
          description: "",
          id: "15",
          midia: { id: "2", name: "anime" },
          name: "theLostCanvas",
          release: "2009",
        },
        id: "45",
        image:
          "/cloth-schemes/athena-saints/virgo-asmita-lost-canvas-anime.jpg",
        rank: "gold",
      },
    },
  ];

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
});
