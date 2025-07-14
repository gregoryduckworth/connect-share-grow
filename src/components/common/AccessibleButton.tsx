
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends ButtonProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  loading?: boolean;
}

export function AccessibleButton({
  children,
  className,
  loading,
  disabled,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}: AccessibleButtonProps) {
  return (
    <Button
      className={cn(className)}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      {...props}
    >
      {children}
    </Button>
  );
}
