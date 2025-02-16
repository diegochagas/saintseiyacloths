import { render } from "@testing-library/react";
import Error from ".";

describe("Error", () => {
  it("should render correctly", () => {
    const wrapper = render(<Error>children</Error>);

    const text = wrapper.getByText("children");

    expect(text).toBeInTheDocument();
  });

  it("should render the title", () => {
    const wrapper = render(<Error title="title">children</Error>);

    const title = wrapper.getByText("title");

    expect(title).toBeInTheDocument();
  });

  it("should render the subtitle", () => {
    const wrapper = render(<Error subTitle="subtitle">children</Error>);

    const subTitle = wrapper.getByText("subtitle");

    expect(subTitle).toBeInTheDocument();
  });

  it("should render the back button", () => {
    const wrapper = render(
      <Error backButtonURL="/back" backButtonText="Back">
        children
      </Error>
    );

    const backButtonText = wrapper.getByText("Back");

    expect(backButtonText).toBeInTheDocument();
  });
});
