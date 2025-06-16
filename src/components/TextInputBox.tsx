
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
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label}
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
            "w-full p-4 border border-gray-300 rounded-lg resize-none transition-all duration-200",
            "placeholder:text-gray-400 placeholder:text-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "hover:border-gray-400",
            className
          )}
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.5'
          }}
        />
        {isFocused && (
          <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 pointer-events-none" />
        )}
      </div>
      <div className="text-xs text-gray-500 flex justify-between">
        <span>{value.length} characters</span>
        {value.length > 0 && (
          <span className="text-blue-600">✓ Content added</span>
        )}
      </div>
    </div>
  );
};

export default TextInputBox;
