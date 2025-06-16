
import { useState, useEffect } from 'react';

export const useOutlookDetection = () => {
  const [isOnOutlook, setIsOnOutlook] = useState(false);

  useEffect(() => {
    const checkOutlookPage = () => {
      const currentUrl = window.location.href.toLowerCase();
      const isOutlook = currentUrl.includes('outlook.live.com') || 
                       currentUrl.includes('outlook.office.com') || 
                       currentUrl.includes('outlook.office365.com') ||
                       currentUrl.includes('mail.google.com'); // Added Gmail for testing
      setIsOnOutlook(isOutlook);
    };

    checkOutlookPage();
    
    // Listen for URL changes (for SPAs)
    const intervalId = setInterval(checkOutlookPage, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return isOnOutlook;
};
