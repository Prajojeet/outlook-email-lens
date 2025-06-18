
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  isMinimized: boolean;
  onOpen: () => void;
  onRestore: () => void;
}

const FloatingActionButton = ({ isMinimized, onOpen, onRestore }: FloatingActionButtonProps) => {
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full translate-x-2 translate-y-2 blur-md"></div>
          <Button
            onClick={onRestore}
            className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white p-3 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]"
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
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full translate-x-2 translate-y-2 blur-md"></div>
        <Button
          onClick={onOpen}
          className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]"
          size="lg"
        >
          📧 Email Lens
        </Button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
