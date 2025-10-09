import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileDropzone } from './file-dropzone';

interface Props {
  button: React.ReactNode;
}

export const UploadImageDialog = ({ button }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent showCloseButton={false} aria-describedby={undefined} className="p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Upload images</DialogTitle>
        </DialogHeader>
        <FileDropzone />
      </DialogContent>
    </Dialog>
  );
};
