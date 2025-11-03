import { useState, useEffect, useRef } from 'react'

const WORK_TIME = 25 * 60 // 25 minutes
const SHORT_BREAK = 5 * 60 // 5 minutes  
const LONG_BREAK = 15 * 60 // 15 minutes

export function usePomodoro() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('work') // work, shortBreak, longBreak
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handlePhaseComplete()
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  const handlePhaseComplete = () => {
    setIsRunning(false)
    
    if (currentPhase === 'work') {
      const newSessionCount = sessionCount + 1
      setSessionCount(newSessionCount)
      
      if (newSessionCount % 4 === 0) {
        setCurrentPhase('longBreak')
        setTimeLeft(LONG_BREAK)
      } else {
        setCurrentPhase('shortBreak')
        setTimeLeft(SHORT_BREAK)
      }
    } else {
      setCurrentPhase('work')
      setTimeLeft(WORK_TIME)
    }

    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification(`${currentPhase === 'work' ? 'Work' : 'Break'} session complete! 🍅`)
    }
  }

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)
  const reset = () => {
    setIsRunning(false)
    setCurrentPhase('work')
    setTimeLeft(WORK_TIME)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    timeLeft,
    isRunning,
    sessionCount,
    currentPhase,
    start,
    pause,
    reset,
    formatTime: () => formatTime(timeLeft),
    progress: () => {
      const total = currentPhase === 'work' ? WORK_TIME : 
                   currentPhase === 'shortBreak' ? SHORT_BREAK : LONG_BREAK
      return ((total - timeLeft) / total) * 100
    }
  }
}
