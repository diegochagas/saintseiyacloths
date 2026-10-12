export interface Pantheon {
  labelKey: string;
  accent: string;
  groupIds: string[];
}

export const pantheons: Pantheon[] = [
  {
    labelKey: "teogoniaGreekOlympians",
    accent: "bg-blue-800",
    groupIds: [
      "zeus-gods",
      "athena-gods",
      "poseidon-gods",
      "hades-gods",
      "hades-pluton-facelessgods",
      "hades-brother-gods",
      "hades-dream-gods",
      "apollo-gods",
      "apollo-abel-gods",
      "apollo-golden-warriors-gods",
      "artemis-gods",
      "ares-gods",
      "ares-mars-gods",
      "ares-mars-heavenly-kings",
      "eris-gods",
      "eris-phantoms",
    ],
  },
  {
    labelKey: "teogoniaGreekTitansPrimordials",
    accent: "bg-emerald-800",
    groupIds: [
      "chronos-gods",
      "cronus-titans-1",
      "pontos-primordial-gods",
      "typhon-gods",
      "astraea-gods",
      "pallas-gods",
      "nemesis-gods",
    ],
  },
  {
    labelKey: "teogoniaNordicMythology",
    accent: "bg-indigo-800",
    groupIds: ["odin-gods"],
  },
  {
    labelKey: "teogoniaEgyptianMythology",
    accent: "bg-amber-700",
    groupIds: ["ra-egyptian-gods"],
  },
  {
    labelKey: "teogoniaAztecMythology",
    accent: "bg-orange-800",
    groupIds: ["tezcatlipoca-gods"],
  },
  {
    labelKey: "teogoniaCelticArthurianLegend",
    accent: "bg-teal-800",
    groupIds: ["balor-gods", "arthur-gladiators-king"],
  },
  {
    labelKey: "teogoniaMesopotamianMythology",
    accent: "bg-red-900",
    groupIds: ["apsu-anunnakis"],
  },
  {
    labelKey: "teogoniaOriginalDeities",
    accent: "bg-purple-800",
    groupIds: ["garnet-vampire", "bellatrix-gods", "lamech-gods", "hakuryu-gods"],
  },
];
