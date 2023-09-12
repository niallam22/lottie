import './globals.css'
import { AuthProvider } from "./Providers";
import { Inter } from 'next/font/google'
import Navbar from '@/app/components/Navbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lottie',
  description: 'Find a care home',
  icons: {
    icon: [
      '/favicon.ico?v=4',
    ],
    apple: [
      '/apple-touch-icon.png?v=4',
    ],
    shortcut: [
      '/apple-touch-icon.png',
    ]
  },
  manifest: '/site.webmanifest'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AuthProvider>
            <Navbar />
            {children}
      </AuthProvider>
      </body>
    </html>
  )
}
