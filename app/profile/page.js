// app/profile/page.js - דף פרופיל
import ProfileContent from './ProfileContent';

export const metadata = {
  title: 'פרופיל אישי | Buy Wise',
  description: 'הפרופיל האישי שלך ב-Buy Wise',
};

export default function ProfilePage() {
  return <ProfileContent />;
}