import Artists from "./page";
import { IntlProvider } from "next-intl";
import messages from "../../../messages/en.json";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "../context/loading-content";
import { act } from "react";
import { getArtist, getFilteredArtists } from "@/pages/api/artists";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("../context/loading-content", () => ({
  useLoading: () => ({
    setIsLoading: jest.fn(),
    setLoadingBg: jest.fn(),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();

  global.fetch = jest.fn((url) => {
    if (url.includes("q=filtered")) {
      return Promise.resolve({
        json: () => Promise.resolve(getFilteredArtists()),
      });
    } else if (url.includes("q=")) {
      return Promise.resolve({
        json: () => Promise.resolve(getArtist("1")),
      });
    } else {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: [],
            totalPages: 1,
            totalResults: 0,
          }),
      });
    }
  }) as jest.Mock;
});

describe("Artists", () => {
  it("should render correctly", async () => {
    await act(async () => {
      render(
        <IntlProvider messages={messages} locale="en">
          <Artists />
        </IntlProvider>
      );
    });

    // const title = screen?.queryAllByText("Artists")[0]
    const pageButton = screen?.getByRole("button", { name: "1" });

    expect(pageButton).toBeInTheDocument();
  });

  it("should render correctly with useSearchParams", async () => {
    const mockSearchParams = new URLSearchParams("?q=3&p=1");
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    await act(async () => {
      render(
        <IntlProvider messages={messages} locale="en">
          <Artists />
        </IntlProvider>
      );
    });

    expect(useSearchParams).toHaveBeenCalled();
    expect(mockSearchParams.get("q")).toBe("3");
    expect(mockSearchParams.get("p")).toBe("1");
  });

  it("should change router when select new artist", async () => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    await act(async () => {
      render(
        <IntlProvider messages={messages} locale="en">
          <Artists />
        </IntlProvider>
      );
    });

    const tab = screen.getAllByRole("combobox", { name: "" })[0];

    await act(async () => {
      fireEvent.change(tab, { target: { value: "4" } });
    });

    expect(mockRouter.push).toHaveBeenCalledWith(`artists?q=${4}&p=${1}`);
    expect(tab).toHaveValue("4");
  });

  it("should change router when select new page", async () => {
    await act(async () => {
      render(
        <IntlProvider messages={messages} locale="en">
          <Artists />
        </IntlProvider>
      );
    });

    const page = screen.getByRole("button", { name: "2" });

    await act(async () => {
      page.click();
    });

    expect(useRouter).toHaveBeenCalled();
  });

  it("should render page with error", async () => {
    const mockError = new Error("Network error");
    global.fetch = jest.fn(() => Promise.reject(mockError));

    await act(async () => {
      render(
        <IntlProvider messages={messages} locale="en">
          <Artists />
        </IntlProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });
  });
});
