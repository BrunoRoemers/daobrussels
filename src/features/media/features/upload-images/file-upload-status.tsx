import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Check, RotateCcw } from 'lucide-react';

interface Props {
  label: string;
  error?: string;
  loading?: boolean;
}

export const FileUploadStatus = ({ label, error, loading }: Props) => {
  return (
    <div className="flex justify-between">
      <div>
        <div className="text-md">{label}</div>
        {error && <div className="text-destructive text-xs">{error}</div>}
      </div>
      <div>
        {error ? (
          <Button variant="ghost" className="-m-1 size-8 p-1">
            <RotateCcw />
          </Button>
        ) : loading ? (
          <Spinner className="size-6 p-1" />
        ) : (
          <Check className="text-success size-6" />
        )}
      </div>
    </div>
  );
};
