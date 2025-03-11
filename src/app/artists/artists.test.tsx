import Artists from "./page";
import { IntlProvider } from "next-intl";
import messages from "../../../messages/en.json";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "../context/loading-content";
import { act } from "react";
// import { artistMock, artistsMock } from "@/mocks/artists-mock";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  useSearchParams: jest.fn(),
}));

// // Mock loading context
// jest.mock("../context/loading-content", () => ({
//   useLoading: jest.fn(() => ({
//     setIsLoading: jest.fn(),
//     setLoadingBg: jest.fn(),
//   })),
// }));

beforeEach(() => {
  jest.clearAllMocks();

  global.fetch = jest.fn((url) => {
    if (url.includes("q=filtered")) {
      return Promise.resolve({
        // json: () => Promise.resolve(artistsMock),
      });
    } else if (url.includes("?p=")) {
      return Promise.resolve({
        // json: () => Promise.resolve(artistMock),
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

  // it("should render correctly for the first page", async () => {
  //   const mockUseSearchParams = require("next/navigation").useSearchParams;
  //   mockUseSearchParams.mockReturnValue(new URLSearchParams("?p=5&q=0"));

  //   await act(async () => {
  //     render(
  //       <IntlProvider messages={messages} locale="en">
  //         <Artists />
  //       </IntlProvider>
  //     );
  //   });

  //   const title = screen?.queryAllByText("Artists")[0];

  //   expect(title).toBeInTheDocument();
  // });
});
