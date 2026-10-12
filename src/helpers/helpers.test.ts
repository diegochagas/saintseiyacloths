import { getClothName, getName, getHistory, getSaintName, specialClothName } from "../helpers";
import { HistoryProps } from "@/pages/api/history";

// The helpers join optional fragments, which can produce double spaces;
// normalize so tests assert content rather than spacing quirks
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

describe("getClothName", () => {
  describe("en", () => {
    it("composes name, rank and class", () => {
      const name = getClothName({ name: "Pegasus", locale: "en", cls: "Cloth", rank: "Bronze", version: "" });

      expect(normalize(name)).toBe("Pegasus Bronze Cloth");
    });

    it("appends the version when given", () => {
      const name = getClothName({ name: "Pegasus", locale: "en", cls: "Cloth", rank: "Bronze", version: "V2" });

      expect(normalize(name)).toBe("Pegasus Bronze Cloth (V2)");
    });

    it("handles the Super and Synapse special cases", () => {
      expect(getClothName({ name: "Super", locale: "en", cls: "", rank: "", version: "" })).toBe("Super Black Cloth");
      expect(getClothName({ name: "Synapse", locale: "en", cls: "", rank: "", version: "" })).toBe(
        "Supreme Synapse Gold Cloth"
      );
    });
  });

  describe("pt/es", () => {
    it("composes class, rank and name", () => {
      const name = getClothName({ name: "Pégaso", locale: "pt", cls: "Armadura", rank: "Bronze", version: "" });

      expect(normalize(name)).toBe("Armadura de Bronze de Pégaso");
    });

    it("converts the Deus rank to Divina", () => {
      const name = getClothName({ name: "Pégaso", locale: "pt", cls: "Armadura", rank: "Deus", version: "" });

      expect(normalize(name)).toBe("Armadura Divina de Pégaso");
    });

    it("handles the Super and Synapse special cases", () => {
      expect(getClothName({ name: "Super", locale: "pt", cls: "", rank: "", version: "" })).toBe(
        "Super Armadura Negra"
      );
      expect(getClothName({ name: "Synapse", locale: "pt", cls: "", rank: "", version: "" })).toBe(
        "Suprema Armadura de Ouro Sinapse"
      );
      expect(getClothName({ name: "Synapse", locale: "es", cls: "", rank: "", version: "" })).toBe(
        "Armadura Dorada Suprema Synapse"
      );
    });
  });

  describe("fr", () => {
    it("composes class, rank and name", () => {
      const name = getClothName({ name: "Pégase", locale: "fr", cls: "Armure", rank: "Bronze", version: "" });

      expect(normalize(name)).toBe("Armure du Bronze du Pégase");
    });

    it("falls back to class and rank without a name", () => {
      const name = getClothName({ name: "", locale: "fr", cls: "Armure", rank: "Bronze", version: "V2" });

      expect(normalize(name)).toBe("Armure Bronze (V2)");
    });

    it("returns French text for the Super and Synapse special cases", () => {
      expect(getClothName({ name: "Super", locale: "fr", cls: "", rank: "", version: "" })).toBe(
        "Super Armure Noire"
      );
      expect(getClothName({ name: "Synapse", locale: "fr", cls: "", rank: "", version: "" })).toBe(
        "Suprême Armure d'Or Synapse"
      );
    });
  });
});

