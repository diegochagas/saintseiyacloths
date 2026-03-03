import { render, screen, fireEvent } from "@testing-library/react";
import ScrollTop from ".";
import { useMenu } from "@/app/context/menu-context";

jest.mock("../../context/menu-context", () => ({
  useMenu: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => key),
}));

describe("ScrollTop Component", () => {
  beforeAll(() => {
    Object.defineProperty(window, "scrollTo", {
      value: jest.fn(),
      writable: true,
    });
  });

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

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
