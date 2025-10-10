'use client';

import { useState } from 'react';
import { FileDropzone } from './file-dropzone';

export const DropzoneGallery = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [index, setIndex] = useState(0);

  const hasFiles = files.length > 0;

  const addFiles = (f: File[]) => setFiles(files.concat(f));

  // TODO start upload + handle multiple files

  return (
    <div>
      <FileDropzone
        onChange={addFiles}
        preview={
          hasFiles && <img src={URL.createObjectURL(files[index])} alt={files[index].name} />
        }
      />
      <FilePagination index={index} total={files.length} />
    </div>
  );
};

const FilePagination = ({ index, total }: { index: number; total: number }) => {
  if (total < 1) return null;

  return (
    <span>
      {index + 1} / {total}
    </span>
  );
};
