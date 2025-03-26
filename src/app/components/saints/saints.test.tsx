import { render } from "@testing-library/react";
import { IntlProvider } from "next-intl";
import Saints from ".";
import ListItem from "./list-item";
import messages from "../../../../messages/en.json";
import { getSaintsByClass } from "@/pages/api/classes";
import classesJson from "../../../pages/api/data/classes.json";

describe("Saints", () => {
  it("should render correctly wihout data", () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Saints data={[]} />
      </IntlProvider>
    );

    expect(wrapper.getByTestId("saints")).toBeInTheDocument();
  });

  it("should render correctly with data", () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Saints
          data={getSaintsByClass(classesJson[0], classesJson[0].id).data}
        />
      </IntlProvider>
    );

    expect(wrapper.getByText("Odysseus")).toBeInTheDocument();
    expect(wrapper.getByText("Angel Glory (Odysseus)")).toBeInTheDocument();
  });

  it("should render correctly with data and 'Unknown Character'", () => {
    const data = getSaintsByClass(classesJson[0], classesJson[0].id).data[0];
    data.saints = undefined;

    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Saints data={[data]} />
      </IntlProvider>
    );

    expect(wrapper.getByText("Unknown Character")).toBeInTheDocument();
  });

  it("should render ListItem correctly without data", () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <ListItem />
      </IntlProvider>
    );

    const name = wrapper.getByText("Unknown Character");

    expect(name).toBeInTheDocument();
  });

  it("should render ListItem correctly with data", () => {
    const saint = getSaintsByClass(classesJson[0], classesJson[0].id).data[1]
      .saints[0];
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <ListItem
          id={saint.id}
          image={saint.image}
          cloth={saint.cloth.name[0]}
          name={saint.character.name}
        />
      </IntlProvider>
    );

    expect(wrapper.getByText("Toma / Icarus")).toBeInTheDocument();
    expect(wrapper.getByText("angelglory")).toBeInTheDocument();
  });
});
