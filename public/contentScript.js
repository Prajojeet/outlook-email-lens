
// Content script to extract HTML body content from the current page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageHTML") {
    try {
      // Get the full HTML body content
      const bodyHTML = document.body.innerHTML;
      
      // Also get some additional useful information
      const pageInfo = {
        bodyHTML: bodyHTML,
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
      };
      
      sendResponse({ success: true, data: pageInfo });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  
  // Return true to indicate we will send a response asynchronously
  return true;
});

// Listen for body content requests - this is used by the Compare function
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBodyContent") {
    try {
      // Extract the complete body HTML content
      const bodyContent = document.body.outerHTML;
      
      console.log('HTML Body Content extracted:', {
        size: bodyContent.length,
        preview: bodyContent.substring(0, 200) + '...'
      });
      
      sendResponse({ 
        success: true, 
        bodyContent: bodyContent,
        metadata: {
          url: window.location.href,
          title: document.title,
          timestamp: new Date().toISOString(),
          contentLength: bodyContent.length
        }
      });
    } catch (error) {
      console.error('Error extracting body content:', error);
      sendResponse({ 
        success: false, 
        error: error.message 
      });
    }
  }
  return true;
});

// Optional: Log when content script is loaded
console.log('Email Comparison Tool content script loaded on:', window.location.href);
