
import { X, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

interface ResultsDisplayProps {
  results: string;
  onClose: () => void;
  onCopy: () => void;
}

const ResultsDisplay = ({ results, onClose, onCopy }: ResultsDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-white shadow-2xl border-0 rounded-2xl">
        <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 text-white p-6 relative rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <img 
                  src="/lovable-uploads/7a69c4fd-3d5e-45d2-b3c8-c758260eb538.png" 
                  alt="JSW Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">Comparison Results</h1>
                <p className="text-emerald-100 text-sm">Analysis completed successfully</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="text-white hover:bg-white/20 h-10 w-10 rounded-full transition-all duration-200"
                title="Copy results"
              >
                {copied ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-10 w-10 rounded-full transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="max-h-[calc(90vh-140px)] overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            <div 
              className="p-6"
              dangerouslySetInnerHTML={{ __html: results }}
            />
          </div>
          
          <div className="border-t bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex justify-between items-center rounded-b-2xl">
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Results generated • Ready to copy</span>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-2 border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 transition-all duration-200"
              >
                Close
              </Button>
              <Button
                onClick={handleCopy}
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Results
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
