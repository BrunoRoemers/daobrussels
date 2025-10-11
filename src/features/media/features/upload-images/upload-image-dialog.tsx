import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropzoneCarousel } from './dropzone-carousel';

interface Props {
  button: React.ReactNode;
}

export const UploadImageDialog = ({ button }: Props) => {
  const handleUpload = (files: File[]) => {
    console.log('handleUpload', files);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent showCloseButton={false} aria-describedby={undefined} className="p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Upload images</DialogTitle>
        </DialogHeader>
        <DropzoneCarousel className="h-72" handleUpload={handleUpload} />
      </DialogContent>
    </Dialog>
  );
};
