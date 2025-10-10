import { cn } from '@/utils/cn';
import * as LabelPrimitive from '@radix-ui/react-label';
import { CloudUpload } from 'lucide-react';
import { useId, useState, type ChangeEventHandler, type DragEventHandler } from 'react';

interface Props {
  preview?: React.ReactNode;
  onChange: (files: File[]) => void;
}

export const FileDropzone = ({ preview, onChange }: Props) => {
  const id = useId();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter: DragEventHandler = (e) => {
    if (e.target === e.relatedTarget) return;
    setIsDragging(true);
  };

  const handleDragLeave: DragEventHandler = (e) => {
    if (e.target === e.relatedTarget) return;
    setIsDragging(false);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsDragging(false);
    onChange(Array.from(e.target.files || []));
  };

  return (
    <div className={cn('relative h-full', isDragging && 'bg-green-50')}>
      <div className="absolute inset-0">
        {preview || (
          <div className="flex h-full flex-col items-center justify-center">
            <CloudUpload size={40} className="mx-auto mb-2" />
            <LabelPrimitive.Root htmlFor={id}>
              <b>Click to upload</b> or drag and drop
            </LabelPrimitive.Root>
          </div>
        )}
      </div>
      <input
        id={id}
        type="file"
        multiple
        className="absolute inset-0 cursor-pointer text-transparent file:text-transparent"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onChange={handleChange}
      />
    </div>
  );
};
