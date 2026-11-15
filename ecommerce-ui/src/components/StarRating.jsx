// src/components/StarRating.jsx
export default function StarRating({ average, total, compact = false }) {
  if (!total) return <span className="muted">Belum ada ulasan</span>
  const filled = Math.round(average)
  return (
    <span className="stars" title={`${Number(average).toFixed(1)} dari 5`}>
      {'★'.repeat(filled)}
      {'☆'.repeat(5 - filled)}
      {!compact && (
        <span className="muted">
          {' '}
          {Number(average).toFixed(1)} ({total})
        </span>
      )}
    </span>
  )
}