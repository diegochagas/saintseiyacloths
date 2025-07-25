import { getClothName } from "../helpers";

describe("Helpers test", () => {
  const t = (key: string) => key;

  it("should get the cloth name", () => {
    const name = getClothName(t, ["cloth"]);

    expect(name).toBe("cloth");
  });

  it("should geet composed cloth name", () => {
    const name = getClothName(t, ["cloth", "anime"]);

    expect(name).toBe("cloth (anime)");
  });

  it("should get unknown cloth name", () => {
    const name = getClothName(t);

    expect(name).toBe("unknown");
  });
});
