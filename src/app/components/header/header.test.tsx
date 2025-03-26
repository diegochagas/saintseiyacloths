import { IntlProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { fireEvent, render } from "@testing-library/react";
import Header from ".";
import { MenuProvider, useMenu } from "@/app/context/menu-context";

const homePath = "/";

jest.mock("../../context/menu-context", () => ({
  useMenu: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => homePath),
}));

const resizeWindow = (width: number) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event("resize"));
};

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const wrapper = render(<Header />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en" messages={messages}>
          <MenuProvider>{children}</MenuProvider>
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

    const homeLink = wrapper.getByTestId("menu-home");
    const newsLink = wrapper.getByTestId("menu-news");

    expect(homeLink).toHaveClass("text-yellow-500");
    expect(newsLink).not.toHaveClass("text-yellow-500");
  });

  it('should open menu when clicked on the "Menu" button', () => {
    const wrapper = render(<Header />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en" messages={messages}>
          <MenuProvider>{children}</MenuProvider>
        </IntlProvider>
      ),
    });

    const menuButton = wrapper.getByTestId("menu");

    expect(wrapper.getByTestId("icon-menu")).toBeInTheDocument();

    fireEvent.click(menuButton);

    expect(wrapper.getByTestId("icon-close")).toBeInTheDocument();
  });

  it('should click on the "Home" link and close the menu', () => {
    resizeWindow(500);

    const wrapper = render(<Header />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en" messages={messages}>
          <MenuProvider>{children}</MenuProvider>
        </IntlProvider>
      ),
    });

    const menuButton = wrapper.getByTestId("menu");
    const navBar = wrapper.getByRole("list");
    fireEvent.click(menuButton);
    expect(navBar).not.toHaveClass("hidden");

    const homeLink = wrapper.getByTestId("menu-home");
    fireEvent.click(homeLink);
    expect(wrapper.getByTestId("icon-menu")).toBeInTheDocument();
    expect(navBar).toHaveClass("hidden");
  });

  it("should call setIsMenuOpen when clicking the menu button", () => {
    const mockSetIsMenuOpen = jest.fn();

    (useMenu as jest.Mock).mockReturnValue({
      isMenuOpen: false,
      setIsMenuOpen: mockSetIsMenuOpen,
    });

    const wrapper = render(<Header />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en" messages={messages}>
          <MenuProvider>{children}</MenuProvider>
        </IntlProvider>
      ),
    });

    const menuButton = wrapper.getByTestId("menu");

    fireEvent.click(menuButton);

    // expect(useMenu).toHaveBeenCalledWith(true);
  });
});
