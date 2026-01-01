import "./App.css";
import { useGame } from "./game/useGame";

function App() {
  const {
    player,
    mobs,
    selectedMob,
    fight,
    log,
    selectMob,
    attack,
    resetPlayer,
  } = useGame();

  const fightStatus = fight.inProgress ? "Walka w toku" : "Walka zakończona";
  const canAttack = fight.inProgress && player.hp > 0 && fight.mobHp > 0;

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">RPG Lite</h1>
        <p className="app__subtitle">Turówka, Loot RNG</p>
      </header>

      <main className="grid">
        {/* Player Panel */}
        <section className="panel">
          <h2 className="panel__title">Player</h2>

          <div className="kv">
            <span className="kv__k">HP</span>
            <span className="kv__V">
              {player.hp} / {player.maxHp}{" "}
            </span>
          </div>

          <div className="kv">
            <span className="kv__k">Level</span>
            <span className="kv__V">{player.level}</span>
          </div>

          <div className="kv">
            <span className="kv__k">Gold</span>
            <span className="kv__V">{player.gold}</span>
          </div>

          <div className="statsline">
            <span className="statsline__label">Stats</span>
            <span className="statsline__value">
              STR {player.strenght} <span className="dot">•</span> ARM{" "}
              {player.armor} <span className="dot">•</span> LUCK {player.luck}
            </span>
          </div>

          <div className="actions">
            <button className="btn" onClick={resetPlayer}>
              Reset Player
            </button>
          </div>
        </section>

        {/* Mob List */}
        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Mobs</h2>
            <p className="panel__hint">
              Wybierz moba, żeby rozpocząc nową walkę
            </p>
          </div>

          <div className="mobgrid">
            {mobs.map((m) => {
              const active = m.id === selectedMob?.id;
              return (
                <button
                  key={m.id}
                  className={`mobcard ${active ? "mobcard--active" : ""}`}
                  onClick={() => selectMob(m)}
                >
                  <div className="mobcard__name">{m.name}</div>
                  <div className="mobcard__meta">
                    {" "}
                    HP: {m.maxHp} <span className="dot">•</span> ATK:{" "}
                    {m.mobAttack}
                  </div>
                  <div className="mobcard__meta">
                    EXP: {m.expReward} <span className="dot">•</span> Gold:{" "}
                    {m.goldMin}-{m.goldMax}
                  </div>
                  <div className="mobcard__sub">Loot x{m.lootMultiplier}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Fight Panel */}
        <section className="panel">
          <div className="fighthead">
            <div className="fighthead__left">
              <h2 className="panel__title">Wybierz</h2>
              <div className="fighthead__mob">{selectedMob.name}</div>
              <div className="fighthead__meta">
                <span>
                  Mob HP: <strong>{fight.mobHp}</strong> / {selectedMob.maxHp}
                </span>
                <span className="dot">•</span>
                <span>
                  Status: <strong>{fightStatus}</strong>
                </span>
              </div>
            </div>

            <div className="fighthead__actions">
              <button
                className="btn btn--primary"
                onClick={attack}
                disabled={!canAttack}
              >
                Atakuj
              </button>
              <button className="btn" onClick={() => selectMob(selectedMob)}>
                Reset
              </button>
            </div>
          </div>

          <div className="divider" />

          <h3 className="panel__subtitle">Przebieg walki</h3>
          {log.length === 0 ? (
            <div className="empty">Rozpocznij walke żeby zobaczyć przebieg</div>
          ) : (
            <ul className="log">
              {log.map((line, i) => (
                <li key={i} className="log__item">
                  {line}
                </li>
              ))}
            </ul>
          )}

          {player.hp === 0 && (
            <div className="warning">
              <strong>Gracz został pokonany!</strong>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">THEOTHERSITE © 2026 RPG Lite</footer>
    </div>
  );
}

export default App;
