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
import { getSignedUrl } from './requests';

interface UploadStatus {
  label: string;
  error?: string;
  loading?: boolean;
}

interface Props {
  button: React.ReactNode;
}

export const UploadImageDialog = ({ button }: Props) => {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);

  const handleDialogClose: DialogContentProps['onInteractOutside'] = (e) => {
    // TODO use e.preventDefault(); while the upload is in progress
    setUploads([]);
  };

  const updateUploadStatus = (index: number, newStatus: Partial<UploadStatus>) => {
    const newUploads = [...uploads];
    newUploads[index] = { ...newUploads[index], ...newStatus };
    setUploads(newUploads);
  };

  const startUpload = async (files: File[]) => {
    setUploads(files.map((file) => ({ label: file.name, loading: true })));

    await Promise.all(
      files.map(async (file) => {
        await getSignedUrl(file);
      }),
    );
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
        {uploads.length <= 0 ? (
          <DropzoneCarousel className="h-72" handleUpload={startUpload} accept="image/*" />
        ) : (
          <div className="min-h-72 p-4">
            <UploadStatusList uploads={uploads} />
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

const UploadStatusList = ({ uploads }: { uploads: UploadStatus[] }) => {
  return (
    <ul>
      {uploads.map((upload, i) => (
        <li key={i}>
          <FileUploadStatus label={upload.label} error={upload.error} loading={upload.loading} />
        </li>
      ))}
    </ul>
  );
};
