'use client';

import { Button } from '@/components/ui/button';
import { Expanded } from '@/components/utils/expanded';
import { ChevronLeftIcon, ChevronRightIcon, CircleMinus, CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { FileDropzone } from './file-dropzone';

interface FileData {
  file: File;
  hash: string;
}

interface Props {
  handleUpload: (files: File[]) => void;
  className?: string;
}

export const DropzoneCarousel = ({ handleUpload, className }: Props) => {
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

  const removeCurrentFile = () => {
    const newFiles = files.filter((_, i) => i !== index);
    setIndex(Math.min(index, newFiles.length - 1));
    setFiles(newFiles);
  };

  const _handleUpload = () => {
    handleUpload(files.map((f) => f.file));
  };

  return (
    <div className={className}>
      <FileDropzone
        onChange={addFiles}
        preview={hasFiles && <FilePreview file={files[index].file} />}
      >
        {hasFiles && (
          <>
            <div className="absolute top-1/2 right-4 left-4 flex -translate-y-1/2">
              <PageButton newIndex={index - 1} total={files.length} setIndex={setIndex}>
                <ChevronLeftIcon />
              </PageButton>
              <Expanded />
              <PageButton newIndex={index + 1} total={files.length} setIndex={setIndex}>
                <ChevronRightIcon />
              </PageButton>
              <AddButton index={index} total={files.length} />
            </div>
            <div className="absolute right-4 bottom-4 left-4 flex gap-2">
              <PageIndicator index={index} total={files.length} />
              <DeleteButton onClick={removeCurrentFile} />
              <Expanded />
              <UploadButton total={files.length} onClick={_handleUpload} />
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
  children,
}: {
  newIndex: number;
  total: number;
  setIndex: (i: number) => void;
  children: React.ReactNode;
}) => {
  // Only show the button if its effect is within the available range.
  if (newIndex < 0 || newIndex >= total) return null;

  return (
    <Button
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        setIndex(newIndex);
      }}
    >
      {children}
    </Button>
  );
};

const AddButton = ({ index, total }: { index: number; total: number }) => {
  // Hide if we're not on the last page.
  if (index < total - 1) return null;

  // NOTE: No need to implement a handler because the underlying input will handle it.
  return (
    <Button size="icon" asChild>
      <span>
        <CirclePlus />
      </span>
    </Button>
  );
};

const PageIndicator = ({ index, total }: { index: number; total: number }) => {
  return (
    <>
      <Button asChild>
        <span>
          {index + 1} / {total}
        </span>
      </Button>
    </>
  );
};

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:text-destructive"
      title="Skip this file"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <CircleMinus />
    </Button>
  );
};

const UploadButton = ({ total, onClick }: { total: number; onClick: () => void }) => {
  return <Button onClick={onClick}>{total > 1 ? 'Upload all' : 'Upload'}</Button>;
};
