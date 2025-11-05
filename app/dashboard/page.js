'use client';

import { useState, useEffect } from 'react';
import './dashboard-variables.css'; // เพิ่มบรรทัดนี้
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      setSessions(prev => prev + 1);
      setTotalFocusTime(prev => prev + 25);
      // Play sound or notification here
      alert('🎉 Pomodoro session completed! Great job!');
      setTime(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleReset = () => {
    setIsRunning(false);
    setTime(25 * 60);
  };
  const handleComplete = () => {
    setIsRunning(false);
    setSessions(prev => prev + 1);
    setTotalFocusTime(prev => prev + Math.floor((25 * 60 - time) / 60));
    setTime(25 * 60);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
      setShowTaskModal(false);
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.tomatoIcon}>🍅</span>
          <h1 className={styles.logoText}>Tomato</h1>
        </div>
        <p className={styles.subtitle}>Your Friendly Productivity Companion</p>
        <button className={styles.logoutBtn}>ออกจากระบบ</button>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Timer Card */}
        <div className={styles.timerCard}>
          <div className={styles.timerHeader}>
            <span className={styles.timerIcon}>🍅</span>
            <h2>Work Time</h2>
          </div>
          
          <div className={styles.timerDisplay}>
            {formatTime(time)}
          </div>

          <div className={styles.sessionsInfo}>
            <span className={styles.sparkle}>✨</span>
            <span>Sessions Completed</span>
          </div>
          <div className={styles.sessionsCount}>{sessions}</div>

          <div className={styles.timerControls}>
            <button 
              className={styles.btnStart} 
              onClick={handleStart}
              disabled={isRunning}
            >
              ▶️ Start
            </button>
            <button 
              className={styles.btnReset} 
              onClick={handleReset}
            >
              🔄 Reset
            </button>
            <button 
              className={styles.btnComplete} 
              onClick={handleComplete}
              disabled={!isRunning}
            >
              ✅ Complete
            </button>
          </div>

          <p className={styles.motivationText}>
            💗 Focus & Get Productive!
          </p>
        </div>

        {/* Stats Card */}
        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <span className={styles.chartIcon}>📊</span>
            <h2>Quick Stats</h2>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statIcon}>⭐</span>
            <span className={styles.statLabel}>Total Focus Time</span>
            <span className={styles.statValue}>{totalFocusTime} min</span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statIcon}>🍀</span>
            <span className={styles.statLabel}>Today's Tasks</span>
            <span className={styles.statValue}>{tasks.length}</span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statIcon}>💖</span>
            <span className={styles.statLabel}>Completed</span>
            <span className={styles.statValue}>{completedTasks}</span>
          </div>

          <div className={styles.keepGoing}>
            <span className={styles.sparkle}>✨</span>
            Keep Going!
          </div>
        </div>
      </main>

      {/* Tasks Section */}
      <section className={styles.tasksSection}>
        <div className={styles.tasksHeader}>
          <div className={styles.tasksTitle}>
            <span className={styles.noteIcon}>📋</span>
            <h2>Today's Tasks</h2>
          </div>
          <button 
            className={styles.btnAddTask}
            onClick={() => setShowTaskModal(true)}
          >
            ➕ Add Task
          </button>
        </div>

        <div className={styles.tasksList}>
          {tasks.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.sunIcon}>☀️</span>
              <p>No tasks yet. Add one to get started! 🌱</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={styles.taskItem}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className={styles.taskCheckbox}
                />
                <span className={task.completed ? styles.taskTextCompleted : styles.taskText}>
                  {task.text}
                </span>
                <button 
                  className={styles.btnDeleteTask}
                  onClick={() => deleteTask(task.id)}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Task Modal */}
      {showTaskModal && (
        <div className={styles.modal} onClick={() => setShowTaskModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>✨ Add New Task</h3>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What do you want to accomplish?"
                className={styles.modalInput}
                autoFocus
              />
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.btnModalAdd}>
                  ➕ Add Task
                </button>
                <button 
                  type="button" 
                  className={styles.btnModalCancel}
                  onClick={() => setShowTaskModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}