describe("getName", () => {
  it("returns the name alone when it matches the cloth name", () => {
    expect(getName({ name: "Seiya", clothName: "seiya", locale: "en", cls: "", version: "" })).toBe("Seiya");
    expect(getName({ name: "Seiya", clothName: "seiya", locale: "en", cls: "", version: "V2" })).toBe("Seiya (V2)");
  });

  describe("en", () => {
    it("prefixes the cloth name", () => {
      expect(getName({ name: "Seiya", clothName: "Pegasus", locale: "en", cls: "Saint", version: "", rank: "Bronze" })).toBe(
        "Pegasus Seiya"
      );
    });

    it("uses rank and class when name and cloth are missing", () => {
      expect(getName({ name: "", clothName: "", locale: "en", cls: "Saint", version: "", rank: "Bronze" })).toBe("Bronze Saint");
    });

    it("maps the Super and Synapse cloths", () => {
      expect(getName({ name: "Seiya", clothName: "Super", locale: "en", cls: "", version: "" })).toBe(
        "Super Black Cloth Seiya"
      );
      expect(getName({ name: "Shion", clothName: "Synapse", locale: "en", cls: "", version: "" })).toBe(
        "Supreme Synapse Gold Cloth Shion"
      );
    });
  });

  describe("pt/es", () => {
    it("joins name and cloth with 'de'", () => {
      expect(getName({ name: "Seiya", clothName: "Pegasus", locale: "pt", cls: "Cavaleiro", version: "" })).toBe(
        "Seiya de Pegasus"
      );
    });

    it("joins class and cloth when there is no name", () => {
      expect(getName({ name: "", clothName: "Pegasus", locale: "pt", cls: "Cavaleiro", version: "" })).toBe(
        "Cavaleiro de Pegasus"
      );
    });

    it("maps the Synapse cloth", () => {
      expect(getName({ name: "Shion", clothName: "Synapse", locale: "pt", cls: "", version: "" })).toBe(
        "Shion de Suprema Armadura de Ouro Sinapse"
      );
    });
  });

  describe("fr", () => {
    it("joins name and cloth with 'du'", () => {
      expect(getName({ name: "Seiya", clothName: "Pégase", locale: "fr", cls: "Chevalier", version: "" })).toBe(
        "Seiya du Pégase"
      );
    });

    it("joins class and cloth when there is no name", () => {
      // regression: this case used to fall through to the English format
      expect(getName({ name: "", clothName: "Pégase", locale: "fr", cls: "Chevalier", version: "" })).toBe(
        "Chevalier de Pégase"
      );
    });

    it("maps the Super cloth to French text", () => {
      expect(getName({ name: "Ikki", clothName: "Super", locale: "fr", cls: "", version: "" })).toBe(
        "Ikki du Super Armure Noire"
      );
    });
  });
});

describe("specialClothName", () => {
  it("translates the Super and Synapse cloths per locale", () => {
    expect(specialClothName("Super", "pt")).toBe("Super Armadura Negra");
    expect(specialClothName("Synapse", "es")).toBe("Armadura Dorada Suprema Synapse");
  });

  it("falls back to English for an unknown locale", () => {
    expect(specialClothName("Super", "de")).toBe("Super Black Cloth");
  });

  it("returns undefined for a regular cloth", () => {
    expect(specialClothName("Pegasus", "en")).toBeUndefined();
  });
});

describe("getSaintName", () => {
  const t = (key: string, values?: { count: number }) =>
    values ? `${key}#${values.count}` : `t:${key}`;

  it("translates class, version and rank before composing the name", () => {
    const name = getSaintName(
      { name: "Seiya", cloth: "Pegasus", saintClass: "saints", version: "v2", rank: "bronze" },
      "en",
      t,
    );

    expect(name).toBe("Pegasus Seiya (t:v2)");
  });

  it("ignores the basic placeholder cloth", () => {
    expect(getSaintName({ cloth: "basic", saintClass: "saints", rank: "bronze" }, "en", t)).toBe(
      "t:bronze saints#1",
    );
  });

  it("handles a saint with no fields at all", () => {
    expect(getSaintName({}, "en", t)).toBe(" ");
  });
});

describe("getHistory", () => {
  const t = (key: string) => key;

  it("returns neverReleased without a history", () => {
    expect(getHistory(t)).toBe("neverReleased");
  });

  it("returns the history name with its media", () => {
    const history = {
      name: "someHistory",
      midia: { name: "someMidia" },
    } as HistoryProps;

    expect(getHistory(t, history)).toBe("someHistory (someMidia)");
  });

  it("does not repeat the label when history and media match", () => {
    const history = {
      name: "neverReleased",
      midia: { name: "neverReleased" },
    } as HistoryProps;

    expect(getHistory(t, history)).toBe("neverReleased");
  });
});
