import BingoSquare from './BingoSquare'

export default function BingoBoard({ board, marked, onMark }) {
  return (
    <div className="board-container">
      <div className="bingo-board">
        {board.map((text, i) => (
          <BingoSquare
            key={i}
            index={i}
            text={text}
            marked={marked[i]}
            isFree={i === 12}
            onMark={onMark}
          />
        ))}
      </div>
    </div>
  )
}
