import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Call Center',
  manifest: '/manifest.json'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center">{children}</body>
    </html>
  );
}