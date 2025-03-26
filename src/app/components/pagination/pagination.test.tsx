import { render } from "@testing-library/react";
import { IntlProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import Pagination from ".";

describe("Pagination Component", () => {
  it("should render correctly", () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
      </IntlProvider>
    );

    const pagination = wrapper.getByTestId("pagination");

    expect(pagination).toBeInTheDocument();
  });

  it("should render correctly with multiple pages", () => {
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </IntlProvider>
    );

    const page = wrapper.getByText("1");

    expect(page).toBeInTheDocument();
  });

  it('should call "onPageChange" when clicking on previous page', () => {
    const onPageChange = jest.fn();
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={onPageChange}
        />
      </IntlProvider>
    );

    const previousPage = wrapper.getByTestId("previous-page");

    previousPage.click();

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should call "onPageChange" when clicking on next page', () => {
    const onPageChange = jest.fn();
    const wrapper = render(
      <IntlProvider messages={messages} locale="en">
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={onPageChange}
        />
      </IntlProvider>
    );

    const nextPage = wrapper.getByTestId("next-page");

    nextPage.click();

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  // it("should render correctly with the first page", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the last page", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the previous page", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the next page", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first and last page", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the previous and next page", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first, previous, next and last page", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first, previous, next, last and multiple pages", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first, previous, next, last and a single page", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first, previous, next, last and no pages", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first, previous, next, last and a single page", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first, previous, next, last and multiple pages", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first, previous, next, last and no pages", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first, previous, next, last and a single page", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first, previous, next, last and multiple pages", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first, previous, next, last and no pages", () => {
  //   // Test implementation here
  // });
  // it("should render correctly with the first, previous, next, last and a single page", () => {
  //   // Test implementation here
  // } );
});
