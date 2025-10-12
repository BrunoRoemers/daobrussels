import { Check, Ellipsis, RotateCcw } from 'lucide-react';

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
      <div>{error ? <RotateCcw /> : loading ? <Ellipsis /> : <Check />}</div>
    </div>
  );
};
