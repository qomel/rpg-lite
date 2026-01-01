import "./App.css";
import { useGame } from "./game/useGame";

function mobColor(id: string) {
  // placeholder 52x52 "img" jako kolor
  const map: Record<string, string> = {
    slime: "#7CFF8A",
    rat: "#B9B9B9",
    bandit: "#FFB36B",
    ogre: "#8FD3FF",
    wyrm: "#D7A7FF",
    dragon: "#FF7C7C",
  };
  return map[id] ?? "#DDD";
}

function rarityClass(r: string) {
  return `orb orb--${r}`;
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
  } = useGame();

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
            <h2 className="panel__title">Mobs</h2>
            <p className="panel__hint">
              {selectionLocked
                ? "Nie możesz zmienić moba w trakcie walki."
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
              {mobs.map((m) => {
                const active = m.id === selectedMob.id;
                const disabled = selectionLocked;

                return (
                  <button
                    key={m.id}
                    className={`mobrow ${active ? "mobrow--active" : ""}`}
                    onClick={() => selectMob(m)}
                    disabled={disabled}
                    title={
                      disabled
                        ? "Zakończ walkę, aby zmienić moba."
                        : `Wybierz ${m.name}`
                    }
                  >
                    <div
                      className="mobrow__img"
                      style={{ background: mobColor(m.id) }}
                      aria-hidden="true"
                    />
                    <div className="mobrow__body">
                      <div className="mobrow__name">{m.name}</div>
                      <div className="mobrow__meta">
                        HP: {m.maxHp} <span className="dot">•</span> ATK:{" "}
                        {m.mobAttack} <span className="dot">•</span> EXP:{" "}
                        {m.expReward}
                      </div>
                      <div className="mobrow__sub">
                        Gold: {m.goldMin}-{m.goldMax}{" "}
                        <span className="dot">•</span> Loot x{m.lootMultiplier}
                      </div>
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
