import { describe, it, expect } from "vitest";
import { createNewPlayer, MOBS } from "../engine";
import { rollLoot } from "../loot";

describe("loot generation", () => {
  it("generated loot has valid rarity and price", () => {
    const p = createNewPlayer();
    const item = rollLoot(p, MOBS[2]);

    if (item) {
      expect(["common", "rare", "epic", "legendary"]).toContain(item.rarity);
      expect(item.sellPrice).toBeGreaterThan(0);
    }
  });
});
