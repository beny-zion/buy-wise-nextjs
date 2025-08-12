/* needed */
// src/components/profile/ProfileHeader.jsx
import React from 'react';
import SocialLinks from './SocialLinks';

const ProfileHeader = ({ user }) => (
 <div className="w-full max-w-screen-md mx-auto bg-white rounded-lg shadow mb-6 p-4 md:p-6">
   <div className="flex flex-col md:flex-row items-center gap-4">
     <img 
       src={user.profileImage || '/api/placeholder/80/80'} 
       alt={user.fullName}
       className="w-24 h-24 md:w-20 md:h-20 rounded-full object-cover"
     />
     <div className="text-center md:text-right">
       <h2 className="text-xl font-bold">{user.fullName}</h2>
       <p className="text-gray-600">{user.email}</p>
     </div>
   </div>
   <div className="mt-4 text-center md:text-right">
     <p className="text-gray-700">{user.bio}</p>
     <SocialLinks social={user.social} />
   </div>
 </div>
);
export default ProfileHeader;