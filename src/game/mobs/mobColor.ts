const MOB_COLOR_MAP: Record<string, string> = {
  // Kolory Mobów (01-20)
  slime: "#7CFF8A",
  rat: "#B9B9B9",
  bat: "#A18F7C",
  spider: "#9B7CFF",
  wolf: "#7C9BFF",
  bandit: "#FFB36B",
  skeleton: "#E1E1E1",
  ghoul: "#7C9A71",
  mage: "#7CFFEE",
  ogre: "#8FD3FF",
  wraith: "#B3B3B3",
  knight: "#FFD700",
  golem: "#8B4513",
  harpy: "#FF7CB9",
  wyrm: "#D7A7FF",
  cultist: "#800000",
  assassin: "#36454F",
  wyvern: "#556B2F",
  demon: "#FF4500",
  ancient: "#4682B4",

  // Kolory Bossów (według pola icon)
  boss1: "#111",
  boss2: "#222",
  boss3: "#333",
};

export function mobColor(key: string) {
  const k = key.trim().toLowerCase().replace(/\s+/g, "_");
  return MOB_COLOR_MAP[k] ?? "#DDD";
}

export { MOB_COLOR_MAP };
