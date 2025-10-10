import { cn } from '@/utils/cn';
import * as LabelPrimitive from '@radix-ui/react-label';
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

  return (
    <LabelPrimitive.Root
      className={cn('relative block h-full cursor-pointer', isDragging && 'bg-green-50')}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleFileDrop}
    >
      <input type="file" multiple className="hidden" onChange={handleFileSelect} />
      <div className="h-full">{preview || <UploadInstructions />}</div>
      {children}
    </LabelPrimitive.Root>
  );
};

const UploadInstructions = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <CloudUpload size={40} className="mx-auto mb-2" />
      <span>
        <b>Click to upload</b> or drag and drop
      </span>
    </div>
  );
};
