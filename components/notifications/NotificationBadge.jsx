/* needed */
// src/components/notifications/NotificationBadge.jsx
import React from 'react';
import { useVendorNotifications } from '../../hooks/useVendorNotifications';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBadge = () => {
  const { unreadCount } = useVendorNotifications();

  if (unreadCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="absolute -top-1 -right-1  bg-red-500 text-white text-xs 
                   w-5 h-5 rounded-full flex items-center justify-center font-bold
                   shadow-md"
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationBadge;