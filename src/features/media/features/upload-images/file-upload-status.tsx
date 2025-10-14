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
        <div>{label}</div>
        {error && <div className="text-destructive">{error}</div>}
      </div>
      <div>{error ? <RotateCcw /> : loading ? <Spinner /> : <Check />}</div>
    </div>
  );
};
