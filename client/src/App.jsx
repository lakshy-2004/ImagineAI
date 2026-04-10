import React from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { Home, CreatePost } from './pages'
import Header from './pages/Header.jsx'
import Footer from './pages/Footer.jsx'

const App = () => {
  return (
    <BrowserRouter>
      
      <Header />

      <main className="w-full min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </main>
      
      <Footer />   

    </BrowserRouter>
  )
}

export default App
