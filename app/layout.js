import './globals.css';
import { Providers } from '@/components/providers/Providers';

export const metadata = {
  title: {
    default: 'Buy Wise',
    template: '%s | Buy Wise',
  },
  description: 'Best products from AliExpress',
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
