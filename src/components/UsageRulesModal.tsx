
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
                onClick={onClose}
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

              <div className="bg-blue-50 p-4 rounded-xl shadow-lg border border-blue-100">
                <h3 className="font-semibold text-blue-600 mb-2 flex items-center">
                  📧 Outlook Requirement
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Open Microsoft Outlook webpage before comparing</li>
                  <li>Extension works with outlook.live.com and outlook.office.com</li>
                  <li>Compare button glows only when on Outlook</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsageRulesModal;
