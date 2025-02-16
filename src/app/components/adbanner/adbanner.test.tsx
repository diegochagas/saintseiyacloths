import { render } from "@testing-library/react";
import AdBanner from ".";

describe("AdBanner", () => {
  it("should render correctly", () => {
    const wrapper = render(
      <AdBanner
        dataAdSlot="123456"
        dataFullWidthResponsive={true}
        dataAdFormat="auto"
      />
    );

    const banner = wrapper.getByTestId("ad-banner");

    expect(banner).toBeInTheDocument();
  });

  it("should render correctly with error", () => {
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    Object.defineProperty(window, "adsbygoogle", {
      value: {
        push: jest.fn(() => {
          throw new Error("adsbygoogle push failed");
        }),
      },
      writable: true,
    });

    render(
      <AdBanner
        dataAdSlot="123456"
        dataFullWidthResponsive={true}
        dataAdFormat="auto"
      />
    );

    expect(consoleErrorMock).toHaveBeenCalledWith("adsbygoogle push failed");
  });
});
