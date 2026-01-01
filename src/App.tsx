import { useGame } from "./game/useGame.ts";

function App() {
  const { player, mobs, log, attack } = useGame();

  return (
    <div style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1>RPG Lite</h1>

      <section>
        <h2>Gracz</h2>
        <div>
          HP: {player.hp} / {player.maxHp}
        </div>
        <div>Poziom: {player.level}</div>
        <div>EXP: {player.exp}</div>
        <div>Złoto: {player.gold}</div>
        <div>
          STR: {player.strenght} | ARM: {player.armor} | LUCK: {player.luck}
        </div>
      </section>

      <section>
        <h2>Mobs</h2>
        {mobs.map((m) => (
          <button
            key={m.id}
            onClick={() => attack(m)}
            style={{ display: "block", margin: "4px 0" }}
          >
            Attack {m.name}
          </button>
        ))}
      </section>

      <section>
        <h2>Log Walki</h2>
        <ul>
          {log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
