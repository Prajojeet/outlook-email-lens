
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useOutlookDetection } from '@/hooks/useOutlookDetection';
import EmailToolModal from './EmailToolModal';
import ResultsDisplay from './ResultsDisplay';
import UsageRulesModal from './UsageRulesModal';

const EmailComparisonTool = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [results, setResults] = useState('');
  const { toast } = useToast();
  const isOnOutlook = useOutlookDetection();

  const handleShowResults = (resultsData: string) => {
    setResults(resultsData);
    setShowResults(true);
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results);
    toast({
      title: "Copied!",
      description: "Results copied to clipboard successfully.",
    });
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

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* 3D Shadow for minimized button */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full translate-x-2 translate-y-2 blur-md"></div>
          <Button
            onClick={() => setIsMinimized(false)}
            className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]"
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
      <EmailToolModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onMinimize={() => setIsMinimized(true)}
        onShowRules={() => setShowRules(true)}
        onShowResults={handleShowResults}
        isOnOutlook={isOnOutlook}
      />

      <ResultsDisplay
        results={results}
        onClose={() => setShowResults(false)}
        onCopy={copyResults}
        isOpen={showResults}
      />

      <UsageRulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
    </>
  );
};

export default EmailComparisonTool;
