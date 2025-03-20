"use client"

import * as React from "react"
// Remove Radix imports
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

// Create a simple checkbox component that doesn't use Radix UI at all
interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
}

// Simple checkbox component using plain HTML input
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked = false, onCheckedChange, className, id, disabled, ...props }, ref) => {
    // Use internal state to prevent infinite loops
    const [internalChecked, setInternalChecked] = React.useState(checked);
    
    // Update internal state when props change
    React.useEffect(() => {
      setInternalChecked(checked);
    }, [checked]);
    
    // Handle change
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      setInternalChecked(newValue);
      
      // Use setTimeout to break potential update cycles
      if (onCheckedChange) {
        setTimeout(() => {
          onCheckedChange(newValue);
        }, 0);
      }
    }, [onCheckedChange]);
    
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <input
          type="checkbox"
          ref={ref}
          id={id}
          checked={internalChecked}
          onChange={handleChange}
          disabled={disabled}
          className="appearance-none h-4 w-4 rounded-sm border border-gray-500 bg-transparent relative z-10"
          {...props}
        />
        {internalChecked && (
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <Check className="h-3 w-3 text-cyan-500" />
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox }
