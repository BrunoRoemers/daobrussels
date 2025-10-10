'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { FileDropzone } from './file-dropzone';

export const DropzoneCarousel = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [index, setIndex] = useState(0);

  const hasFiles = files.length > 0;

  const addFiles = (f: File[]) => setFiles(files.concat(f));

  // TODO start upload + handle multiple files

  return (
    <div>
      <FileDropzone
        onChange={addFiles}
        preview={
          hasFiles && <img src={URL.createObjectURL(files[index])} alt={files[index].name} />
        }
      />
      <PageIndicator index={index} total={files.length} />
      <PrevButton index={index} total={files.length} setIndex={setIndex} />
      <NextButton index={index} total={files.length} setIndex={setIndex} />
    </div>
  );
};

const PrevButton = ({
  index,
  total,
  setIndex,
}: {
  index: number;
  total: number;
  setIndex: (index: number) => void;
}) => {
  if (total < 1 || index <= 0) return null;

  return (
    <Button onClick={() => setIndex(index - 1)}>
      <ChevronLeftIcon />
    </Button>
  );
};

const NextButton = ({
  index,
  total,
  setIndex,
}: {
  index: number;
  total: number;
  setIndex: (index: number) => void;
}) => {
  if (total < 1 || index >= total - 1) return null;

  return (
    <Button onClick={() => setIndex(index + 1)}>
      <ChevronRightIcon />
    </Button>
  );
};

const PageIndicator = ({ index, total }: { index: number; total: number }) => {
  if (total < 1) return null;

  return (
    <span>
      {index + 1} / {total}
    </span>
  );
};
