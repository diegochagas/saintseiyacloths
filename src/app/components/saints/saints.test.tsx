import { render } from "@testing-library/react";
import { IntlProvider } from "next-intl";
import Saints from ".";
import ListItem from "./list-item";
import messages from "../../../../messages/en.json";

// Deterministic fixtures instead of the live JSON data, so the tests
// don't break every time the database is updated
const saint = {
  id: "s1",
  name: "Toma",
  image: "/cloth-schemes/apollo-angels/angel-toma.jpg",
  cloth: { id: "c1", name: "Glory" },
  group: { id: "g1", class: "angels", name: "angels" },
  version: "",
  rank: "",
  history: { id: "h1", name: "manga", midia: { id: "m1", name: "anime" } },
} as any;

const groupWithSaints = {
  id: "g1",
  class: "angels",
  name: "angels",
  saints: [saint],
} as any;

const emptyGroup = {
  id: "g2",
  class: "angels",
  name: "angels",
  saints: [],
} as any;

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider messages={messages} locale="en">{ui}</IntlProvider>);

describe("Saints", () => {
  it("should render correctly without data", () => {
    const wrapper = renderWithIntl(<Saints data={[]} />);

    expect(wrapper.getByTestId("saints")).toBeInTheDocument();
  });

  it("should render the group title and its saints", () => {
    const wrapper = renderWithIntl(<Saints data={[groupWithSaints]} />);

    expect(wrapper.getByText("Angels")).toBeInTheDocument();
    expect(wrapper.getByText("Glory Toma")).toBeInTheDocument();
    expect(wrapper.getByText("Manga (Anime)")).toBeInTheDocument();
  });

  it("should render a placeholder item for groups without saints", () => {
    const wrapper = renderWithIntl(<Saints data={[emptyGroup]} />);

    expect(wrapper.getByText("Never released")).toBeInTheDocument();
    expect(wrapper.getByAltText("Saint cloth scheme")).toBeInTheDocument();
  });

  it("should render ListItem correctly without data", () => {
    const wrapper = renderWithIntl(<ListItem />);

    expect(wrapper.getByText("Never released")).toBeInTheDocument();
  });

  it("should render ListItem correctly with data", () => {
    const wrapper = renderWithIntl(
      <ListItem
        id={saint.id}
        image={saint.image}
        cloth={saint.cloth.name}
        name={saint.name}
        history={saint.history}
      />
    );

    expect(wrapper.getByText("Glory Toma")).toBeInTheDocument();
    expect(wrapper.getByText("Manga (Anime)")).toBeInTheDocument();
    expect(
      wrapper.getByRole("link", { name: /Glory Toma/ })
    ).toHaveAttribute("href", "/classes/s1");
  });
});
