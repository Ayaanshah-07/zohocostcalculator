import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import FuturisticCursor from '@/components/ui/futuristic-cursor'
import ClickEffect from '@/components/ui/click-effect'

export const metadata: Metadata = {
  title: 'G12 AI-Powered Business Setup Quotation',
  description: 'Generate business setup quotations for UAE',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <FuturisticCursor />
          <ClickEffect />
        </ThemeProvider>
      </body>
    </html>
  )
}
