'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { FileDropzone } from './file-dropzone';

interface FileData {
  file: File;
  hash: string;
}

interface Props {
  className?: string;
}

export const DropzoneCarousel = ({ className }: Props) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [index, setIndex] = useState(0);

  const hasFiles = files.length > 0;

  const addFiles = (f: File[]) => {
    const newFiles = f.map((file) => ({ file, hash: file.name })); // TODO calc hash
    const uniqueFiles = newFiles.filter((file) => !files.some((f) => f.hash === file.hash));
    return setFiles(files.concat(uniqueFiles));
  };

  // TODO start upload + handle multiple files

  return (
    <div className={className}>
      <FileDropzone
        onChange={addFiles}
        preview={hasFiles && <FilePreview file={files[index].file} />}
      />
      <PageIndicator index={index} total={files.length} />
      <PrevButton index={index} total={files.length} setIndex={setIndex} />
      <NextButton index={index} total={files.length} setIndex={setIndex} />
    </div>
  );
};

const FilePreview = ({ file }: { file: File }) => {
  return (
    <img className="h-full w-full object-cover" src={URL.createObjectURL(file)} alt={file.name} />
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
