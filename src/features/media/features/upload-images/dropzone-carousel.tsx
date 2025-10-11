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
    const nextFiles = files.concat(uniqueFiles);
    setIndex(nextFiles.length - 1);
    setFiles(nextFiles);
  };

  // TODO start upload + handle multiple files

  return (
    <div className={className}>
      <FileDropzone
        onChange={addFiles}
        preview={hasFiles && <FilePreview file={files[index].file} />}
      >
        {hasFiles && (
          <>
            <PrevButton
              index={index}
              total={files.length}
              setIndex={setIndex}
              className="absolute top-1/2 left-4 -translate-y-1/2"
            />
            <NextButton
              index={index}
              total={files.length}
              setIndex={setIndex}
              className="absolute top-1/2 right-4 -translate-y-1/2"
            />
            <PageIndicator
              index={index}
              total={files.length}
              className="absolute bottom-4 left-4"
            />
            <UploadButton className="absolute right-4 bottom-4" />
          </>
        )}
      </FileDropzone>
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
  className,
}: {
  index: number;
  total: number;
  setIndex: (index: number) => void;
  className?: string;
}) => {
  if (total < 1 || index <= 0) return null;

  return (
    <Button
      className={className}
      onClick={(e) => {
        e.preventDefault();
        setIndex(index - 1);
      }}
    >
      <ChevronLeftIcon />
    </Button>
  );
};

const NextButton = ({
  index,
  total,
  setIndex,
  className,
}: {
  index: number;
  total: number;
  setIndex: (index: number) => void;
  className?: string;
}) => {
  if (total < 1 || index >= total - 1) return null;

  return (
    <Button
      className={className}
      onClick={(e) => {
        e.preventDefault();
        setIndex(index + 1);
      }}
    >
      <ChevronRightIcon />
    </Button>
  );
};

const PageIndicator = ({
  index,
  total,
  className,
}: {
  index: number;
  total: number;
  className?: string;
}) => {
  return (
    <>
      <Button asChild className={className}>
        <span>
          {index + 1} / {total}
        </span>
      </Button>
    </>
  );
};

const UploadButton = ({ className }: { className?: string }) => {
  return <Button className={className}>Upload</Button>;
};
