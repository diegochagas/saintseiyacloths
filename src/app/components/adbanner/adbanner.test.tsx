import { render } from "@testing-library/react";
import AdBanner from ".";
import AdBannerContent from "./content";

const setNodeEnv = (env: string) => {
  Object.defineProperty(process, "env", {
    value: {
      NODE_ENV: env,
    },
  });
};

describe("AdBanner", () => {
  it("should render correctly in dev", () => {
    const wrapper = render(<AdBanner dataAdSlot={""} />);

    const banner = wrapper.getByTestId("ad-banner");

    expect(banner).toBeInTheDocument();
  });

  it("should render correclty in production", () => {
    setNodeEnv("production");

    const wrapper = render(<AdBanner dataAdSlot={""} />);

    const banner = wrapper.getByTestId("ad-banner");

    expect(banner).toBeInTheDocument();
  });

  it("should render with error", () => {
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
      <AdBannerContent
        dataAdSlot={""}
        dataAdFormat={""}
        dataFullWidthResponsive={false}
      />
    );

    expect(consoleErrorMock).toHaveBeenCalledWith("adsbygoogle push failed");
  });
});
