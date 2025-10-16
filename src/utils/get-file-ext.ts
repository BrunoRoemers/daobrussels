export const getFileExt = (fileName: string): string => {
  return fileName.split('.').slice(1).join('.') || 'unknown';
};
