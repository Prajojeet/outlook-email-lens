
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TextInputBoxProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

const TextInputBox = ({ placeholder, value, onChange, className, label }: TextInputBoxProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-3">
      {label && (
        <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          <span>{label}</span>
        </Label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full p-4 border-2 border-gray-200 rounded-xl resize-none transition-all duration-300",
            "placeholder:text-gray-400 placeholder:text-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "hover:border-blue-300 hover:shadow-md",
            "bg-gradient-to-br from-white to-gray-50",
            isFocused && "shadow-lg transform scale-[1.01]",
            className
          )}
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.6'
          }}
        />
        {isFocused && (
          <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500/30 pointer-events-none animate-pulse" />
        )}
      </div>
      <div className="text-xs text-gray-500 flex justify-between items-center">
        <span className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <span>{value.length} characters</span>
        </span>
        {value.length > 0 && (
          <span className="text-blue-600 flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            <span>✓ Content added</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default TextInputBox;
