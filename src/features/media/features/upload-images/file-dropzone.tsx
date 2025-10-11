import { cn } from '@/utils/cn';
import * as LabelPrimitive from '@radix-ui/react-label';
import type { ClassValue } from 'clsx';
import { CloudUpload } from 'lucide-react';
import { useState, type ChangeEventHandler, type DragEventHandler } from 'react';

interface Props {
  preview?: React.ReactNode;
  onChange: (files: File[]) => void;
  children?: React.ReactNode;
}

export const FileDropzone = ({ preview, onChange, children }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter: DragEventHandler = (e) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(true);
  };

  const handleDragLeave: DragEventHandler = (e) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDragOver: DragEventHandler = (e) => {
    e.preventDefault(); // Tell browser that we're waiting for a drop.
  };

  const handleFileDrop: DragEventHandler = (e) => {
    e.preventDefault(); // Prevent browser from opening the file.
    setIsDragging(false);
    onChange(Array.from(e.dataTransfer.files || []));
  };

  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsDragging(false);
    onChange(Array.from(e.target.files || []));
  };

  const previewDraggingStyles: ClassValue =
    isDragging && preview && 'after:absolute after:inset-0 after:bg-green-300/10';

  return (
    <LabelPrimitive.Root
      className="relative block h-full cursor-pointer"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleFileDrop}
    >
      <input type="file" multiple className="hidden" onChange={handleFileSelect} />
      <div className={cn('h-full', previewDraggingStyles)}>
        {preview || <UploadInstructions isDragging={isDragging} />}
      </div>
      {children}
    </LabelPrimitive.Root>
  );
};

const UploadInstructions = ({ isDragging }: { isDragging: boolean }) => {
  return (
    <div
      className={cn(
        'flex h-full flex-col items-center justify-center',
        isDragging && 'bg-green-50',
      )}
    >
      <CloudUpload size={40} className="mx-auto mb-2" />
      <span>
        <b>Click to upload</b> or drag and drop
      </span>
    </div>
  );
};
