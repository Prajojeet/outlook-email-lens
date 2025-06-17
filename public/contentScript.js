
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

// Also listen for direct body content requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBodyContent") {
    try {
      const bodyContent = document.body.outerHTML;
      sendResponse({ success: true, bodyContent: bodyContent });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  return true;
});
