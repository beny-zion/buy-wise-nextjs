import './globals.css'
import Navbar from '@/components/layout/Navbar'

export const metadata = {
  title: 'Buy Wise',
  description: 'המלצות מוצרים חכמות מאלי אקספרס',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  )
}
