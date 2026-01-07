import { pickByWeight, randInt } from "./rng";

// Feature: MAPA / STAGE / PLACE
// Ten moduł jest celowo niezależny od walki/questów/teleportów.

export type MapId = "cave"; // na start jedna mapa; kolejne dodamy później
export type StageIndex = 1 | 2 | 3 | 4;

export type RoomKind = "spawn" | "empty" | "mob" | "loot" | "exit";
export type RoomId = `${number},${number}`;

export type Room = {
  id: RoomId;
  x: number;
  y: number;
  kind: RoomKind;
  discovered: boolean;
  cleared?: boolean; // np. mob zabity
  mobId?: string; // jeśli kind === 'mob'
};

export type Stage = {
  mapId: MapId;
  stage: StageIndex;
  size: number; // np. 5
  rooms: Record<RoomId, Room>;
  spawnId: RoomId;
  exitId: RoomId;
};

export type CreateStageOpts = {
  // lista id mobów możliwych w danym STAGE
  mobIds?: string[];
};

export type PlayerPos = {
  mapId: MapId;
  stage: StageIndex;
  roomId: RoomId;
};

export type Dir = "up" | "down" | "left" | "right";

export function roomId(x: number, y: number): RoomId {
  return `${x},${y}`;
}

export function parseRoomId(id: RoomId): { x: number; y: number } {
  const [xs, ys] = id.split(",");
  return { x: Number(xs), y: Number(ys) };
}

export function neighborId(id: RoomId, dir: Dir, size: number): RoomId | null {
  const { x, y } = parseRoomId(id);
  const nx = dir === "left" ? x - 1 : dir === "right" ? x + 1 : x;
  const ny = dir === "up" ? y - 1 : dir === "down" ? y + 1 : y;
  if (nx < 0 || ny < 0 || nx >= size || ny >= size) return null;
  return roomId(nx, ny);
}

type StageWeights = {
  empty: number;
  mob: number;
  loot: number;
};

// bardzo “game-feel” na start: dużo mobów, mało pustych
const DEFAULT_WEIGHTS: Record<StageIndex, StageWeights> = {
  1: { mob: 70, empty: 25, loot: 5 },
  2: { mob: 72, empty: 22, loot: 6 },
  3: { mob: 74, empty: 20, loot: 6 },
  4: { mob: 76, empty: 18, loot: 6 },
};

export function createStage(
  mapId: MapId,
  stage: StageIndex,
  size = 5,
  opts: CreateStageOpts = {}
): Stage {
  // 1) losuj spawn i exit w dwóch różnych miejscach
  const sx = randInt(0, size - 1);
  const sy = randInt(0, size - 1);
  const spawnId = roomId(sx, sy);

  let ex = randInt(0, size - 1);
  let ey = randInt(0, size - 1);
  while (ex === sx && ey === sy) {
    ex = randInt(0, size - 1);
    ey = randInt(0, size - 1);
  }
  const exitId = roomId(ex, ey);

  const weights = DEFAULT_WEIGHTS[stage];

  const rooms: Record<RoomId, Room> = {};
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const id = roomId(x, y);

      let kind: RoomKind;
      let mobId: string | undefined;
      if (id === spawnId) kind = "spawn";
      else if (id === exitId) kind = "exit";
      else {
        const pick = pickByWeight([
          { kind: "mob" as const, weight: weights.mob },
          { kind: "empty" as const, weight: weights.empty },
          { kind: "loot" as const, weight: weights.loot },
        ]);
        kind = pick.kind;
        if (kind === "mob" && opts.mobIds?.length) {
          mobId = opts.mobIds[randInt(0, opts.mobIds.length - 1)];
        }
      }

      rooms[id] = {
        id,
        x,
        y,
        kind,
        discovered: id === spawnId,
        cleared: id === spawnId || id === exitId ? true : false,
        mobId,
      };
    }
  }

  // spawn i exit zawsze “odkryte”/czyste na start
  rooms[spawnId].discovered = true;
  rooms[spawnId].cleared = true;
  rooms[exitId].discovered = false;
  rooms[exitId].cleared = true;

  return {
    mapId,
    stage,
    size,
    rooms,
    spawnId,
    exitId,
  };
}

export function moveWithinStage(stage: Stage, pos: PlayerPos, dir: Dir): PlayerPos {
  const nextId = neighborId(pos.roomId, dir, stage.size);
  if (!nextId) return pos;
  if (!stage.rooms[nextId]) return pos;
  return { ...pos, roomId: nextId };
}

export function markDiscovered(stage: Stage, roomId: RoomId): Stage {
  const room = stage.rooms[roomId];
  if (!room || room.discovered) return stage;
  return {
    ...stage,
    rooms: {
      ...stage.rooms,
      [roomId]: { ...room, discovered: true },
    },
  };
}

export function clearRoom(stage: Stage, roomId: RoomId): Stage {
  const room = stage.rooms[roomId];
  if (!room) return stage;
  if (room.cleared) return stage;
  return {
    ...stage,
    rooms: {
      ...stage.rooms,
      [roomId]: { ...room, cleared: true },
    },
  };
}
