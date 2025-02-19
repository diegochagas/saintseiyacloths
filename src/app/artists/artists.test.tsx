import Artists from "./page";
import { IntlProvider } from "next-intl";
import messages from "../../../messages/en.json";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "../context/loading-content";
import { act } from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  useSearchParams: jest.fn(() => new URLSearchParams("?q=1&p=1")),
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

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: "1",
            name: "official",
            official: {
              id: "1",
              name: "official",
            },
            site: "https://kurumadapro.com/blog/",
          },
        ]),
    })
  ) as jest.Mock;
});

describe("Artists", () => {
  it("should render correctly", async () => {
    let wrapper: any;

    await act(async () => {
      wrapper = render(
        <IntlProvider messages={messages} locale="en">
          <Artists />
        </IntlProvider>
      );
    });

    const title = wrapper?.queryAllByText("Artists")[0];

    expect(title).toBeInTheDocument();
  });
});
