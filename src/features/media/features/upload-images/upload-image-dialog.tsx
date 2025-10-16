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
import { generateUnsafeBip39Name } from '@/utils/generate-unsafe-bip39-name';
import { getFileExt } from '@/utils/get-file-ext';
import type { DialogContentProps } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { DropzoneCarousel } from './dropzone-carousel';
import { FileUploadStatus } from './file-upload-status';
import { createMediaEntry } from './requests/create-media-entry';
import { getSignedUrl } from './requests/get-signed-url';
import { uploadToBucket } from './requests/upload-to-bucket';

export interface UploadStatus {
  file: File;
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
    const renamedFiles = files.map(renameFile);
    setUploads(renamedFiles.map((file) => ({ file })));
    await Promise.all(renamedFiles.map(uploadFile));
  };

  const renameFile = (file: File): File => {
    const ext = getFileExt(file.name);
    const name = `${generateUnsafeBip39Name()}.${ext}`;
    return new File([file], name, { type: file.type });
  };

  const uploadFile = async (file: File, index: number) => {
    try {
      updateUploadStatus(index, { loading: true, error: undefined });
      const signedUrl = await getSignedUrl(file);
      await uploadToBucket(signedUrl, file);
      await createMediaEntry(file);
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
          <div className="flex min-h-72 flex-col">
            <UploadStatusList
              uploads={uploads}
              className="space-y-3 px-8 py-4"
              onRetry={uploadFile}
            />
            <Separator />
            <div className="flex-grow place-content-center px-8 py-4 text-center">
              todo <b>get credit</b> for your contribution
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const UploadStatusList = ({
  uploads,
  className,
  onRetry,
}: {
  uploads: UploadStatus[];
  className?: string;
  onRetry: (file: File, index: number) => void;
}) => {
  return (
    <ul className={className}>
      {uploads.map((upload, i) => (
        <li key={i}>
          <FileUploadStatus upload={upload} onRetry={() => onRetry(upload.file, i)} />
        </li>
      ))}
    </ul>
  );
};
