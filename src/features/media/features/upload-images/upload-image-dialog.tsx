'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { DialogContentProps } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { DropzoneCarousel } from './dropzone-carousel';
import { FileUploadStatus } from './file-upload-status';

interface Props {
  button: React.ReactNode;
}

export const UploadImageDialog = ({ button }: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleDialogClose: DialogContentProps['onInteractOutside'] = (e) => {
    // TODO use e.preventDefault(); while the upload is in progress
    setFiles([]);
  };

  const handleUpload = (files: File[]) => {
    setFiles(files);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="p-0"
        showCloseButton={false}
        onInteractOutside={handleDialogClose}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Upload images</DialogTitle>
        </DialogHeader>
        {files.length <= 0 ? (
          <DropzoneCarousel className="h-72" handleUpload={handleUpload} accept="image/*" />
        ) : (
          <div className="min-h-72 p-4">
            <UploadStatusList files={files} />
            <Separator />
            <span>
              todo <b>get credit</b> for your contribution
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const UploadStatusList = ({ files }: { files: File[] }) => {
  return (
    <ul>
      {files.map((file, i) => (
        <li key={i}>
          <FileUploadStatus label={file.name} />
        </li>
      ))}
    </ul>
  );
};