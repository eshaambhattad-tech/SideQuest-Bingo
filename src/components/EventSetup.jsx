export default function EventSetup({
  eventName, setEventName,
  eventDescription, setEventDescription,
  players, setPlayers,
  onGenerate, loading, error,
}) {
  function updatePlayer(index, value) {
    const next = [...players]
    next[index] = value
    setPlayers(next)
  }

  function addPlayer() {
    if (players.length < 8) setPlayers([...players, `Player ${players.length + 1}`])
  }

  function removePlayer(index) {
    setPlayers(players.filter((_, i) => i !== index))
  }

  const canGenerate = eventName.trim() && !loading

  return (
    <div className="setup-screen">
      <div className="setup-logo">🎯</div>
      <div>
        <h1 className="setup-title">SideQuest Bingo</h1>
        <p className="setup-subtitle">Gamify your event. One square at a time.</p>
      </div>

      <div className="setup-form">
        <div className="form-group">
          <label htmlFor="event-name">Event Name</label>
          <input
            id="event-name"
            type="text"
            placeholder="e.g. TechCrunch Disrupt, Company Retreat..."
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canGenerate && onGenerate()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="event-desc">Context (optional)</label>
          <textarea
            id="event-desc"
            rows={3}
            placeholder="e.g. a startup pitch competition, a holiday office party, a college orientation..."
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Players ({players.length}/8)</label>
          <div className="player-list">
            {players.map((player, i) => (
              <div key={i} className="player-entry">
                <input
                  type="text"
                  placeholder={`Player ${i + 1}`}
                  value={player}
                  onChange={(e) => updatePlayer(i, e.target.value)}
                />
                {players.length > 1 && (
                  <button
                    className="btn-remove-player"
                    onClick={() => removePlayer(i)}
                    aria-label="Remove player"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {players.length < 8 && (
              <button className="btn-add-player" onClick={addPlayer}>
                + Add Player
              </button>
            )}
          </div>
        </div>

        <button
          className={`btn-generate${loading ? ' loading' : ''}`}
          onClick={onGenerate}
          disabled={!canGenerate}
        >
          {loading ? 'Generating...' : '✨ Generate Bingo Board'}
        </button>
      </div>

      {error && <div className="error-toast">{error}</div>}
    </div>
  )
}
