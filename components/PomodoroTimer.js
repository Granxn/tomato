import { usePomodoro } from '../hooks/usePomodoro'
import { useEffect } from 'react'

export default function PomodoroTimer() {
  const { timeLeft, isRunning, sessionCount, currentPhase, start, pause, reset, formatTime, progress } = usePomodoro()

  useEffect(() => {
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'work': return 'bg-tomato'
      case 'shortBreak': return 'bg-leaf'
      case 'longBreak': return 'bg-blue-500'
      default: return 'bg-tomato'
    }
  }

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'work': return 'Work Time 🍅'
      case 'shortBreak': return 'Short Break ☕'
      case 'longBreak': return 'Long Break 🌿'
      default: return 'Work Time 🍅'
    }
  }

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md border-b-2 border-tomato">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-tomato">Tometo 🍅</h1>
            <div className="text-sm text-gray-600">
              Sessions: {sessionCount}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">{getPhaseText()}</div>
              <div className="text-3xl font-bold text-dark">{formatTime()}</div>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getPhaseColor()}`}
                  style={{ width: `${progress()}%` }}
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={isRunning ? pause : start}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isRunning 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-tomato hover:bg-red-600 text-white'
                }`}
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
