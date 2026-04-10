import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import { FormField, Loader } from '../components'

const PROMPT_MAX = 800

const useToast = () => {
  const [toast, setToast] = useState(null)
  const show = useCallback((msg, type = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])
  return { toast, show }
}

const CreatePost = () => {
  const navigate = useNavigate()
  const { toast, show: showToast } = useToast()

  const [form, setForm]                   = useState({ name: '', prompt: '', photo: '' })
  const [generatingImg, setGeneratingImg] = useState(false)
  const [loading, setLoading]             = useState(false)

  const handleChange     = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSurpriseMe = ()  => setForm({ ...form, prompt: getRandomPrompt(form.prompt) })

  const generateImage = async () => {
    if (!form.prompt.trim()) { showToast('Please enter a prompt first'); return }
    setGeneratingImg(true)
    try {
      const res  = await fetch('/api/v1/dalle/text-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: form.prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setForm(f => ({ ...f, photo: data.base64 }))
      showToast('Image generated successfully!', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to generate image')
    } finally {
      setGeneratingImg(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim())   { showToast('Please enter your name');         return }
    if (!form.prompt.trim()) { showToast('Please enter a prompt');           return }
    if (!form.photo)         { showToast('Please generate an image first');  return }
    setLoading(true)
    try {
      const res  = await fetch('/api/v1/post/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not share post')
      navigate('/')
    } catch (err) {
      showToast(err.message || 'Failed to share post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-6 sm:px-10 py-10">


      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}


      <div className="mb-10 fade-up">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-950 leading-tight mb-3">
          Describe your vision,<br/>
          <span className="text-indigo-500">we'll paint it</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-md">
          Type any idea and our AI turns it into a unique image. Share it with the community!
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start fade-up-2">


          <div className="flex flex-col gap-4">


            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-5"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <FormField
                LabelName="Your Name"
                type="text"
                name="name"
                placeholder="e.g. Lakshya Sharma"
                value={form.name}
                handleChange={handleChange}
              />
              <FormField
                LabelName="Prompt"
                type="text"
                name="prompt"
                placeholder="A surreal forest glowing with bioluminescent plants at night…"
                value={form.prompt}
                handleChange={handleChange}
                isSurpriseMe
                handleSurpriseMe={handleSurpriseMe}
                maxLength={PROMPT_MAX}
              />

              <button
                type="button"
                onClick={generateImage}
                disabled={generatingImg}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2
                  bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-md shadow-indigo-200"
              >
                {generatingImg ? (
                  <><Loader size="sm" /> Generating…</>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3v1m0 16v1M4.22 4.22l.71.71m12.73 12.73.71.71M3 12h1m16 0h1M4.93 19.07l.71-.71M18.36 5.64l.71-.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Generate Image
                  </>
                )}
              </button>
            </div>


            <button
              type="submit"
              disabled={loading || !form.photo}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2
                bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader size="sm" /> Sharing…</>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Share with Community
                </>
              )}
            </button>

            {!form.photo && (
              <p className="text-center text-slate-300 text-xs font-medium">
                Generate an image above before sharing
              </p>
            )}
          </div>


          <div className="lg:sticky lg:top-24">
            <div
              className="relative rounded-2xl overflow-hidden aspect-square flex items-center justify-center bg-slate-50 border border-slate-100"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              {form.photo ? (
                <img src={form.photo} alt={form.prompt} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 p-10 text-center">
                  <img src={preview} alt="placeholder" className="w-2/3 object-contain opacity-10" />
                  <p className="text-slate-300 text-sm font-medium">Your image appears here</p>
                </div>
              )}


              {generatingImg && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                  <Loader size="lg" label="Painting your vision…" />
                </div>
              )}


              {form.photo && !generatingImg && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-green-700 px-2.5 py-1 rounded-full border border-green-100 flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Ready to share
                </div>
              )}
            </div>


            {form.prompt && (
              <p className="mt-3 text-xs text-slate-400 leading-relaxed px-1 line-clamp-2 font-medium">
                "{form.prompt}"
              </p>
            )}
          </div>

        </div>
      </form>
    </section>
  )
}

export default CreatePost
