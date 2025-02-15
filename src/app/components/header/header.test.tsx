import { IntlProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { render } from "@testing-library/react";
import Header from ".";

const homePath = "/";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => homePath),
}));

describe("Header", () => {
  it("should render correctly", () => {
    const wrapper = render(<Header />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en" messages={messages}>
          {children}
        </IntlProvider>
      ),
    });

    const logoLink = wrapper.getByAltText("Saint Seiya Cloths logo");
    const twitterLink = wrapper.getByAltText("X logo");
    const homeLink = wrapper.getByText("Home");
    const newsLink = wrapper.getByText("News");
    const classesLink = wrapper.getByText("Classes");
    const artistsLink = wrapper.getByText("Artists");
    const historyLink = wrapper.getByText("History");
    const aboutLink = wrapper.getByText("About");

    expect(logoLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
    expect(newsLink).toBeInTheDocument();
    expect(classesLink).toBeInTheDocument();
    expect(artistsLink).toBeInTheDocument();
    expect(historyLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
  });

  it('should highlight the "Home" link when clicked', () => {
    const wrapper = render(<Header />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en" messages={messages}>
          {children}
        </IntlProvider>
      ),
    });

    const homeLink = wrapper.getByTestId("home");
    const newsLink = wrapper.getByTestId("news");

    // newsLink.classList.forEach((item) => console.log(item));

    expect(homeLink).toHaveClass("text-yellow-500");
    expect(newsLink).not.toHaveClass("text-yellow-500");
  });
});
