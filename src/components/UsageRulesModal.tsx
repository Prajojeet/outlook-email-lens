
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UsageRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsageRulesModal = ({ isOpen, onClose }: UsageRulesModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-2xl translate-x-2 translate-y-2 blur-lg"></div>
        
        <Card className="relative z-10 w-full max-w-4xl bg-white shadow-2xl border-0 rounded-2xl max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white p-6 relative rounded-t-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-lg shadow-black/10">
                  <img 
                    src="/lovable-uploads/7a69c4fd-3d5e-45d2-b3c8-c758260eb538.png" 
                    alt="JSW Logo" 
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <h2 className="text-xl font-bold">Usage Rules & Guidelines</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-10 w-10 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-0">
            <div className="max-h-[70vh] overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
              <div className="p-8 space-y-8">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="font-semibold text-blue-600 mb-6 flex items-center text-xl">
                    📄 Original Document Requirements
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Paste well-formatted text from MS Word offline version with proper indentation</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Maintain original spacing, line breaks, and document structure</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Include all relevant content sections for accurate comparison</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Preserve formatting elements like headers, bullet points, and numbering</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="font-semibold text-blue-600 mb-6 flex items-center text-xl">
                    📅 Date-Time Format Guidelines
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Copy exact format from email header (case and space sensitive)</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Include all punctuation marks and special characters as shown</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-500 mt-4">
                      <p className="text-base font-medium text-gray-800 mb-3">Examples:</p>
                      <div className="space-y-2 text-sm text-gray-600 font-mono bg-white p-4 rounded border">
                        <p className="py-1">"Mon, 15 Jan 2024 10:30:00 GMT"</p>
                        <p className="py-1">"2024-01-15T10:30:00Z"</p>
                        <p className="py-1">"January 15, 2024 at 10:30 AM"</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="font-semibold text-blue-600 mb-6 flex items-center text-xl">
                    🏷️ Email Marker Configuration
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Use exact markers from email signature (****,++++, etc.)</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Include sender's name exactly as it appears in signature</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Copy trailing characters and formatting precisely</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-500 mt-4">
                      <p className="text-base font-medium text-gray-800 mb-3">Common Markers:</p>
                      <div className="space-y-2 text-sm text-gray-600 font-mono bg-white p-4 rounded border">
                        <p className="py-1">**** John Doe ****</p>
                        <p className="py-1">++++ Jane Smith ++++</p>
                        <p className="py-1">--- Best Regards, Mike ---</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-8 rounded-xl shadow-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-600 mb-6 flex items-center text-xl">
                    📧 Microsoft Outlook Requirements
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Open Microsoft Outlook webpage before initiating comparison</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Supported domains: outlook.live.com, outlook.office.com, outlook.office365.com</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Compare button activates only when proper conditions are met</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Ensure page is fully loaded before starting comparison</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-xl shadow-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-600 mb-6 flex items-center text-xl">
                    ⚡ Processing & Performance Tips
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Processing time varies based on document and email content size</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Minimize window to preserve input data during processing</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="leading-relaxed text-base">Results are automatically formatted for easy review and copying</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t bg-gradient-to-r from-gray-50 to-gray-100 p-6 flex justify-end rounded-b-2xl">
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl px-8 py-3"
              >
                Got it
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsageRulesModal;
