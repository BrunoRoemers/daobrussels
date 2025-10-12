'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { FriendlyError } from '@/utils/friendly-error';
import type { DialogContentProps } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { DropzoneCarousel } from './dropzone-carousel';
import { FileUploadStatus } from './file-upload-status';
import { getSignedUrl } from './requests/get-signed-url';

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

  const startUploads = async (files: File[]) => {
    if (uploads.length > 0) throw new Error('uploads are already set');
    setUploads(files.map((file) => ({ label: file.name, loading: true })));
    await Promise.all(files.map(uploadFile));
  };

  const uploadFile = async (file: File, index: number) => {
    try {
      const signedUrl = await getSignedUrl(file);
      console.log(signedUrl);
    } catch (error) {
      console.error(error);
      updateUploadStatus(index, {
        error: error instanceof FriendlyError ? error.message : 'Upload failed',
      });
    } finally {
      updateUploadStatus(index, { loading: false });
    }
  };

  const updateUploadStatus = (index: number, newStatus: Partial<UploadStatus>) => {
    setUploads((uploads) => {
      const newUploads = [...uploads];
      newUploads[index] = { ...newUploads[index], ...newStatus };
      return newUploads;
    });
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
          <DropzoneCarousel className="h-72" handleUpload={startUploads} accept="image/*" />
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
