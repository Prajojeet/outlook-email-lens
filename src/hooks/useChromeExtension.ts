
import { useState, useEffect } from 'react';

export const useChromeExtension = () => {
  const [isOnOutlook, setIsOnOutlook] = useState(false);

  // Check if Chrome extension APIs are available
  const isChromeExtension = () => {
    return typeof window !== 'undefined' && 
           typeof (window as any).chrome !== 'undefined' && 
           (window as any).chrome.runtime && 
           (window as any).chrome.tabs;
  };

  // Function to scrape HTML body from current page
  const scrapePageHTML = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (isChromeExtension()) {
        const chrome = (window as any).chrome;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
          if (chrome.runtime.lastError) {
            reject(new Error("Extension error: " + chrome.runtime.lastError.message));
            return;
          }
          
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "getBodyContent" }, (response: any) => {
              if (chrome.runtime.lastError) {
                reject(new Error("Could not access page content. Please refresh the page and try again."));
                return;
              }
              
              if (response && response.success) {
                resolve(response.bodyContent);
              } else {
                reject(new Error(response?.error || "Failed to extract page content"));
              }
            });
          } else {
            reject(new Error("No active tab found"));
          }
        });
      } else {
        // Fallback for development
        try {
          const bodyContent = document.body.outerHTML;
          resolve(bodyContent);
        } catch (error) {
          reject(new Error("Cannot access page content in development mode"));
        }
      }
    });
  };

  // Check if user is on Microsoft Outlook
  useEffect(() => {
    const checkOutlookPage = async () => {
      try {
        if (isChromeExtension()) {
          const chrome = (window as any).chrome;
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          const currentUrl = tab.url?.toLowerCase() || '';
          const isOutlook = currentUrl.includes('outlook.live.com') || 
                           currentUrl.includes('outlook.office.com') || 
                           currentUrl.includes('outlook.office365.com');
          setIsOnOutlook(isOutlook);
        } else {
          const currentUrl = window.location.href.toLowerCase();
          const isOutlook = currentUrl.includes('outlook.live.com') || 
                           currentUrl.includes('outlook.office.com') || 
                           currentUrl.includes('outlook.office365.com') ||
                           currentUrl.includes('mail.google.com');
          setIsOnOutlook(isOutlook);
        }
      } catch (error) {
        console.log('Cannot access tab information');
        setIsOnOutlook(false);
      }
    };

    checkOutlookPage();
    const intervalId = setInterval(checkOutlookPage, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return {
    isChromeExtension,
    scrapePageHTML,
    isOnOutlook
  };
};
