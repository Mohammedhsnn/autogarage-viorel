import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Analytics from './analytics'
import { Toaster } from '@/components/ui/toaster'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Autogarage Viorel',
    template: '%s | Autogarage Viorel',
  },
  description: 'APK keuringen, onderhoud, reparatie en occasions in Terneuzen. Eerlijk, betaalbaar, betrouwbaar.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
        {...{ "cz-shortcut-listen": "true" }}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
