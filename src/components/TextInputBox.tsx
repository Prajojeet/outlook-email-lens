
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
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm"></div>
          <span>{label}</span>
        </Label>
      )}
      <div className="relative">
        {/* 3D Shadow layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-xl translate-x-1 translate-y-1 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200/40 to-gray-300/40 rounded-xl translate-x-0.5 translate-y-0.5"></div>
        
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "relative z-10 w-full p-4 border-2 border-gray-200 rounded-xl resize-none transition-all duration-300",
            "placeholder:text-gray-400 placeholder:text-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "hover:border-blue-300 hover:shadow-lg",
            "bg-gradient-to-br from-white via-white to-gray-50/50",
            "shadow-lg shadow-gray-200/50",
            isFocused && "shadow-xl shadow-blue-200/30 transform scale-[1.01] translate-y-[-2px]",
            className
          )}
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.6',
            backdropFilter: 'blur(10px)'
          }}
        />
        {isFocused && (
          <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500/30 pointer-events-none animate-pulse z-20" />
        )}
      </div>
      <div className="text-xs text-gray-500 flex justify-between items-center">
        <span className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-gray-400 rounded-full shadow-sm"></div>
          <span>{value.length} characters</span>
        </span>
        {value.length > 0 && (
          <span className="text-blue-600 flex items-center space-x-1 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full shadow-sm border border-blue-100/50">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
            <span>✓ Content added</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default TextInputBox;
