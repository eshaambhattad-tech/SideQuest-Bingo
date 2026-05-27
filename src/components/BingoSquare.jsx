export default function BingoSquare({ text, marked, isFree, index, onMark }) {
  const classes = ['bingo-square', marked && 'marked', isFree && 'free']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      style={{ '--i': index }}
      onClick={() => !isFree && onMark(index)}
      aria-pressed={marked}
      aria-label={text}
    >
      <span className="square-text">{text}</span>
    </button>
  )
}
