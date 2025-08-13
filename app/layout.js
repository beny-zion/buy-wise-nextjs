import './globals.css'
import Layout from '@/components/layout/Layout'

export const metadata = {
  title: 'Buy Wise',
  description: 'המלצות מוצרים חכמות מאלי אקספרס',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}
