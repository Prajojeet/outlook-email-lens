
import { Loader2 } from 'lucide-react';

const SkeletonLoader = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Processing Your Request</h3>
          <p className="text-gray-500 text-sm">Analyzing email content and comparing with your document...</p>
          
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <span>Parsing original document</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <span>Extracting email content</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span>Running comparison algorithm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton UI Elements */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
        
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
