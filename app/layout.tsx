import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tometo',
  description: 'Smart Pomodoro Timer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}