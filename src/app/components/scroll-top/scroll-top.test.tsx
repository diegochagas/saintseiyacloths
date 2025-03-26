import { render, screen, fireEvent } from "@testing-library/react";
import { animateScroll } from "react-scroll";
import ScrollTop from ".";
import { useMenu } from "@/app/context/menu-context";

jest.mock("../../context/menu-context", () => ({
  useMenu: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => key),
}));

jest.mock("react-scroll", () => ({
  animateScroll: { scrollToTop: jest.fn() },
}));

describe("ScrollTop Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    (useMenu as jest.Mock).mockReturnValue({ isMenuOpen: false });

    const wrapper = render(<ScrollTop />);

    expect(wrapper.getByText("pageTop")).toBeInTheDocument();
    expect(wrapper.getByRole("link")).toHaveClass("block");
  });

  it("should hide when menu is open", () => {
    (useMenu as jest.Mock).mockReturnValue({ isMenuOpen: true });

    const wrapper = render(<ScrollTop />);

    expect(wrapper.queryByRole("link")).toHaveClass("hidden");
  });

  it("should show when scrolling past 200px", () => {
    (useMenu as jest.Mock).mockReturnValue({ isMenuOpen: false });

    render(<ScrollTop />);
    expect(screen.getByRole("link")).toHaveClass("opacity-0");

    fireEvent.scroll(window, { target: { scrollY: 250 } });

    expect(screen.getByRole("link")).toHaveClass("opacity-100");
  });

  it("should trigger scroll to top when clicked", () => {
    (useMenu as jest.Mock).mockReturnValue({ isMenuOpen: false });

    render(<ScrollTop />);

    const button = screen.getByRole("link");

    fireEvent.click(button);

    expect(animateScroll.scrollToTop).toHaveBeenCalledWith({
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  });
});
