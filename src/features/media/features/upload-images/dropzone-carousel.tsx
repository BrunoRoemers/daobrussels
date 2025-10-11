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
            <PageButton
              newIndex={index - 1}
              total={files.length}
              setIndex={setIndex}
              className="absolute top-1/2 left-4 -translate-y-1/2"
            >
              <ChevronLeftIcon />
            </PageButton>
            <PageButton
              newIndex={index + 1}
              total={files.length}
              setIndex={setIndex}
              className="absolute top-1/2 right-4 -translate-y-1/2"
            >
              <ChevronRightIcon />
            </PageButton>
            <div className="absolute right-4 bottom-4 left-4 flex">
              <div className="flex-grow">
                <PageIndicator index={index} total={files.length} />
              </div>
              <UploadButton />
            </div>
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

const PageButton = ({
  newIndex,
  total,
  setIndex,
  className,
  children,
}: {
  newIndex: number;
  total: number;
  setIndex: (i: number) => void;
  className?: string;
  children: React.ReactNode;
}) => {
  // Only show the button if its effect is within the available range.
  if (newIndex < 0 || newIndex >= total) return null;

  return (
    <Button
      className={className}
      onClick={(e) => {
        e.preventDefault();
        setIndex(newIndex);
      }}
    >
      {children}
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
