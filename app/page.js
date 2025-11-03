'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [emoji, setEmoji] = useState({
    mail: false,
    star: false,
    clover: false,
    heart: false,
  })
  const router = useRouter()

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { error: err } = await supabase.auth.signUp({ email, password })
        if (err) throw err
        alert('✅ Check email! 💌')
        setEmail('')
        setPassword('')
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleBounce = (key) => {
    setEmoji(e => ({ ...e, [key]: true }))
    setTimeout(() => setEmoji(e => ({ ...e, [key]: false })), 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Interactive Emoji Background - Left Side */}
      <div className="absolute left-8 top-20 text-7xl pointer-events-auto cursor-pointer select-none">
        <span
          className={`inline-block transition-transform ${emoji.mail ? 'animate-bounce' : ''}`}
          onClick={() => handleBounce('mail')}
        >
          💌
        </span>
      </div>

      <div className="absolute left-12 bottom-24 text-7xl pointer-events-auto cursor-pointer select-none">
        <span
          className={`inline-block transition-transform ${emoji.clover ? 'animate-bounce' : ''}`}
          onClick={() => handleBounce('clover')}
        >
          🍀
        </span>
      </div>

      {/* Interactive Emoji Background - Right Side */}
      <div className="absolute right-20 top-16 text-6xl pointer-events-auto cursor-pointer select-none">
        <span
          className={`inline-block transition-transform ${emoji.star ? 'animate-bounce' : ''}`}
          onClick={() => handleBounce('star')}
        >
          ⭐
        </span>
      </div>

      <div className="absolute right-16 bottom-32 text-7xl pointer-events-auto cursor-pointer select-none">
        <span
          className={`inline-block transition-transform ${emoji.heart ? 'animate-bounce' : ''}`}
          onClick={() => handleBounce('heart')}
        >
          💗
        </span>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-red-100 hover:shadow-3xl transition-shadow duration-300">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4 animate-bounce">🍅</div>
            <h1 className="text-5xl font-bold mb-2" style={{ color: '#ff1f1f' }}>
              Tometo
            </h1>
            <p className="text-gray-600 text-base font-medium">✨ Smart Pomodoro + Task Management</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="💌 Email address"
                className="w-full px-5 py-3 rounded-xl border-2 border-red-100 focus:border-red-400 focus:outline-none transition-all duration-300 bg-red-50/50 placeholder-gray-400 text-gray-800 font-medium group-hover:border-red-300"
                required
              />
            </div>

            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="🔐 Password"
                className="w-full px-5 py-3 rounded-xl border-2 border-red-100 focus:border-red-400 focus:outline-none transition-all duration-300 bg-red-50/50 placeholder-gray-400 text-gray-800 font-medium group-hover:border-red-300"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-pulse">
                <p className="text-red-700 font-medium text-sm">❌ {error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#ff1f1f',
                boxShadow: '0 4px 15px rgba(255, 31, 31, 0.3)'
              }}
            >
              {loading ? '⏳ Loading...' : isSignUp ? '✨ Create Account' : '💗 Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-red-100 pt-8">
            <p className="text-gray-600 text-sm mb-4 font-medium">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="font-bold text-lg transition-all duration-200 hover:opacity-80 px-6 py-2 rounded-lg w-full"
              style={{ color: '#ff1f1f' }}
            >
              {isSignUp ? '🍀 Sign In Instead' : '⭐ Create One'}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs font-medium">🚀 Start your productivity journey today!</p>
          </div>
        </div>
      </div>
    </div>
  )
}