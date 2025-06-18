
import { Info, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TextInputBox from './TextInputBox';
import { ComparisonData } from '@/hooks/useStorageData';

interface ComparisonFormProps {
  comparisonData: ComparisonData;
  onInputChange: (field: keyof ComparisonData, value: string) => void;
  onCompare: () => void;
  onReset: () => void;
  onShowRules: () => void;
  isLoading: boolean;
  isOnOutlook: boolean;
  error: string | null;
}

const ComparisonForm = ({ 
  comparisonData, 
  onInputChange, 
  onCompare, 
  onReset, 
  onShowRules, 
  isLoading, 
  isOnOutlook, 
  error 
}: ComparisonFormProps) => {
  const isFormValid = comparisonData.originalDocument.trim() !== '' && 
                     comparisonData.dateTimeFormat.trim() !== '' && 
                     comparisonData.marker.trim() !== '';

  const canCompare = isFormValid && isOnOutlook;

  return (
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
          onChange={(value) => onInputChange('originalDocument', value)}
          className="min-h-[200px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
          label="Original Document"
        />
      </div>

      <div>
        <TextInputBox
          placeholder="Paste the exact date-time format as written on the particular mail you want to be compared (Case and space Sensitive)"
          value={comparisonData.dateTimeFormat}
          onChange={(value) => onInputChange('dateTimeFormat', value)}
          className="min-h-[70px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
          label="Date-Time Format"
        />
      </div>

      <div>
        <TextInputBox
          placeholder="Any marker like ****,++++ or Sender's name from the mail ending as it is"
          value={comparisonData.marker}
          onChange={(value) => onInputChange('marker', value)}
          className="min-h-[70px] border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
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

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onShowRules}
          className="text-blue-600 border-2 border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 transition-all duration-200 shadow-md hover:shadow-lg px-6 py-2.5"
          size="sm"
        >
          <Info className="h-4 w-4 mr-2" />
          Usage Rules
        </Button>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onReset}
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
              onClick={onCompare}
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
  );
};

export default ComparisonForm;
