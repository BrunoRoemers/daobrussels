import { cn } from '@/utils/cn';
import * as LabelPrimitive from '@radix-ui/react-label';
import { CloudUpload } from 'lucide-react';
import { useState, type ChangeEventHandler, type DragEventHandler } from 'react';

interface Props {
  preview?: React.ReactNode;
  onChange: (files: File[]) => void;
}

export const FileDropzone = ({ preview, onChange }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter: DragEventHandler = (e) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(true);
  };

  const handleDragLeave: DragEventHandler = (e) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsDragging(false);
    onChange(Array.from(e.target.files || []));
  };

  return (
    <LabelPrimitive.Root
      className={cn('relative block h-full cursor-pointer', isDragging && 'bg-green-50')}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      // TODO on drop?
    >
      <input type="file" multiple className="hidden" onChange={handleChange} />
      <div className="h-full">
        {preview || (
          <div className="flex h-full flex-col items-center justify-center">
            <CloudUpload size={40} className="mx-auto mb-2" />
            <span>
              <b>Click to upload</b> or drag and drop
            </span>
          </div>
        )}
      </div>
    </LabelPrimitive.Root>
  );
};
