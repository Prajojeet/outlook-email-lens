
import { Loader2, CheckCircle, Clock, Database, Globe } from 'lucide-react';

const SkeletonLoader = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-lg"></div>
            <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto relative z-10" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-700 mb-3">Processing Your Request</h3>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Our AI engine is analyzing your document and extracting email content for comprehensive comparison.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Connecting to Azure backend</span>
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <Database className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">Parsing original document structure</span>
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Extracting HTML email content</span>
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Running intelligent comparison algorithm</span>
            </div>
          </div>
          
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-600 font-medium">
              ⏱️ Estimated processing time: 15-30 seconds
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Please keep this window open while we process your request
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
        
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
