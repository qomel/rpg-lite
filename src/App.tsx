import "./App.css";
import { useGame } from "./game/useGame";
import { useState } from "react";
import { BOSSES } from "./game/engine";
import type React from "react";
function rarityClass(r: string) {
  return `orb orb--${r}`;
}

function mobColor(key: string) {
  const map: Record<string, string> = {
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
    boss1: "#111", // Swamp King
    boss2: "#222", // Iron Beast
    boss3: "#333", // Void Wyrm
  };
  return map[key] ?? "#DDD";
}

// function formatItemStats(
//   stats?: Partial<{
//     maxHp: number;
//     strenght: number;
//     armor: number;
//     luck: number;
//   }>
// ) {
//   if (!stats) return "";
//   const parts: string[] = [];
//   if (stats.strenght) parts.push(`STR +${stats.strenght}`);
//   if (stats.armor) parts.push(`ARM +${stats.armor}`);
//   if (stats.maxHp) parts.push(`HP +${stats.maxHp}`);
//   if (stats.luck) parts.push(`LUCK +${stats.luck}`);
//   return parts.join(" • ");
// }

function slotPl(slot: string) {
  if (slot === "weapon") return "Broń";
  if (slot === "armor") return "Zbroja";
  if (slot === "charm") return "Amulet";
  return slot;
}

function rarityPl(r: string) {
  const map: Record<string, string> = {
    comon: "Pospolity",
    uncommon: "Niepospolity",
    rare: "Rzadki",
    epic: "Epicki",
    legendary: "Legendarny",
  };
  return map[r] ?? r;
}

function statsLinesPl(stats?: any) {
  if (!stats) return [];
  const lines: { k: string; v: number }[] = [];
  if (stats.strenght) lines.push({ k: "Siła", v: stats.strenght });
  if (stats.armor) lines.push({ k: "Pancerz", v: stats.armor });
  if (stats.maxHp) lines.push({ k: "Zdrowie", v: stats.maxHp });
  if (stats.luck) lines.push({ k: "Szczęście", v: stats.luck });
  return lines;
}

/**
 * Ustawia klasę pozycjonowania tooltipa, jeśli wychodzi poza ekran.
 * - default: środek
 * - jeśli overflow w lewo: align-left (tooltip rośnie w prawo)
 * - jeśli overflow w prawo: align-right (tooltip rośnie w lewo)
 */

function flipTooltipIfNeeded(wrapEl: HTMLElement | null) {
  if (!wrapEl) return;

  const tt = wrapEl.querySelector<HTMLElement>(".orbHoverName");
  if (!tt) return;

  wrapEl.classList.remove("orbWrap--tt-left", "orbWrap--tt-right");

  const prevOpcaity = tt.style.opacity;
  const prevVisibility = tt.style.visibility;
  const prevPointer = tt.style.pointerEvents;

  tt.style.opacity = "1";
  tt.style.visibility = "hidden";
  tt.style.pointerEvents = "none";

  void tt.offsetWidth;
  const tooltipWidth = tt.offsetWidth;
  const wrapRect = wrapEl.getBoundingClientRect();

  const pad = 8;
  const centerX = wrapRect.left + wrapRect.width / 2;

  // jeśli wyśrodkowny tooltip nie mieście się w
  if (centerX - tooltipWidth / 2 < pad) {
    wrapEl.classList.add("orbWrap--tt-left");
  } else if (centerX + tooltipWidth / 2 > window.innerWidth - pad) {
    wrapEl.classList.add("orbWrap--tt-right");
  }

  tt.style.visibility = prevVisibility;
  tt.style.opacity = prevOpcaity;
  tt.style.pointerEvents = prevPointer;
}

function showTooltip(e: any) {
  const wrap = e.currentTarget as HTMLElement;
  const tt = wrap.querySelector<HTMLElement>(".orbHoverName");
  if (!tt) return;

  tt.classList.add("tt--open");

  const anchor =
    wrap.querySelector<HTMLElement>(".orb[role='button'], .orb") ?? wrap;

  const a = anchor.getBoundingClientRect();

  // po pokazaniu mierzymy realny rozmiar
  const t = tt.getBoundingClientRect();

  const pad = 8;
  const gap = 8;

  // clamp do viewportu (to rozwiązuje uciekanie poza ekran)
  const desiredLeft = a.left + a.width / 2 - t.width / 2;
  const left = Math.min(
    Math.max(desiredLeft, pad),
    window.innerWidth - pad - t.width
  );

  // dół albo góra jeśli brak miejsca
  const belowTop = a.bottom + gap;
  const aboveTop = a.top - gap - t.height;
  const top =
    belowTop + t.height > window.innerHeight - pad
      ? Math.max(pad, aboveTop)
      : belowTop;

  tt.style.left = `${left}px`;
  tt.style.top = `${top}px`;
}

