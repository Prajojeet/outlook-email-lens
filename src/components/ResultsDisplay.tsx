
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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                ✨
              </div>
              <div>
                <h1 className="text-xl font-bold">Comparison Results</h1>
                <p className="text-green-100 text-sm">Analysis completed successfully</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="text-white hover:bg-white/20 h-8 w-8"
                title="Copy results"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
            <div 
              className="p-6"
              dangerouslySetInnerHTML={{ __html: results }}
            />
          </div>
          
          <div className="border-t bg-gray-50 p-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Results generated • Ready to copy
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 hover:bg-gray-100"
              >
                Close
              </Button>
              <Button
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
