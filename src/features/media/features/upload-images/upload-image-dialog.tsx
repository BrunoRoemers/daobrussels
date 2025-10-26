'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { destructFileName } from '@/utils/destruct-file-name';
import { FriendlyError } from '@/utils/friendly-error';
import { generateUnsafeBip39Name } from '@/utils/generate-unsafe-bip39-name';
import type { DialogContentProps } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { createMediaEntry } from './actions/create-media-entry';
import { getSignedUrl } from './actions/get-signed-url';
import { DropzoneCarousel } from './dropzone-carousel';
import { FileUploadStatus } from './file-upload-status';
import { uploadToBucket } from './requests/upload-to-bucket';

// NOTE: The error state is omitted on purpose, so we can pick up where we left off on retry.
export enum UploadState {
  pending,
  uploading,
  linking,
  completed,
}

export interface UploadStatus {
  file: File;
  state: UploadState;
  error?: string;
  approvedBy?: number;
}

interface Props {
  button: React.ReactNode;
  eventId: number;
}

export const UploadImageDialog = ({ button, eventId }: Props) => {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);

  const handleDialogClose: DialogContentProps['onInteractOutside'] = (e) => {
    if (uploads.some((upload) => !upload.error && upload.state !== UploadState.completed)) {
      e.preventDefault();
      return;
    }

    setUploads([]);
  };

  const startUploads = async (files: File[]) => {
    if (uploads.length > 0) throw new Error('uploads are already set');
    const renamedFiles = files.map(renameFile);
    setUploads(renamedFiles.map((file) => ({ file, state: UploadState.pending })));
    await Promise.all(renamedFiles.map(uploadFile));
  };

  const renameFile = (file: File): File => {
    const { ext } = destructFileName(file.name);
    const name = `${generateUnsafeBip39Name()}.${ext}`;
    return new File([file], name, { type: file.type });
  };

  const uploadFile = async (file: File, index: number) => {
    try {
      updateUploadStatus(index, { error: undefined });

      // NOTE: If the upload step previously succeeded, we need to skip it on retry
      //       to avoid the "file already exists" error.
      if ((uploads[index]?.state ?? UploadState.pending) <= UploadState.uploading) {
        updateUploadStatus(index, { state: UploadState.uploading });
        const signedUrl = await getSignedUrl(file.name);
        await uploadToBucket(signedUrl, file);
      }

      updateUploadStatus(index, { state: UploadState.linking });
      const { approvedBy } = await createMediaEntry(file.name, eventId);

      updateUploadStatus(index, { state: UploadState.completed, approvedBy });
    } catch (error) {
      console.error(error);
      updateUploadStatus(index, {
        error: error instanceof FriendlyError ? error.message : 'Upload failed',
      });
    }
  };

  const updateUploadStatus = (index: number, newStatus: Partial<UploadStatus>) => {
    setUploads((uploads) => {
      const newUploads = [...uploads];
      newUploads[index] = { ...newUploads[index], ...newStatus };
      return newUploads;
    });
  };

  const someCompleted = uploads.some((upload) => upload.state === UploadState.completed);
  const allApproved = uploads.every((upload) => upload.approvedBy !== undefined);
  const noneApproved = uploads.every((upload) => upload.approvedBy === undefined);

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
            {someCompleted && !allApproved && (
              <>
                <Separator />
                <div className="text-muted-foreground px-8 py-2 text-xs">
                  {noneApproved ? 'Your' : 'Some'} uploads will become public once a trusted member
                  approves them.
                </div>
              </>
            )}
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
