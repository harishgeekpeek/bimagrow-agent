'use client';

import React from 'react';
import { createTextarea } from '@gluestack-ui/core/textarea/creator';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { TextInput, View } from 'react-native';

const UITextarea = createTextarea({
  Root: View,
  Input: TextInput,
});

const textareaStyle = tva({
  base: 'border-background-300 rounded border data-[hover=true]:border-outline-400 data-[focus=true]:border-primary-700 data-[focus=true]:hover:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:hover:border-background-300 data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[focus=true]:web:ring-1 data-[focus=true]:web:ring-inset data-[focus=true]:web:ring-indicator-primary data-[invalid=true]:web:ring-1 data-[invalid=true]:web:ring-inset data-[invalid=true]:web:ring-indicator-error',
  variants: {
    size: {
      sm: 'min-h-20',
      md: 'min-h-24',
      lg: 'min-h-32',
    },
  },
});

const textareaInputStyle = tva({
  base: 'flex-1 px-3 py-3 text-base text-typography-900 placeholder:text-typography-500 web:cursor-text web:outline-0 web:outline-none web:data-[disabled=true]:cursor-not-allowed',
});

type ITextareaProps = React.ComponentProps<typeof UITextarea> &
  VariantProps<typeof textareaStyle> & { className?: string };

const Textarea = React.forwardRef<
  React.ComponentRef<typeof UITextarea>,
  ITextareaProps
>(function Textarea({ className, size = 'md', ...props }, ref) {
  return (
    <UITextarea
      ref={ref}
      {...props}
      className={textareaStyle({ size, class: className })}
    />
  );
});

type ITextareaInputProps = React.ComponentProps<typeof UITextarea.Input> &
  VariantProps<typeof textareaInputStyle> & { className?: string };

const TextareaInput = React.forwardRef<
  React.ComponentRef<typeof UITextarea.Input>,
  ITextareaInputProps
>(function TextareaInput({ className, ...props }, ref) {
  return (
    <UITextarea.Input
      ref={ref}
      {...props}
      className={textareaInputStyle({ class: className })}
    />
  );
});

Textarea.displayName = 'Textarea';
TextareaInput.displayName = 'TextareaInput';

export { Textarea, TextareaInput };
