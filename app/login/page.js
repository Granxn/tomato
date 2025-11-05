'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      console.log('Login:', { email, password });
      router.push('/dashboard');
    }
  };

  const handleCreateAccount = () => {
    router.push('/register');
  };

  return (
    <div className={styles.body}>
      {/* Decorative Emojis */}
      <div className={`${styles.emojiDecoration} ${styles.emoji1}`}>💗</div>
      <div className={`${styles.emojiDecoration} ${styles.emoji2}`}>⭐</div>
      <div className={`${styles.emojiDecoration} ${styles.emoji3}`}>🍀</div>
      <div className={`${styles.emojiDecoration} ${styles.emoji4}`}>💖</div>
      <div className={`${styles.emojiDecoration} ${styles.emoji5}`}>✨</div>
      <div className={`${styles.emojiDecoration} ${styles.emoji6}`}>🌟</div>

      {/* Login Card */}
      <div className={styles.loginContainer}>
        <div className={styles.tomatoIcon}>🍅</div>
        <h1 className={styles.title}>Tometo</h1>
        <p className={styles.subtitle}>Smart Pomodoro + Task Management</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>💗</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>🔒</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.btnSignin}>
            💗 Sign In
          </button>

          <p className={styles.divider}>Don't have an account?</p>

          <button 
            type="button" 
            className={styles.btnCreate}
            onClick={handleCreateAccount}
          >
            ⭐ Create One
          </button>

          <p className={styles.footerText}>🚀 Start your productivity journey today!</p>
        </form>
      </div>
    </div>
  );
}