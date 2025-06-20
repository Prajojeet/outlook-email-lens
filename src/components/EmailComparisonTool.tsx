
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useChromeExtension } from '@/hooks/useChromeExtension';
import { useStorageData } from '@/hooks/useStorageData';
import FloatingActionButton from './FloatingActionButton';
import ComparisonForm from './ComparisonForm';
import ResultsDisplay from './ResultsDisplay';
import UsageRulesModal from './UsageRulesModal';
import SkeletonLoader from './SkeletonLoader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Minimize } from 'lucide-react';

// Configure your API endpoint here - change this to your Azure endpoint once deployed
const API_ENDPOINT = 'http://localhost:8000/compare';

const EmailComparisonTool = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState('');
  const { toast } = useToast();

  const { isChromeExtension, scrapePageHTML, isOnOutlook } = useChromeExtension();
  const { comparisonData, updateField, resetData, clearStorage } = useStorageData(isChromeExtension());

  const isFormValid = comparisonData.originalDocument.trim() !== '' && 
                     comparisonData.dateTimeFormat.trim() !== '' && 
                     comparisonData.marker.trim() !== '';

  const canCompare = isFormValid && isOnOutlook;

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

      // Scrape HTML body content from current page
      const htmlBodyContent = await scrapePageHTML();

      toast({
        title: "Content Extracted",
        description: `HTML content extracted successfully (${(htmlBodyContent.length / 1024).toFixed(2)} KB). Sending to backend...`,
      });

      // Prepare payload for your backend
      const payload = {
        originalDocument: comparisonData.originalDocument,
        dateTimeFormat: comparisonData.dateTimeFormat,
        marker: comparisonData.marker,
        htmlBodyContent: htmlBodyContent,
        currentUrl: currentUrl,
        timestamp: new Date().toISOString()
      };

      console.log('Sending payload to backend:', {
        ...payload,
        htmlBodyContent: `${htmlBodyContent.length} characters`
      });

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Backend processing failed');
      }

      // Display the HTML output as formatted text
      setResults(data.html_output);
      setShowResults(true);
      
      toast({
        title: "Comparison Complete",
        description: data.message || "Email comparison has been processed successfully.",
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
      // Convert HTML to plain text for copying
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = results;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      
      await navigator.clipboard.writeText(plainText);
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

  const handleReset = () => {
    resetData();
    setShowResults(false);
    setResults('');
    setError(null);
  };

  const handleClose = async () => {
    await clearStorage();
    setIsOpen(false);
    handleReset();
  };

  if (!isOpen) {
    return (
      <FloatingActionButton
        isMinimized={false}
        onOpen={() => setIsOpen(true)}
        onRestore={() => {}}
      />
    );
  }

  if (isMinimized) {
    return (
      <FloatingActionButton
        isMinimized={true}
        onOpen={() => {}}
        onRestore={() => setIsMinimized(false)}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="relative w-full max-w-3xl h-[85vh]">
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
                <ComparisonForm
                  comparisonData={comparisonData}
                  onInputChange={updateField}
                  onCompare={handleCompare}
                  onReset={handleReset}
                  onShowRules={() => setShowRules(true)}
                  isLoading={isLoading}
                  isOnOutlook={isOnOutlook}
                  error={error}
                />
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
        <UsageRulesModal 
          isOpen={showRules}
          onClose={() => setShowRules(false)} 
        />
      )}
    </>
  );
};

export default EmailComparisonTool;
