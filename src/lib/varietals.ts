export type Varietal = {
  id: string;
  name: string;
  kind: string;
  year: string;
  abv: string;
  region: string;
  tagline: string;
  notes: string[];
  /** wine liquid / accent colour as hex */
  accent: string;
  /** subtle glass tint as hex */
  glassTint: string;
};

export const VARIETALS: Varietal[] = [
  {
    id: "obsidian",
    name: "Obsidian",
    kind: "Reserve Cabernet Sauvignon",
    year: "2021",
    abv: "14.5%",
    region: "Napa Valley, single vineyard",
    tagline: "Aged in shadow for thirty months.",
    notes: ["Black cherry", "Cedar smoke", "Crushed violet", "Dark chocolate"],
    accent: "#5b0e2d",
    glassTint: "#1a0710",
  },
  {
    id: "lumiere",
    name: "Lumière",
    kind: "Blanc de Blancs",
    year: "2021",
    abv: "12.0%",
    region: "Adelaide Hills, high-elevation",
    tagline: "A single ray, captured in glass.",
    notes: ["White peach", "Citrus blossom", "Wet flint", "Toasted brioche"],
    accent: "#e6c878",
    glassTint: "#14120a",
  },
];
