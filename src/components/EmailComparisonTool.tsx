
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
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          📧 Email Lens
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Main Extension Popup */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  📧
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
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
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
                    className="min-h-[300px]"
                    label="Original Document"
                  />
                </div>

                {/* Date-Time Format Input */}
                <div className="space-y-2">
                  <TextInputBox
                    placeholder="Paste the exact date-time format as written on the particular mail you want to be compared (Case and space Sensitive)"
                    value={comparisonData.dateTimeFormat}
                    onChange={(value) => handleInputChange('dateTimeFormat', value)}
                    className="min-h-[80px]"
                    label="Date-Time Format"
                  />
                </div>

                {/* Marker Input */}
                <div className="space-y-2">
                  <TextInputBox
                    placeholder="Any marker like ****,++++ or Sender's name from the mail ending as it is"
                    value={comparisonData.marker}
                    onChange={(value) => handleInputChange('marker', value)}
                    className="min-h-[80px]"
                    label="Email Marker"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowRules(true)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Usage Rules
                  </Button>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={handleCompare}
                      disabled={!isFormValid}
                      className={`px-8 transition-all duration-300 ${
                        isFormValid 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
            )}
          </CardContent>
        </Card>
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
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white shadow-2xl">
            <div className="bg-blue-600 text-white p-4 relative">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Usage Rules & Guidelines</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowRules(false)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-blue-600 mb-2">📄 Original Document</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Paste well-formatted text from MS Word</li>
                    <li>Maintain proper indentation and spacing</li>
                    <li>Include all relevant content for comparison</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-600 mb-2">📅 Date-Time Format</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Copy exact format from email (case sensitive)</li>
                    <li>Include spaces and special characters as shown</li>
                    <li>Example: "Mon, 15 Jan 2024 10:30:00 GMT"</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-600 mb-2">🏷️ Email Marker</h3>
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
      )}
    </>
  );
};

export default EmailComparisonTool;
