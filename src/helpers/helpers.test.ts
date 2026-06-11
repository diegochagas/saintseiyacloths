import { getClothName, getName, getHistory } from "../helpers";
import { HistoryProps } from "@/pages/api/history";

// The helpers join optional fragments, which can produce double spaces;
// normalize so tests assert content rather than spacing quirks
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

describe("getClothName", () => {
  describe("en", () => {
    it("composes name, rank and class", () => {
      const name = getClothName("Pegasus", "en", "Cloth", "Bronze", "");

      expect(normalize(name)).toBe("Pegasus Bronze Cloth");
    });

    it("appends the version when given", () => {
      const name = getClothName("Pegasus", "en", "Cloth", "Bronze", "V2");

      expect(normalize(name)).toBe("Pegasus Bronze Cloth (V2)");
    });

    it("handles the Super and Synapse special cases", () => {
      expect(getClothName("Super", "en", "", "", "")).toBe("Super Black Cloth");
      expect(getClothName("Synapse", "en", "", "", "")).toBe(
        "Supreme Synapse Gold Cloth"
      );
    });
  });

  describe("pt/es", () => {
    it("composes class, rank and name", () => {
      const name = getClothName("Pégaso", "pt", "Armadura", "Bronze", "");

      expect(normalize(name)).toBe("Armadura de Bronze de Pégaso");
    });

    it("converts the Deus rank to Divina", () => {
      const name = getClothName("Pégaso", "pt", "Armadura", "Deus", "");

      expect(normalize(name)).toBe("Armadura Divina de Pégaso");
    });

    it("handles the Super and Synapse special cases", () => {
      expect(getClothName("Super", "pt", "", "", "")).toBe(
        "Super Armadura Negra"
      );
      expect(getClothName("Synapse", "pt", "", "", "")).toBe(
        "Suprema Armadura de Ouro Sinapse"
      );
      expect(getClothName("Synapse", "es", "", "", "")).toBe(
        "Armadura Dorada Suprema Synapse"
      );
    });
  });

  describe("fr", () => {
    it("composes class, rank and name", () => {
      const name = getClothName("Pégase", "fr", "Armure", "Bronze", "");

      expect(normalize(name)).toBe("Armure du Bronze du Pégase");
    });

    it("falls back to class and rank without a name", () => {
      const name = getClothName("", "fr", "Armure", "Bronze", "V2");

      expect(normalize(name)).toBe("Armure Bronze (V2)");
    });

    it("returns French text for the Super and Synapse special cases", () => {
      expect(getClothName("Super", "fr", "", "", "")).toBe(
        "Super Armure Noire"
      );
      expect(getClothName("Synapse", "fr", "", "", "")).toBe(
        "Suprême Armure d'Or Synapse"
      );
    });
  });
});

describe("getName", () => {
  it("returns the name alone when it matches the cloth name", () => {
    expect(getName("Seiya", "seiya", "en", "", "")).toBe("Seiya");
    expect(getName("Seiya", "seiya", "en", "", "V2")).toBe("Seiya (V2)");
  });

  describe("en", () => {
    it("prefixes the cloth name", () => {
      expect(getName("Seiya", "Pegasus", "en", "Saint", "", "Bronze")).toBe(
        "Pegasus Seiya"
      );
    });

    it("uses rank and class when name and cloth are missing", () => {
      expect(getName("", "", "en", "Saint", "", "Bronze")).toBe("Bronze Saint");
    });

    it("maps the Super and Synapse cloths", () => {
      expect(getName("Seiya", "Super", "en", "", "")).toBe(
        "Super Black Cloth Seiya"
      );
      expect(getName("Shion", "Synapse", "en", "", "")).toBe(
        "Supreme Synapse Gold Cloth Shion"
      );
    });
  });

  describe("pt/es", () => {
    it("joins name and cloth with 'de'", () => {
      expect(getName("Seiya", "Pegasus", "pt", "Cavaleiro", "")).toBe(
        "Seiya de Pegasus"
      );
    });

    it("joins class and cloth when there is no name", () => {
      expect(getName("", "Pegasus", "pt", "Cavaleiro", "")).toBe(
        "Cavaleiro de Pegasus"
      );
    });

    it("maps the Synapse cloth", () => {
      expect(getName("Shion", "Synapse", "pt", "", "")).toBe(
        "Shion de Suprema Armadura de Ouro Sinapse"
      );
    });
  });

  describe("fr", () => {
    it("joins name and cloth with 'du'", () => {
      expect(getName("Seiya", "Pégase", "fr", "Chevalier", "")).toBe(
        "Seiya du Pégase"
      );
    });

    it("joins class and cloth when there is no name", () => {
      // regression: this case used to fall through to the English format
      expect(getName("", "Pégase", "fr", "Chevalier", "")).toBe(
        "Chevalier de Pégase"
      );
    });

    it("maps the Super cloth to French text", () => {
      expect(getName("Ikki", "Super", "fr", "", "")).toBe(
        "Ikki du Super Armure Noire"
      );
    });
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
