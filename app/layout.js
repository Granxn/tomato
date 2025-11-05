import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tomato - Smart Pomodoro + Kanban',
  description: 'Boost productivity with Pomodoro timer and AI-powered task management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
