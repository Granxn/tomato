'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ไปหน้า login ทันที
    router.push('/login');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #fab1a0 100%)',
      fontSize: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <p>🍅 Loading Tometo...</p>
    </div>
  );
}