import "./App.css";
import { useGame } from "./game/useGame";
import { useState } from "react";
import { BOSSES } from "./game/engine";

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
                  <div className="orbWrap" key={slot}>
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
                          <div className="tt__name">{it.name}</div>
                          <div className="tt__meta">
                            {it.rarity} • {it.slot}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="orb orb--empty" />
                        <div className="orbHoverName">
                          <div className="tt__name">Puste</div>
                          <div className="tt__meta">{slot}</div>
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
                {inventory.map((it) => (
                  <div className="orbWrap" key={it.id}>
                    <div
                      className={rarityClass(it.rarity)}
                      onDoubleClick={() => equipItem(it.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${it.name}`}
                    />
                    <div className="orbHoverName">
                      <div className="tt__name">{it.name}</div>
                      <div className="tt__meta">
                        {it.rarity} • {it.slot}
                      </div>
                    </div>
                  </div>
                ))}
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
