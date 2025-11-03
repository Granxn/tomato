'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [sessions, setSessions] = useState(0)
  const [workTime, setWorkTime] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [tasks, setTasks] = useState([])
  const [user, setUser] = useState(null)
  const [editTaskId, setEditTaskId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const router = useRouter()

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setWorkTime(t => t > 0 ? t - 1 : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), title: 'New Task', completed: false }])
  }

  const startEdit = (id, title) => {
    setEditTaskId(id)
    setEditTitle(title)
  }

  const saveEdit = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editTitle } : t))
    setEditTaskId(null)
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const resetTimer = () => {
    setWorkTime(25 * 60)
    setIsRunning(false)
  }

  const completeSession = () => {
    setSessions(sessions + 1)
    resetTimer()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <span className="text-5xl">🍅</span>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: '#ff1f1f' }}>Tometo</h1>
              <p className="text-gray-600 text-sm">✨ {user?.email || 'Loading...'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all"
            style={{ backgroundColor: '#ff1f1f' }}
          >
            🚪 ออกจากระบบ
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Timer Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-red-100">
              <div className="text-center">
                <p className="text-gray-600 mb-2">🍅 Work Time</p>
                <div className="text-8xl font-bold mb-6 font-mono" style={{ color: '#ff1f1f' }}>
                  {formatTime(workTime)}
                </div>

                <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#fff5f5' }}>
                  <p className="text-gray-600 text-sm mb-1">✨ Sessions Completed</p>
                  <p className="text-3xl font-bold" style={{ color: '#ff1f1f' }}>{sessions}</p>
                </div>

                <div className="flex gap-3 justify-center mb-4">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="px-8 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-110 active:scale-95"
                    style={{ backgroundColor: '#ff1f1f' }}
                  >
                    {isRunning ? '⏸️ Pause' : '▶️ Start'}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all transform hover:scale-105 active:scale-95"
                  >
                    🔄 Reset
                  </button>
                  <button
                    onClick={completeSession}
                    className="px-6 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-all transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#22c55e' }}
                  >
                    ✅ Complete
                  </button>
                </div>

                <p className="text-gray-500 text-xs">💌 Focus & Get Productive!</p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-red-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">📊 Quick Stats</h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#fff5f5' }}>
                <p className="text-gray-600 text-sm">⭐ Total Focus Time</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#ff1f1f' }}>{sessions * 25} min</p>
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: '#fffbf0' }}>
                <p className="text-gray-600 text-sm">🍀 Today's Tasks</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#f59e0b' }}>{tasks.length}</p>
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: '#ffe0e0' }}>
                <p className="text-gray-600 text-sm">💗 Completed</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#ff6b6b' }}>{tasks.filter(t => t.completed).length}</p>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-lg text-center" style={{ backgroundColor: '#e0e7ff' }}>
              <p className="text-xs" style={{ color: '#1e40af' }}>✨ Keep Going!</p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-red-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📋 Today's Tasks</h2>
            <button
              onClick={addTask}
              className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#ff1f1f' }}
            >
              ➕ Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">🌟</p>
              <p className="text-gray-600">No tasks yet. Add one to get started! 🍀</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-red-200 hover:shadow-md transition-all group"
                  style={{ backgroundColor: '#fff5f5' }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  {editTaskId === task.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => saveEdit(task.id)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                      autoFocus
                      className="flex-1 px-3 py-1 border border-red-300 rounded-lg focus:outline-none focus:border-red-500"
                    />
                  ) : (
                    <span
                      onClick={() => startEdit(task.id, task.title)}
                      className={`flex-1 cursor-pointer ${
                        task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}
                    >
                      {task.completed ? '✅' : '⭐'} {task.title}
                    </span>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}