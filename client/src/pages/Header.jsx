import React from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

const Header = () => {
  return (
    <div>
        <header className="w-full sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">

          
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 16l4-4 4 4 4-8 4 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-extrabold text-indigo-900 text-lg tracking-tight">
              Imagine<span className="text-indigo-500">AI</span>
            </span>
          </NavLink>

       
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/60'
                }`
              }
            >
              Gallery
            </NavLink>
            <NavLink
              to="/create-post"
              className={({ isActive }) =>
                `text-sm px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
                }`
              }
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Create
            </NavLink>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default Header