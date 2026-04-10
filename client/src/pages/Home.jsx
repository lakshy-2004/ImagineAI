import React, { useState, useEffect, useRef } from 'react'
import { Loader, Card, FormField } from '../components'

const SkeletonCard = ({ delay = 0 }) => (
  <div className="skeleton rounded-2xl aspect-square" style={{ animationDelay: `${delay}ms` }} />
)

const EmptyState = ({ isSearch, query }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 fade-up">
    <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="4" y1="22" x2="4" y2="15" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
    <div className="text-center">
      <p className="font-semibold text-slate-600 mb-1">
        {isSearch ? `No results for "${query}"` : 'No posts yet'}
      </p>
      <p className="text-sm text-slate-400">
        {isSearch ? 'Try a different search term' : 'Be the first to create and share an image!'}
      </p>
    </div>
  </div>
)

const Home = () => {
  const [loading, setLoading]                 = useState(false)
  const [allPosts, setAllPosts]               = useState(null)
  const [searchText, setSearchText]           = useState('')
  const [searchedResults, setSearchedResults] = useState(null)
  const [error, setError]                     = useState('')
  const searchTimeout                         = useRef(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/get`, {
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) throw new Error(`Server error ${res.status}`)
        const result = await res.json()
        setAllPosts(result.data)
      } catch (err) {
        setError('Could not load posts. Please try refreshing.')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchText(val)
    clearTimeout(searchTimeout.current)
    if (!val.trim()) { setSearchedResults(null); return }
    searchTimeout.current = setTimeout(() => {
      const q = val.toLowerCase()
      setSearchedResults(
        allPosts?.filter(p =>
          p.name.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q)
        ) ?? []
      )
    }, 400)
  }

  const displayPosts = searchText ? searchedResults : allPosts

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-10 py-10">

      <div className="mb-10 fade-up">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-indigo-100">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Community Gallery
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-950 leading-tight mb-3">
          Where words become<br />
          <span className="text-indigo-500">art</span>
        </h1>
        <p className="text-slate-500 text-base max-w-md font-medium">
          Browse stunning AI-generated images from the community. Hover any image to see its prompt.
        </p>
      </div>

      <div className="mb-6 max-w-md fade-up-2">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search by name or prompt…"
            className="input-field w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-3 hover:border-indigo-200 transition-all duration-200"
          />
        </div>
      </div>


      {searchText && !loading && (
        <p className="text-sm text-slate-500 font-medium mb-5">
          {searchedResults?.length
            ? <><span className="text-indigo-600 font-bold">{searchedResults.length}</span> result{searchedResults.length !== 1 ? 's' : ''} for "<span className="text-slate-700">{searchText}</span>"</>
            : <span className="text-slate-400">No results for "<span className="text-slate-600">{searchText}</span>"</span>
          }
        </p>
      )}

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5"/>
            <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[210px] fade-up-3">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} delay={i * 80} />)
          : (displayPosts?.length > 0
              ? displayPosts.map(post => <Card key={post._id} {...post} />)
              : <EmptyState isSearch={!!searchText} query={searchText} />
            )
        }
      </div>

    </section>
  )
}

export default Home
