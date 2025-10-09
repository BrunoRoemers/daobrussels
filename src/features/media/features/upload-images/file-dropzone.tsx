'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';
import { useId, useState, type ChangeEventHandler, type DragEventHandler } from 'react';

export const FileDropzone = () => {
  const id = useId();
  const [isDragging, setIsDragging] = useState(false);

  const onDragEnter: DragEventHandler = (e) => {
    if (e.currentTarget === e.relatedTarget) return;
    setIsDragging(true);
  };

  const onDragLeave: DragEventHandler = (e) => {
    if (e.currentTarget === e.relatedTarget) return;
    setIsDragging(false);
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsDragging(false);
  };

  return (
    <div className="grid">
      <Input
        id={id}
        type="file"
        multiple
        className={cn(
          'col-span-full row-span-full h-60 cursor-pointer border-none p-0 text-transparent shadow-none file:text-transparent',
          isDragging && 'bg-green-50',
        )}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onChange={onChange}
      />
      <Label htmlFor={id} className="col-span-full row-span-full place-self-center">
        Upload images
      </Label>
    </div>
  );
};
