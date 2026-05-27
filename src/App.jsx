import { useState } from 'react'
import './App.css'
import EventSetup from './components/EventSetup'
import BingoBoard from './components/BingoBoard'
import PlayerTabs from './components/PlayerTabs'
import WinBanner from './components/WinBanner'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  // Ensure FREE SPACE is always at center (index 12)
  const freeIdx = a.indexOf('FREE SPACE')
  if (freeIdx !== 12) {
    [a[freeIdx], a[12]] = [a[12], a[freeIdx]]
  }
  return a
}

function checkBingo(markedArr) {
  const m = (i) => markedArr[i]
  // rows
  for (let r = 0; r < 5; r++) {
    if ([0,1,2,3,4].every(c => m(r * 5 + c))) return true
  }
  // columns
  for (let c = 0; c < 5; c++) {
    if ([0,1,2,3,4].every(r => m(r * 5 + c))) return true
  }
  // diagonals
  if ([0,6,12,18,24].every(m)) return true
  if ([4,8,12,16,20].every(m)) return true
  return false
}

export default function App() {
  const [view, setView] = useState('setup')
  const [eventName, setEventName] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [players, setPlayers] = useState(['Player 1'])
  const [items, setItems] = useState([])
  const [boards, setBoards] = useState({})
  const [marked, setMarked] = useState({})
  const [activePlayer, setActivePlayer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [winners, setWinners] = useState([])
  const [bannerWinner, setBannerWinner] = useState(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, eventDescription }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')

      const newBoards = {}
      const newMarked = {}
      for (const player of players) {
        const board = shuffle(data.items)
        newBoards[player] = board
        const m = new Array(25).fill(false)
        m[12] = true // FREE SPACE
        newMarked[player] = m
      }

      setItems(data.items)
      setBoards(newBoards)
      setMarked(newMarked)
      setWinners([])
      setBannerWinner(null)
      setActivePlayer(players[0])
      setView('game')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleMarkSquare(squareIndex) {
    if (squareIndex === 12) return // FREE SPACE
    const playerMarked = [...marked[activePlayer]]
    playerMarked[squareIndex] = !playerMarked[squareIndex]

    const newMarked = { ...marked, [activePlayer]: playerMarked }
    setMarked(newMarked)

    if (checkBingo(playerMarked) && !winners.includes(activePlayer)) {
      const newWinners = [...winners, activePlayer]
      setWinners(newWinners)
      setBannerWinner(activePlayer)
    }
  }

  function handleBack() {
    setView('setup')
    setItems([])
    setBoards({})
    setMarked({})
    setWinners([])
    setBannerWinner(null)
    setError(null)
  }

  return (
    <div className="app">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p>Generating your bingo board...</p>
        </div>
      )}

      {bannerWinner && (
        <WinBanner
          winner={bannerWinner}
          onClose={() => setBannerWinner(null)}
          onRegenerate={() => { setBannerWinner(null); generate() }}
        />
      )}

      {view === 'setup' ? (
        <EventSetup
          eventName={eventName}
          setEventName={setEventName}
          eventDescription={eventDescription}
          setEventDescription={setEventDescription}
          players={players}
          setPlayers={setPlayers}
          onGenerate={generate}
          loading={loading}
          error={error}
        />
      ) : (
        <div className="game-screen">
          <div className="game-header">
            <span className="game-event-name">🎯 {eventName}</span>
            <div className="header-buttons">
              <button className="btn-regenerate" onClick={generate}>↻ Regenerate</button>
              <button className="btn-back" onClick={handleBack}>← Setup</button>
            </div>
          </div>

          <PlayerTabs
            players={players}
            activePlayer={activePlayer}
            onSelectPlayer={setActivePlayer}
            winners={winners}
          />

          {boards[activePlayer] && (
            <BingoBoard
              board={boards[activePlayer]}
              marked={marked[activePlayer]}
              onMark={handleMarkSquare}
              playerName={activePlayer}
            />
          )}

          {error && <div className="error-toast">{error}</div>}
        </div>
      )}
    </div>
  )
}
