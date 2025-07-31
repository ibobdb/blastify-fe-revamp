'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Type,
} from 'lucide-react';

interface TextSelection {
  start: number;
  end: number;
  text: string;
}

interface FormatAction {
  type:
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strikethrough'
    | 'code'
    | 'monospace';
  symbol: string;
  icon: React.ComponentType<any>;
  label: string;
}

const formatActions: FormatAction[] = [
  { type: 'bold', symbol: '*', icon: Bold, label: 'Bold' },
  { type: 'italic', symbol: '_', icon: Italic, label: 'Italic' },
  { type: 'underline', symbol: '~', icon: Underline, label: 'Underline' },
  {
    type: 'strikethrough',
    symbol: '~',
    icon: Strikethrough,
    label: 'Strikethrough',
  },
  { type: 'code', symbol: '```', icon: Code, label: 'Code' },
  { type: 'monospace', symbol: '`', icon: Type, label: 'Monospace' },
];

export interface TextAreaAdvanceProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onSelectionChange?: (selection: TextSelection | null) => void;
}

export function TextAreaAdvance({
  value = '',
  onChange,
  onSelectionChange,
  className,
  placeholder = 'Type your message here...',
  ...props
}: TextAreaAdvanceProps) {
  const [text, setText] = useState(value);
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setText(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  const handleSelectionChange = useCallback(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    if (start !== end && selectedText.length > 0) {
      const selection: TextSelection = {
        start,
        end,
        text: selectedText,
      };

      setSelection(selection);
      onSelectionChange?.(selection);

      // Calculate toolbar position inside textarea near selected text
      const rect = textarea.getBoundingClientRect();
      const computedStyle = getComputedStyle(textarea);
      const lineHeight = parseInt(computedStyle.lineHeight, 10) || 20;
      const fontSize = parseInt(computedStyle.fontSize, 10) || 14;
      const paddingLeft = parseInt(computedStyle.paddingLeft, 10) || 12;
      const paddingTop = parseInt(computedStyle.paddingTop, 10) || 8;

      // Get precise position of selected text
      const beforeSelection = textarea.value.substring(0, end); // Use end position for toolbar
      const lines = beforeSelection.split('\n');
      const currentLine = lines.length - 1;
      const charInLine = lines[lines.length - 1].length;

      // Calculate character width more accurately
      const charWidth = fontSize * 0.6;

      // Position relative to textarea's content area (not viewport)
      const scrollTop = textarea.scrollTop;
      const scrollLeft = textarea.scrollLeft;

      // Calculate position inside textarea
      const lineTop = paddingTop + currentLine * lineHeight - scrollTop;
      const charLeft = paddingLeft + charInLine * charWidth - scrollLeft;

      // Toolbar dimensions
      const toolbarHeight = 40;
      const toolbarWidth = 200;
      const gap = 8;

      // Position toolbar near the end of selection
      let finalTop = lineTop + lineHeight + gap; // Below text by default
      let finalLeft = charLeft + gap; // To the right of text

      // Check if toolbar fits within textarea bounds
      const textareaHeight = textarea.clientHeight;
      const textareaWidth = textarea.clientWidth;

      // If toolbar goes below textarea, position above
      if (finalTop + toolbarHeight > textareaHeight - paddingTop) {
        finalTop = lineTop - toolbarHeight - gap;
      }

      // If toolbar goes beyond right edge, position to the left
      if (finalLeft + toolbarWidth > textareaWidth - paddingLeft) {
        finalLeft = charLeft - toolbarWidth - gap;
      }

      // Ensure toolbar stays within textarea bounds
      if (finalLeft < paddingLeft) {
        finalLeft = paddingLeft + gap;
      }
      if (finalTop < paddingTop) {
        finalTop = paddingTop + gap;
      }

      setToolbarPosition({ top: finalTop, left: finalLeft });
      setShowToolbar(true);
    } else {
      setSelection(null);
      onSelectionChange?.(null);
      setShowToolbar(false);
    }
  }, [onSelectionChange]);

  const applyFormat = useCallback(
    (action: FormatAction) => {
      if (!selection || !textareaRef.current) return;

      const { start, end, text: selectedText } = selection;
      let formattedText = '';

      switch (action.type) {
        case 'bold':
          formattedText = `*${selectedText}*`;
          break;
        case 'italic':
          formattedText = `_${selectedText}_`;
          break;
        case 'underline':
          formattedText = `~${selectedText}~`;
          break;
        case 'strikethrough':
          formattedText = `~${selectedText}~`;
          break;
        case 'code':
          formattedText = `\`\`\`${selectedText}\`\`\``;
          break;
        case 'monospace':
          formattedText = `\`${selectedText}\``;
          break;
        default:
          formattedText = selectedText;
      }

      const newText =
        text.substring(0, start) + formattedText + text.substring(end);
      setText(newText);
      onChange?.(newText);

      // Reset selection and hide toolbar
      setSelection(null);
      setShowToolbar(false);

      // Focus back to textarea
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newCursorPos = start + formattedText.length;
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    },
    [selection, text, onChange]
  );

  const handleMouseUp = useCallback(() => {
    setTimeout(handleSelectionChange, 10);
  }, [handleSelectionChange]);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle selection changes on arrow keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        setTimeout(handleSelectionChange, 10);
      }
    },
    [handleSelectionChange]
  );

  const handleBlur = useCallback(() => {
    // Delay hiding toolbar to allow button clicks
    setTimeout(() => {
      setShowToolbar(false);
      setSelection(null);
    }, 200);
  }, []);

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        onMouseUp={handleMouseUp}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn('min-h-[120px] resize-none', className)}
        {...props}
      />

      {showToolbar && selection && (
        <div
          className="absolute z-50 flex items-center gap-1 p-1 bg-background border border-border rounded-md shadow-lg"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            transform: 'translateZ(0)', // Force hardware acceleration
            pointerEvents: 'auto',
          }}
          onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking toolbar
        >
          {formatActions.map((action) => (
            <Button
              key={action.type}
              variant="ghost"
              size="icon"
              onClick={() => applyFormat(action)}
              className="h-6 w-6 p-1"
              title={action.label}
            >
              <action.icon className="h-3 w-3" />
            </Button>
          ))}
        </div>
      )}

      {/* Format guide */}
      <div className="mt-2 text-xs text-muted-foreground">
        <p>Select text to show formatting options. Supported formats:</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
          <span>*bold*</span>
          <span>_italic_</span>
          <span>~strikethrough~</span>
          <span>`monospace`</span>
          <span>```code block```</span>
        </div>
      </div>
    </div>
  );
}
