import { getClothName } from "../helpers";

describe("Helpers test", () => {
  const t = (key: string) => key;

  it("should get the cloth name", () => {
    const name = getClothName("name", "en", "class", "rank", "version");

    expect(name).toBe("cloth");
  });

  it("should geet composed cloth name", () => {
    const name = getClothName("name", "en", "class", "rank", "version");

    expect(name).toBe("cloth (anime)");
  });

  it("should get unknown cloth name", () => {
    const name = getClothName("name", "en", "class", "rank", "version");

    expect(name).toBe("unknown");
  });
});
