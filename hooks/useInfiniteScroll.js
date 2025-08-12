// hooks/useInfiniteScroll.js
import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for infinite scroll functionality
 * @param {Function} callback - Function to call when scrolling reaches threshold
 * @param {Object} options - Configuration options
 * @returns {React.RefObject} - Ref to attach to the trigger element
 */
export function useInfiniteScroll(
  callback,
  {
    threshold = 0.5,
    enabled = true,
    rootMargin = '100px',
  } = {}
) {
  const observerRef = useRef(null);
  const callbackRef = useRef(callback);
  
  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Create intersection observer
  const observe = useCallback(
    (node) => {
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      // Don't observe if disabled
      if (!enabled) return;
      
      // Create new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            callbackRef.current();
          }
        },
        {
          threshold,
          rootMargin,
        }
      );
      
      // Start observing
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [enabled, threshold, rootMargin]
  );
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  return observe;
}