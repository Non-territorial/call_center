import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Call Center',
  manifest: '/manifest.json'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/curtains.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        {children}
      </body>
    </html>
  )
}