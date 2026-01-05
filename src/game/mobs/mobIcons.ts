const files = import.meta.glob("/src/assets/mobs/*.svg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function parseMobKey(path: string) {
  const file = path.split("/").pop() || "";
  const m = file.match(/^(.+?)(?:_(\d+))?\.svg$/i);
  if (!m) return null;
  const id = m[1];
  const frame = m[2] ? Number(m[2]) : 0;
  return { id, frame };
}

export type MobFramesMap = Record<string, string[]>;

export const MOB_FRAMES: MobFramesMap = (() => {
  const map: Record<string, { frame: number; url: string }[]> = {};

  for (const [path, url] of Object.entries(files)) {
    const parsed = parseMobKey(path);
    if (!parsed) continue;

    if (!map[parsed.id]) map[parsed.id] = [];
    map[parsed.id].push({ frame: parsed.frame, url });
  }

  const out: MobFramesMap = {};
  for (const [id, arr] of Object.entries(map)) {
    arr.sort((a, b) => a.frame - b.frame);
    out[id] = arr.map((x) => x.url);
  }

  return out;
})();
console.log("MOB_FRAMES keys:", Object.keys(MOB_FRAMES));
console.log("bat frames:", MOB_FRAMES["bat"]);
console.log("cave_bat frames:", MOB_FRAMES["cave_bat"]);
