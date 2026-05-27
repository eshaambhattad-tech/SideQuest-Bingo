export default function PlayerTabs({ players, activePlayer, onSelectPlayer, winners }) {
  return (
    <div className="player-tabs">
      {players.map((player) => (
        <button
          key={player}
          className={`player-tab${activePlayer === player ? ' active' : ''}`}
          onClick={() => onSelectPlayer(player)}
        >
          {player}
          {winners.includes(player) && (
            <span className="win-badge">BINGO!</span>
          )}
        </button>
      ))}
    </div>
  )
}
