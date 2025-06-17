import { useState, useEffect } from 'react';
import { X, Copy, Info, CheckCircle, Loader2, Minimize, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import TextInputBox from './TextInputBox';
import ResultsDisplay from './ResultsDisplay';
import SkeletonLoader from './SkeletonLoader';

interface ComparisonData {
  originalDocument: string;
  dateTimeFormat: string;
  marker: string;
}

const EmailComparisonTool = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnOutlook, setIsOnOutlook] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    originalDocument: '',
    dateTimeFormat: '',
    marker: ''
  });
  const [results, setResults] = useState('');
  const { toast } = useToast();

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

  // Load data from Chrome storage on component mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        if (isChromeExtension()) {
          const chrome = (window as any).chrome;
          const result = await chrome.storage.local.get(['emailComparisonData']);
          if (result.emailComparisonData) {
            setComparisonData(result.emailComparisonData);
          }
        } else {
          const stored = localStorage.getItem('emailComparisonData');
          if (stored) {
            setComparisonData(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.log('Storage not available, using session state');
      }
    };
    
    loadStoredData();
  }, []);

  // Save data to Chrome storage whenever comparisonData changes
  useEffect(() => {
    const saveData = async () => {
      try {
        if (isChromeExtension()) {
          const chrome = (window as any).chrome;
          await chrome.storage.local.set({ emailComparisonData: comparisonData });
        } else {
          localStorage.setItem('emailComparisonData', JSON.stringify(comparisonData));
        }
      } catch (error) {
        console.log('Storage not available');
      }
    };

    saveData();
  }, [comparisonData]);

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

  const isFormValid = comparisonData.originalDocument.trim() !== '' && 
                     comparisonData.dateTimeFormat.trim() !== '' && 
                     comparisonData.marker.trim() !== '';

  const canCompare = isFormValid && isOnOutlook;

  const handleInputChange = (field: keyof ComparisonData, value: string) => {
    setError(null); // Clear error when user makes changes
    setComparisonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompare = async () => {
    if (!canCompare) {
      if (!isFormValid) {
        setError("Please fill in all required fields before comparing.");
        toast({
          title: "Missing Information",
          description: "Please fill in all fields before comparing.",
          variant: "destructive"
        });
      } else {
        setError("Please open Microsoft Outlook webpage to compare emails.");
        toast({
          title: "Outlook Required",
          description: "Please open Microsoft Outlook webpage to compare emails.",
          variant: "destructive"
        });
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Get current URL for context
      let currentUrl = '';
      if (isChromeExtension()) {
        const chrome = (window as any).chrome;
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        currentUrl = tab.url || '';
      } else {
        currentUrl = window.location.href;
      }

      toast({
        title: "Extracting Content",
        description: "Getting HTML content from the current page...",
      });

      const htmlBodyContent = await scrapePageHTML();

      toast({
        title: "Content Extracted",
        description: "HTML content extracted successfully. Sending to backend...",
      });

      // Replace with your actual Azure endpoint
      const API_ENDPOINT = 'YOUR_AZURE_API_ENDPOINT_HERE';
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalDocument: comparisonData.originalDocument,
          dateTimeFormat: comparisonData.dateTimeFormat,
          marker: comparisonData.marker,
          htmlBodyContent: htmlBodyContent,
          currentUrl: currentUrl,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      const formattedResults = `
        <div class="comparison-result">
          <h2 style="color: #1e40af; margin-bottom: 16px; font-size: 1.5rem; font-weight: bold;">Email Comparison Results</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #475569; margin-bottom: 12px; font-size: 1.1rem; font-weight: 600;">Analysis Summary</h3>
            <p style="color: #64748b; line-height: 1.6;">${data.message || 'Comparison completed successfully.'}</p>
          </div>
          <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #bfdbfe;">
            <h3 style="color: #1e40af; margin-bottom: 12px; font-size: 1.1rem; font-weight: 600;">Detailed Results</h3>
            <pre style="color: #1e40af; font-family: 'Monaco', 'Menlo', monospace; white-space: pre-wrap; line-height: 1.5; font-size: 0.9rem;">${JSON.stringify(data.results || data, null, 2)}</pre>
          </div>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #bbf7d0;">
            <h3 style="color: #16a34a; margin-bottom: 12px; font-size: 1.1rem; font-weight: 600;">Processing Information</h3>
            <p style="color: #15803d; line-height: 1.6;">
              ✓ HTML content extracted: ${(htmlBodyContent.length / 1024).toFixed(2)} KB<br/>
              ✓ Document comparison completed<br/>
              ✓ Processing time: ${new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      `;
      
      setResults(formattedResults);
      setShowResults(true);
      
      toast({
        title: "Comparison Complete",
        description: "Email comparison has been processed successfully.",
      });
      
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while processing your request.";
      setError(errorMessage);
      toast({
        title: "Comparison Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(results.replace(/<[^>]*>/g, ''));
      toast({
        title: "Copied!",
        description: "Results copied to clipboard successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setComparisonData({
      originalDocument: '',
      dateTimeFormat: '',
      marker: ''
    });
    setShowResults(false);
    setResults('');
    setError(null);
  };

  const handleClose = async () => {
    try {
      if (isChromeExtension()) {
        const chrome = (window as any).chrome;
        await chrome.storage.local.remove(['emailComparisonData']);
      } else {
        localStorage.removeItem('emailComparisonData');
      }
    } catch (error) {
      console.log('Cannot clear storage');
    }
    setIsOpen(false);
    resetForm();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full translate-x-2 translate-y-2 blur-md"></div>
          <Button
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]"
            size="lg"
          >
            📧 Email Lens
          </Button>
        </div>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full translate-x-2 translate-y-2 blur-md"></div>
          <Button
            onClick={() => setIsMinimized(false)}
            className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white p-3 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]"
            size="lg"
          >
            <img 
              src="/lovable-uploads/7a69c4fd-3d5e-45d2-b3c8-c758260eb538.png" 
              alt="JSW Logo" 
              className="w-6 h-6 object-contain"
            />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="relative w-full max-w-3xl h-[50vh]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-2xl translate-x-3 translate-y-3 blur-lg"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-2xl translate-x-1.5 translate-y-1.5 blur-sm"></div>
          
          <Card className="relative z-10 w-full h-full overflow-hidden bg-white shadow-2xl border-0 rounded-2xl flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white p-5 relative rounded-t-2xl shadow-lg flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg shadow-black/10">
                    <img 
                      src="/lovable-uploads/7a69c4fd-3d5e-45d2-b3c8-c758260eb538.png" 
                      alt="JSW Logo" 
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">Email Comparison Tool</h1>
                    <p className="text-blue-100 text-sm">Compare and analyze your emails efficiently</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(true)}
                    className="text-white hover:bg-white/20 h-9 w-9 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                    title="Minimize"
                  >
                    <Minimize className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="text-white hover:bg-white/20 h-9 w-9 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="p-6 overflow-y-auto flex-1 bg-gradient-to-b from-gray-50 to-white">
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <div className="space-y-6 h-full">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-700 text-sm font-medium">Error</p>
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    <TextInputBox
                      placeholder="Paste your original well indented Document here from MS Word Offline version"
                      value={comparisonData.originalDocument}
                      onChange={(value) => handleInputChange('originalDocument', value)}
                      className="min-h-[180px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
                      label="Original Document"
                    />
                  </div>

                  <div>
                    <TextInputBox
                      placeholder="Paste the exact date-time format as written on the particular mail you want to be compared (Case and space Sensitive)"
                      value={comparisonData.dateTimeFormat}
                      onChange={(value) => handleInputChange('dateTimeFormat', value)}
                      className="min-h-[60px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
                      label="Date-Time Format"
                    />
                  </div>

                  <div>
                    <TextInputBox
                      placeholder="Any marker like ****,++++ or Sender's name from the mail ending as it is"
                      value={comparisonData.marker}
                      onChange={(value) => handleInputChange('marker', value)}
                      className="min-h-[60px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
                      label="Email Marker"
                    />
                  </div>

                  {!isOnOutlook && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-amber-700 text-sm text-center">
                        📧 Please open Microsoft Outlook webpage for comparing emails
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-6 border-t border-gray-200 px-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowRules(true)}
                      className="text-blue-600 border-2 border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 transition-all duration-200 shadow-md hover:shadow-lg px-6 py-2.5"
                      size="sm"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Usage Rules
                    </Button>
                    
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        onClick={resetForm}
                        className="border-2 border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg px-6 py-2.5"
                        size="sm"
                      >
                        Reset
                      </Button>
                      <div className="relative">
                        {canCompare && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-lg translate-x-0.5 translate-y-0.5 blur-sm"></div>
                        )}
                        <Button
                          onClick={handleCompare}
                          disabled={!canCompare || isLoading}
                          className={`relative px-8 py-2.5 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-1px] rounded-lg shadow-lg hover:shadow-xl ${
                            canCompare && !isLoading
                              ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-blue-200/50' 
                              : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                          }`}
                          size="sm"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : canCompare ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Compare
                            </>
                          ) : (
                            'Compare'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {showResults && (
        <ResultsDisplay
          results={results}
          onClose={() => setShowResults(false)}
          onCopy={copyResults}
        />
      )}

      {showRules && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-2xl translate-x-2 translate-y-2 blur-lg"></div>
            
            <Card className="relative z-10 w-full max-w-4xl bg-white shadow-2xl border-0 rounded-2xl max-h-[85vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white p-6 relative rounded-t-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-lg shadow-black/10">
                      <img 
                        src="/lovable-uploads/7a69c4fd-3d5e-45d2-b3c8-c758260eb538.png" 
                        alt="JSW Logo" 
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <h2 className="text-xl font-bold">Usage Rules & Guidelines</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowRules(false)}
                    className="text-white hover:bg-white/20 h-10 w-10 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-0">
                <div className="max-h-[70vh] overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                  <div className="p-8 space-y-8">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                      <h3 className="font-semibold text-blue-600 mb-6 flex items-center text-xl">
                        📄 Original Document Requirements
                      </h3>
                      <div className="space-y-4 text-gray-700">
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Paste well-formatted text from MS Word offline version with proper indentation</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Maintain original spacing, line breaks, and document structure</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Include all relevant content sections for accurate comparison</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Preserve formatting elements like headers, bullet points, and numbering</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                      <h3 className="font-semibold text-blue-600 mb-6 flex items-center text-xl">
                        📅 Date-Time Format Guidelines
                      </h3>
                      <div className="space-y-4 text-gray-700">
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Copy exact format from email header (case and space sensitive)</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Include all punctuation marks and special characters as shown</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-500 mt-4">
                          <p className="text-base font-medium text-gray-800 mb-3">Examples:</p>
                          <div className="space-y-2 text-sm text-gray-600 font-mono bg-white p-4 rounded border">
                            <p className="py-1">"Mon, 15 Jan 2024 10:30:00 GMT"</p>
                            <p className="py-1">"2024-01-15T10:30:00Z"</p>
                            <p className="py-1">"January 15, 2024 at 10:30 AM"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                      <h3 className="font-semibold text-blue-600 mb-6 flex items-center text-xl">
                        🏷️ Email Marker Configuration
                      </h3>
                      <div className="space-y-4 text-gray-700">
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Use exact markers from email signature (****,++++, etc.)</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Include sender's name exactly as it appears in signature</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Copy trailing characters and formatting precisely</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-500 mt-4">
                          <p className="text-base font-medium text-gray-800 mb-3">Common Markers:</p>
                          <div className="space-y-2 text-sm text-gray-600 font-mono bg-white p-4 rounded border">
                            <p className="py-1">**** John Doe ****</p>
                            <p className="py-1">++++ Jane Smith ++++</p>
                            <p className="py-1">--- Best Regards, Mike ---</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-8 rounded-xl shadow-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-600 mb-6 flex items-center text-xl">
                        📧 Microsoft Outlook Requirements
                      </h3>
                      <div className="space-y-4 text-gray-700">
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Open Microsoft Outlook webpage before initiating comparison</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Supported domains: outlook.live.com, outlook.office.com, outlook.office365.com</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Compare button activates only when proper conditions are met</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Ensure page is fully loaded before starting comparison</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-xl shadow-lg border border-emerald-200">
                      <h3 className="font-semibold text-emerald-600 mb-6 flex items-center text-xl">
                        ⚡ Processing & Performance Tips
                      </h3>
                      <div className="space-y-4 text-gray-700">
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Processing time varies based on document and email content size</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Minimize window to preserve input data during processing</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="leading-relaxed text-base">Results are automatically formatted for easy review and copying</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t bg-gradient-to-r from-gray-50 to-gray-100 p-6 flex justify-end rounded-b-2xl">
                  <Button
                    onClick={() => setShowRules(false)}
                    className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl px-8 py-3"
                  >
                    Got it
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailComparisonTool;
