// app/page.js
import { redirect } from 'next/navigation';

// דף הבית - מפנה אוטומטית למוצרים
export default function HomePage() {
  redirect('/products');
}