import React from 'react'
import { download } from '../assets'
import { downloadImage } from '../utils'

const avatarPalette = [
  { bg: '#ede9fe', text: '#6d28d9' },
  { bg: '#dbeafe', text: '#1d4ed8' },
  { bg: '#dcfce7', text: '#15803d' },
  { bg: '#fce7f3', text: '#be185d' },
  { bg: '#fef3c7', text: '#b45309' },
  { bg: '#e0f2fe', text: '#0369a1' },
]
const getAvatar = (name) => avatarPalette[name.charCodeAt(0) % avatarPalette.length]

const Card = ({ _id, name, prompt, photo }) => {
  const avatar = getAvatar(name)

  return (
    <div className="rounded-2xl group relative overflow-hidden card transition-all duration-300 hover:-translate-y-1 bg-white"
      style={{ boxShadow: 'var(--shadow-card)' }}>

      {/* Image */}
      <img
        src={photo}
        alt={prompt}
        className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 flex flex-col justify-end p-4
        bg-gradient-to-t from-black/80 via-black/30 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">

        {/* Prompt text */}
        <p className="text-white text-xs leading-relaxed line-clamp-3 prompt mb-3">
          {prompt}
        </p>

        {/* Author + download */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: avatar.bg, color: avatar.text }}
            >
              {name[0].toUpperCase()}
            </div>
            <span className="text-white/90 text-xs font-medium truncate max-w-[90px]">{name}</span>
          </div>

          <button
            type="button"
            onClick={() => downloadImage(_id, photo)}
            title="Download"
            className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all duration-200 backdrop-blur-sm flex-shrink-0"
          >
            <img src={download} alt="download" className="w-3.5 h-3.5 object-contain invert" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
