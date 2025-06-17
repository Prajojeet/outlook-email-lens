
import { useState, useEffect } from 'react';
import { X, Copy, Info, CheckCircle, Loader2, Minimize } from 'lucide-react';
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
  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    originalDocument: '',
    dateTimeFormat: '',
    marker: ''
  });
  const [results, setResults] = useState('');
  const { toast } = useToast();

  // Load data from Chrome storage on component mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        // Try Chrome extension storage first
        if (typeof chrome !== 'undefined' && chrome.storage) {
          const result = await chrome.storage.local.get(['emailComparisonData']);
          if (result.emailComparisonData) {
            setComparisonData(result.emailComparisonData);
          }
        } else {
          // Fallback to localStorage for development
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
        if (typeof chrome !== 'undefined' && chrome.storage) {
          await chrome.storage.local.set({ emailComparisonData: comparisonData });
        } else {
          // Fallback to localStorage for development
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
        // For Chrome extension, check the current tab
        if (typeof chrome !== 'undefined' && chrome.tabs) {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          const currentUrl = tab.url?.toLowerCase() || '';
          const isOutlook = currentUrl.includes('outlook.live.com') || 
                           currentUrl.includes('outlook.office.com') || 
                           currentUrl.includes('outlook.office365.com');
          setIsOnOutlook(isOutlook);
        } else {
          // Fallback for development/web version
          const currentUrl = window.location.href.toLowerCase();
          const isOutlook = currentUrl.includes('outlook.live.com') || 
                           currentUrl.includes('outlook.office.com') || 
                           currentUrl.includes('outlook.office365.com') ||
                           currentUrl.includes('mail.google.com'); // Added Gmail for testing
          setIsOnOutlook(isOutlook);
        }
      } catch (error) {
        console.log('Cannot access tab information');
        setIsOnOutlook(false);
      }
    };

    checkOutlookPage();
    
    // Check periodically for URL changes
    const intervalId = setInterval(checkOutlookPage, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  const isFormValid = comparisonData.originalDocument.trim() !== '' && 
                     comparisonData.dateTimeFormat.trim() !== '' && 
                     comparisonData.marker.trim() !== '';

  const canCompare = isFormValid && isOnOutlook;

  const handleInputChange = (field: keyof ComparisonData, value: string) => {
    setComparisonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompare = async () => {
    if (!canCompare) {
      if (!isFormValid) {
        toast({
          title: "Missing Information",
          description: "Please fill in all fields before comparing.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Outlook Required",
          description: "Please open Microsoft Outlook webpage to compare emails.",
          variant: "destructive"
        });
      }
      return;
    }

    setIsLoading(true);
    
    try {
      // Make actual API call to your backend
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalDocument: comparisonData.originalDocument,
          dateTimeFormat: comparisonData.dateTimeFormat,
          marker: comparisonData.marker,
          currentUrl: typeof chrome !== 'undefined' ? 
            (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.url : 
            window.location.href
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Process the response and format it for display
      const formattedResults = `
        <div class="comparison-result">
          <h2 style="color: #1e40af; margin-bottom: 16px;">Email Comparison Results</h2>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #475569; margin-bottom: 8px;">Analysis Complete</h3>
            <p style="color: #64748b;">${data.message || 'Comparison completed successfully.'}</p>
          </div>
          <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #1e40af; margin-bottom: 8px;">Results</h3>
            <pre style="color: #1e40af; font-family: monospace; white-space: pre-wrap;">${JSON.stringify(data.results || data, null, 2)}</pre>
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
      toast({
        title: "Comparison Failed",
        description: error instanceof Error ? error.message : "An error occurred while processing your request.",
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
  };

  const handleClose = async () => {
    // Clear stored data when closing
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
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
      {/* Main Extension Popup - Half Screen Size */}
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

            <CardContent className="p-5 overflow-y-auto flex-1 bg-gradient-to-b from-gray-50 to-white">
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <div className="space-y-5 h-full">
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

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setShowRules(true)}
                      className="text-blue-600 border-2 border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 transition-all duration-200 shadow-md hover:shadow-lg"
                      size="sm"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Usage Rules
                    </Button>
                    
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={resetForm}
                        className="border-2 border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
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
                          className={`relative px-6 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-1px] rounded-lg shadow-lg hover:shadow-xl ${
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

      {/* Results Display */}
      {showResults && (
        <ResultsDisplay
          results={results}
          onClose={() => setShowResults(false)}
          onCopy={copyResults}
        />
      )}

      {/* Usage Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-60 flex items-center justify-center p-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-2xl translate-x-2 translate-y-2 blur-lg"></div>
            
            <Card className="relative z-10 w-full max-w-lg bg-white shadow-2xl border-0 rounded-2xl">
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
                    <h2 className="text-lg font-bold">Usage Rules & Guidelines</h2>
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
              <CardContent className="p-6 bg-gradient-to-b from-gray-50 to-white rounded-b-2xl">
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="font-semibold text-blue-600 mb-2 flex items-center">
                      📄 Original Document
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Paste well-formatted text from MS Word</li>
                      <li>Maintain proper indentation and spacing</li>
                      <li>Include all relevant content for comparison</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="font-semibold text-blue-600 mb-2 flex items-center">
                      📅 Date-Time Format
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Copy exact format from email (case sensitive)</li>
                      <li>Include spaces and special characters as shown</li>
                      <li>Example: "Mon, 15 Jan 2024 10:30:00 GMT"</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="font-semibold text-blue-600 mb-2 flex items-center">
                      🏷️ Email Marker
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Use exact markers from email (****,++++, etc.)</li>
                      <li>Include sender's name as it appears</li>
                      <li>Copy trailing characters exactly</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl shadow-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-600 mb-2 flex items-center">
                      📧 Outlook Requirement
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Open Microsoft Outlook webpage before comparing</li>
                      <li>Extension works with outlook.live.com and outlook.office.com</li>
                      <li>Compare button glows only when on Outlook</li>
                    </ul>
                  </div>
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
