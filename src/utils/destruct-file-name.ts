/**
 * Examples:
 * - "image.jpg" -> { baseName: "image", ext: "jpg" }
 * - "archive.tar.gz" -> { baseName: "archive", ext: "tar.gz" }
 */
export const destructFileName = (fileName: string): { baseName: string; ext: string } => {
  const parts = fileName.split('.');
  const baseName = parts.shift() ?? '';
  const ext = parts.join('.');
  return { baseName, ext };
};
