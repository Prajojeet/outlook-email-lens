
import { useState } from 'react';
import { X, Info, CheckCircle, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import TextInputBox from './TextInputBox';
import SkeletonLoader from './SkeletonLoader';

interface ComparisonData {
  originalDocument: string;
  dateTimeFormat: string;
  marker: string;
}

interface EmailToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onShowRules: () => void;
  onShowResults: (results: string) => void;
  isOnOutlook: boolean;
}

const EmailToolModal = ({ 
  isOpen, 
  onClose, 
  onMinimize, 
  onShowRules, 
  onShowResults, 
  isOnOutlook 
}: EmailToolModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    originalDocument: '',
    dateTimeFormat: '',
    marker: ''
  });
  const { toast } = useToast();

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
      
      onShowResults(mockResponse);
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

  const resetForm = () => {
    setComparisonData({
      originalDocument: '',
      dateTimeFormat: '',
      marker: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl h-[50vh]">
        {/* 3D Shadow layers for main card */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-2xl translate-x-3 translate-y-3 blur-lg"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-2xl translate-x-1.5 translate-y-1.5 blur-sm"></div>
        
        <Card className="relative z-10 w-full h-full overflow-hidden bg-white shadow-2xl border-0 rounded-2xl flex flex-col">
          <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white p-4 relative rounded-t-2xl shadow-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg shadow-black/10">
                  <img 
                    src="/lovable-uploads/7a69c4fd-3d5e-45d2-b3c8-c758260eb538.png" 
                    alt="JSW Logo" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Email Comparison Tool</h1>
                  <p className="text-blue-100 text-xs">Compare and analyze your emails efficiently</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMinimize}
                  className="text-white hover:bg-white/20 h-8 w-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                  title="Minimize"
                >
                  <Minimize className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 h-8 w-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <CardContent className="p-4 overflow-y-auto flex-1 bg-gradient-to-b from-gray-50 to-white">
            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <div className="space-y-4 h-full">
                {/* Original Document Input - Takes most space */}
                <div className="flex-1">
                  <TextInputBox
                    placeholder="Paste your original well indented Document here from MS Word Offline version"
                    value={comparisonData.originalDocument}
                    onChange={(value) => handleInputChange('originalDocument', value)}
                    className="min-h-[200px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
                    label="Original Document"
                  />
                </div>

                {/* Date-Time Format Input */}
                <div>
                  <TextInputBox
                    placeholder="Paste the exact date-time format as written on the particular mail you want to be compared (Case and space Sensitive)"
                    value={comparisonData.dateTimeFormat}
                    onChange={(value) => handleInputChange('dateTimeFormat', value)}
                    className="min-h-[60px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
                    label="Date-Time Format"
                  />
                </div>

                {/* Marker Input */}
                <div>
                  <TextInputBox
                    placeholder="Any marker like ****,++++ or Sender's name from the mail ending as it is"
                    value={comparisonData.marker}
                    onChange={(value) => handleInputChange('marker', value)}
                    className="min-h-[60px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
                    label="Email Marker"
                  />
                </div>

                {/* Status indicator for Outlook */}
                {!isOnOutlook && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-amber-700 text-sm text-center">
                      📧 Please open Microsoft Outlook webpage for comparing emails
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={onShowRules}
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
                        disabled={!canCompare}
                        className={`relative px-6 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-1px] rounded-lg shadow-lg hover:shadow-xl ${
                          canCompare
                            ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-blue-200/50' 
                            : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                        }`}
                        size="sm"
                      >
                        {canCompare ? (
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
  );
};

export default EmailToolModal;
