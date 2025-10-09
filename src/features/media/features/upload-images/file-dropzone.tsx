'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { useState, type ChangeEventHandler, type DragEventHandler } from 'react';

export const FileDropzone = () => {
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
    <Input
      type="file"
      multiple
      className={cn('h-60 cursor-pointer border-none', isDragging && 'bg-green-50')}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onChange={onChange}
    />
  );
};
