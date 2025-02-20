import { saintMock } from "./classes-mock";

export const artist = {
  id: "1",
  name: "Test",
  official: {
    id: "1",
    name: "official",
  },
  site: "https://test.com",
};

export const artistMock = {
  ...artist,
  data: [saintMock],
};

export const artistsMock = [artist];
