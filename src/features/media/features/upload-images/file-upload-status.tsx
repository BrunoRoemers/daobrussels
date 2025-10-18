import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, RotateCcw } from 'lucide-react';
import type { UploadStatus } from './upload-image-dialog';

interface Props {
  upload: UploadStatus;
  onRetry?: () => void;
}

export const FileUploadStatus = ({ upload, onRetry }: Props) => {
  return (
    <div className="flex justify-between">
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-md">{upload.file.name}</div>
          </TooltipTrigger>
          <TooltipContent className="border-foreground overflow-hidden border-2 p-0">
            <img
              src={URL.createObjectURL(upload.file)}
              className="relative z-10 size-64 object-cover"
            />
          </TooltipContent>
        </Tooltip>
        {upload.error && <div className="text-destructive text-xs">{upload.error}</div>}
      </div>
      <div>
        {upload.error ? (
          <Button variant="ghost" className="-m-1 size-8 p-1" onClick={onRetry}>
            <RotateCcw />
          </Button>
        ) : upload.loading ? (
          <Spinner className="size-6 p-1" />
        ) : (
          <Check className="text-success size-6" />
        )}
      </div>
    </div>
  );
};