function hideTooltip(e: any) {
  const wrap = e.currentTarget as HTMLElement;
  const tt = wrap.querySelector<HTMLElement>(".orbHoverName");
  if (!tt) return;
  tt.classList.remove("tt--open");
}

export default function App() {
  const {
    player,
    mobs,
    selectedMob,
    fight,
    log,
    selectMob,
    attack,
    phase,
    cooldownLeft,
    selectionLocked,
    canAttack,
    statusLabel,
    inventory,
    equipment,
    equipItem,
    unequip,
    expToNext,
    maxAllowedMobLevel,
  } = useGame();

  const [enemyTab, setEnemyTab] = useState<"mobs" | "boss">("mobs");
  const enemies = enemyTab === "mobs" ? mobs : BOSSES;

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">RPG Lite</h1>
        <p className="app__subtitle">Turówka, Loot RNG</p>
      </header>

      <main className="layout">
        {/* LEFT: PLAYER */}
        <section className="panel">
          <h2 className="panel__title">Player</h2>

          <div className="kv">
            <span className="kv__k">HP</span>
            <span className="kv__v">
              {player.hp} / {player.maxHp}
            </span>
          </div>

          <div className="kv">
            <span className="kv__k">Level</span>
            <span className="kv__v">{player.level}</span>
            <span className="kv__k">EXP</span>
            <span className="kv__v">
              {player.exp} / {expToNext}
            </span>
          </div>

          <div className="kv">
            <span className="kv__k">Gold</span>
            <span className="kv__v">{player.gold}</span>
          </div>

          <div className="statsline">
            <span className="statsline__label">Stats</span>
            <span className="statsline__value">
              STR {player.strenght} <span className="dot">•</span> ARM{" "}
              {player.armor} <span className="dot">•</span> LUCK {player.luck}
            </span>
          </div>
          {/* EQUIPMENT */}
          <div className="invBlock">
            <div className="invTitle">Założone</div>

            <div className="orbRow">
              {(["weapon", "armor", "charm"] as const).map((slot) => {
                const it = equipment[slot];
                return (
                  <div
                    className="orbWrap"
                    key={slot}
                    onMouseEnter={showTooltip}
                    onMouseLeave={hideTooltip}
                  >
                    <div className="orbLabel">{slot}</div>

                    {it ? (
                      <>
                        <div
                          className={rarityClass(it.rarity)}
                          onDoubleClick={() => unequip(slot)}
                          role="button"
                          tabIndex={0}
                          aria-label={`${it.name}`}
                        />

                        <div className="orbHoverName">
                          <div className="tt__top">
                            <div className="tt__title">
                              {it.name}{" "}
                              <span className="tt__type">
                                ({slotPl(it.slot)})
                              </span>
                            </div>
                            <div className="tt__rarity">
                              {rarityPl(it.rarity)}
                            </div>
                          </div>

                          <div className="tt__stats">
                            {statsLinesPl(it.stats).length === 0 ? (
                              <div className="tt__muted">Brak statów</div>
                            ) : (
                              statsLinesPl(it.stats).map((s) => (
                                <div className="tt__statRow" key={s.k}>
                                  <span className="tt__statK">{s.k}:</span>
                                  <span className="tt__statV">{s.v}</span>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="tt__lvl">LVL {it.requiredLevel}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="orb orb--empty" />

                        <div className="orbHoverName">
                          <div className="tt__top">
                            <div className="tt__title">Puste</div>
                            <div className="tt__rarity">{slotPl(slot)}</div>
                          </div>
                          <div className="tt__lvl">LVL 0</div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="invHint">Double-click na kółko: zdejmij/załóż.</div>
          </div>

          {/* BACKPACK */}
          <div className="invBlock">
            <div className="invTitle">Plecak ({inventory.length})</div>

            {inventory.length === 0 ? (
              <div className="empty">Brak itemów. Farm loot z mobów.</div>
            ) : (
              <div className="orbRow orbRow--wrap">
                {inventory.map((it) => {
                  const canEquip = player.level >= it.requiredLevel;
                  return (
                    <div
                      className="orbWrap"
                      key={it.id}
                      onMouseEnter={showTooltip}
                      onMouseLeave={hideTooltip}
                    >
                      <div
                        className={`${rarityClass(it.rarity)} ${
                          !canEquip ? "orb--locked" : ""
                        }`}
                        onDoubleClick={() => canEquip && equipItem(it.id)}
                        title={
                          canEquip
                            ? `Załóż ${it.name}`
                            : `Wymaga lvl ${it.requiredLevel}`
                        }
                        role="button"
                        tabIndex={0}
                        aria-label={`${it.name}`}
                      />
                      <div className="orbHoverName">
                        <div className="tt__top">
                          <div className="tt__title">
                            {it.name}{" "}
                            <span className="tt__type">
                              ({slotPl(it.slot)})
                            </span>
                          </div>
                          <div className="tt__rarity">
                            {rarityPl(it.rarity)}
                          </div>
                        </div>

                        <div className="tt__stats">
                          {statsLinesPl(it.stats).map((s) => (
                            <div className="tt__statRow" key={s.k}>
                              <span className="tt__statK">{s.k}:</span>
                              <span className="tt__statV">{s.v}</span>
                            </div>
                          ))}
                        </div>

                        <div className="tt__lvl">LVL {it.requiredLevel}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CENTER: FIGHT */}
        <section className="panel panel--center">
          <div className="fightTop">
            <div className="fightPick">
              <div className="fightPick__label">Wybierz</div>
              <div className="fightPick__name">{selectedMob.name}</div>
              <div className="fightPick__meta">
                Mob HP: <strong>{fight.mobHp}</strong> / {selectedMob.maxHp}{" "}
                <span className="dot">•</span> Status:{" "}
                <strong>{statusLabel}</strong>
              </div>
            </div>

            <div className="fightActions">
              <button
                className="btn btn--primary"
                onClick={attack}
                disabled={!canAttack}
              >
                Atakuj
              </button>
              {/* Reset usunięty zgodnie z wymaganiem */}
            </div>
          </div>

          <div className="divider" />

          <div className="fightLog">
            <div className="fightLog__title">Przebieg walki</div>

            {log.length === 0 ? (
              <div className="empty">Wybierz moba i kliknij „Atakuj”.</div>
            ) : (
              <ul className="log">
                {log.map((line, i) => (
                  <li key={i} className="log__item">
                    {line}
                  </li>
                ))}
              </ul>
            )}

            {phase === "cooldown" && (
              <div className="defeatBox">
                <strong>Gracz został pokonany!</strong>
                <div>Powrót do walki za: {cooldownLeft}s</div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT: MOBS LIST */}
        <aside className="panel">
          <div className="panel__head">
            <div className="tabs">
              <button
                className={`tab ${enemyTab === "mobs" ? "tab--active" : ""}`}
                onClick={() => setEnemyTab("mobs")}
              >
                Mobs
              </button>
              <button
                className={`tab ${enemyTab === "boss" ? "tab--active" : ""}`}
                onClick={() => setEnemyTab("boss")}
              >
                Boss
              </button>
            </div>

            <p className="panel__hint">
              {selectionLocked
                ? "Nie możesz zmienić przeciwnika w trakcie walki."
                : enemyTab === "boss"
                ? "Bossy są znacznie silniejsze."
                : "Wybierz moba, żeby rozpocząć walkę."}
            </p>
          </div>

          <div
            className={`moblistWrap ${
              phase === "cooldown" ? "moblistWrap--blur" : ""
            }`}
          >
            {phase === "cooldown" && (
              <div className="mobOverlay">
                <div className="mobOverlay__box">{cooldownLeft}s</div>
              </div>
            )}

            <div className="moblist">
              {enemies.map((m) => {
                const active = m.id === selectedMob.id;

                const lockedByLevel = m.level > maxAllowedMobLevel; // 6.3
                const disabled = selectionLocked || lockedByLevel; // 6.3

                const title = selectionLocked
                  ? "Zakończ walkę, aby zmienić przeciwnika."
                  : lockedByLevel
                  ? `Za wysoki poziom. Masz L${player.level}. Możesz wybrać przeciwnika max L${maxAllowedMobLevel}.`
                  : `Wybierz ${m.name}`;

                return (
                  <button
                    key={m.id}
                    className={`mobrow ${active ? "mobrow--active" : ""} ${
                      lockedByLevel ? "mobrow--locked" : ""
                    }`}
                    onClick={() => selectMob(m)}
                    disabled={disabled}
                    title={title}
                  >
                    <div
                      className="mobrow__img"
                      style={{ background: mobColor(m.icon) }}
                      aria-hidden="true"
                    />
                    <div className="mobrow__body">
                      <div className="mobrow__name">
                        {m.name} <span className="badgeLvl">lvl {m.level}</span>
                      </div>

                      <div className="mobrow__meta">
                        HP: {m.maxHp} <span className="dot">•</span> ATK:{" "}
                        {m.mobAttack}
                      </div>

                      {lockedByLevel && (
                        <div className="mobrow__req">
                          Wymaga: max L{maxAllowedMobLevel}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </main>

      <footer className="footer">THEOTHERSITE © 2026 RPG Lite</footer>
    </div>
  );
}
