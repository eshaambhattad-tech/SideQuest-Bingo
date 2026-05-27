export default function WinBanner({ winner, onClose, onRegenerate }) {
  return (
    <div className="win-banner" onClick={onClose}>
      <div className="win-banner-card" onClick={(e) => e.stopPropagation()}>
        <div className="win-emoji">🎉</div>
        <h2>BINGO!</h2>
        <p className="winner-name">
          <strong>{winner}</strong> got five in a row!
        </p>
        <div className="win-banner-actions">
          <button className="btn-play-again" onClick={onClose}>
            Keep Playing
          </button>
          <button className="btn-new-board" onClick={onRegenerate}>
            New Board
          </button>
        </div>
      </div>
    </div>
  )
}
