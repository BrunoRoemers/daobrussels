'use client';

import { useState } from 'react';
import { FileDropzone } from './file-dropzone';

export const DropzoneGallery = () => {
  const [files, setFiles] = useState<File[]>([]);

  // TODO start upload + handle multiple files

  return (
    <FileDropzone
      onChange={setFiles}
      preview={files.length > 0 && <img src={URL.createObjectURL(files[0])} alt={files[0].name} />}
    />
  );
};
