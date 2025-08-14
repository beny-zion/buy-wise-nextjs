// app/favorites/page.js - דף מועדפים
import FavoritesContent from './FavoritesContent';

export const metadata = {
  title: 'מועדפים | Buy Wise',
  description: 'המוצרים המועדפים שלך ב-Buy Wise',
};

export default function FavoritesPage() {
  return <FavoritesContent />;
}