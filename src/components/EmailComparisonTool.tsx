import { useState, useEffect } from 'react';
import { X, Copy, Info, CheckCircle, Loader2 } from 'lucide-react';
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
  const [showResults, setShowResults] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    originalDocument: '',
    dateTimeFormat: '',
    marker: ''
  });
  const [results, setResults] = useState('');
  const { toast } = useToast();

  const isFormValid = comparisonData.originalDocument.trim() !== '' && 
                     comparisonData.dateTimeFormat.trim() !== '' && 
                     comparisonData.marker.trim() !== '';

  const handleInputChange = (field: keyof ComparisonData, value: string) => {
    setComparisonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompare = async () => {
    if (!isFormValid) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before comparing.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call to GCP engine
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response - replace with actual API call
      const mockResponse = `
        <div class="comparison-result">
          <h2 style="color: #1e40af; margin-bottom: 16px;">Email Comparison Results</h2>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #475569; margin-bottom: 8px;">Original Document Analysis</h3>
            <p style="color: #64748b;">Document processed successfully with ${comparisonData.originalDocument.length} characters.</p>
          </div>
          <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #1e40af; margin-bottom: 8px;">Date-Time Format Detected</h3>
            <p style="color: #1e40af; font-family: monospace;">${comparisonData.dateTimeFormat}</p>
          </div>
          <div style="background: #f0f9ff; padding: 16px; border-radius: 8px;">
            <h3 style="color: #0369a1; margin-bottom: 8px;">Marker Identified</h3>
            <p style="color: #0369a1; font-weight: 600;">${comparisonData.marker}</p>
          </div>
        </div>
      `;
      
      setResults(mockResponse);
      setShowResults(true);
    } catch (error) {
      toast({
        title: "Comparison Failed",
        description: "An error occurred while processing your request.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results);
    toast({
      title: "Copied!",
      description: "Results copied to clipboard successfully.",
    });
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

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* 3D Shadow for floating button */}
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

  return (
    <>
      {/* Main Extension Popup */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="relative">
          {/* 3D Shadow layers for main card */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-2xl translate-x-3 translate-y-3 blur-lg"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-2xl translate-x-1.5 translate-y-1.5 blur-sm"></div>
          
          <Card className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 rounded-2xl">
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white p-6 relative rounded-t-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg shadow-black/10">
                    <img 
                      src="/lovable-uploads/7a69c4fd-3d5e-45d2-b3c8-c758260eb538.png" 
                      alt="JSW Logo" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">Email Comparison Tool</h1>
                    <p className="text-blue-100 text-sm">Compare and analyze your emails efficiently</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] bg-gradient-to-b from-gray-50 to-white">
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <div className="space-y-6">
                  {/* Original Document Input - 75% of space */}
                  <div className="space-y-2">
                    <TextInputBox
                      placeholder="Paste your original well indented Document here from MS Word Offline version"
                      value={comparisonData.originalDocument}
                      onChange={(value) => handleInputChange('originalDocument', value)}
                      className="min-h-[300px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
                      label="Original Document"
                    />
                  </div>

                  {/* Date-Time Format Input */}
                  <div className="space-y-2">
                    <TextInputBox
                      placeholder="Paste the exact date-time format as written on the particular mail you want to be compared (Case and space Sensitive)"
                      value={comparisonData.dateTimeFormat}
                      onChange={(value) => handleInputChange('dateTimeFormat', value)}
                      className="min-h-[80px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
                      label="Date-Time Format"
                    />
                  </div>

                  {/* Marker Input */}
                  <div className="space-y-2">
                    <TextInputBox
                      placeholder="Any marker like ****,++++ or Sender's name from the mail ending as it is"
                      value={comparisonData.marker}
                      onChange={(value) => handleInputChange('marker', value)}
                      className="min-h-[80px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
                      label="Email Marker"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setShowRules(true)}
                      className="text-blue-600 border-2 border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Usage Rules
                    </Button>
                    
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={resetForm}
                        className="border-2 border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Reset
                      </Button>
                      <div className="relative">
                        {isFormValid && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-lg translate-x-0.5 translate-y-0.5 blur-sm"></div>
                        )}
                        <Button
                          onClick={handleCompare}
                          disabled={!isFormValid}
                          className={`relative px-8 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-1px] rounded-lg shadow-lg hover:shadow-xl ${
                            isFormValid 
                              ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white' 
                              : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {isFormValid ? (
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="relative">
            {/* 3D Shadow for rules modal */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-2xl translate-x-2 translate-y-2 blur-lg"></div>
            
            <Card className="relative z-10 w-full max-w-lg bg-white shadow-2xl border-0 rounded-2xl">
              <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white p-6 relative rounded-t-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-lg shadow-black/10">
                      <img 
                        src="/lovable-uploads/7a69c4fd-3d5e-45d2-b3c8-c758260eb538.png" 
                        alt="JSW Logo" 
                        className="w-6 h-6 object-contain"
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
