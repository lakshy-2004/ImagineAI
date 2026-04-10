import React from 'react'

const Loader = ({ size = 'md', label = '' }) => {
  const dim = { sm: 18, md: 36, lg: 52 }[size]
  const stroke = { sm: 2.5, md: 2.5, lg: 3 }[size]
  const r = (dim / 2) - stroke * 1.5
  const circ = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center gap-2.5" role="status">
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} fill="none">
        {/* Track */}
        <circle
          cx={dim/2} cy={dim/2} r={r}
          stroke="#e0e7ff" strokeWidth={stroke}
        />
        {/* Spinner */}
        <circle
          cx={dim/2} cy={dim/2} r={r}
          stroke="#6366f1"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circ * 0.25} ${circ * 0.75}`}
          transform={`rotate(-90 ${dim/2} ${dim/2})`}
          style={{ animation: 'spin 0.8s linear infinite' }}
        />
        <style>{`@keyframes spin { to { transform: rotate(270deg); transform-origin: ${dim/2}px ${dim/2}px; } }`}</style>
      </svg>
      {label && <p className="text-sm text-slate-400 font-medium">{label}</p>}
    </div>
  )
}

export default Loader
