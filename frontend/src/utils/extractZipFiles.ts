// src/utils/extractZipFiles.ts
import JSZip from "jszip";

export const extractZipFileNames = async (file: File): Promise<string[]> => {
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(file);

  const fileNames: string[] = [];
  zip.forEach((relativePath, fileEntry) => {
    if (!fileEntry.dir) {
      fileNames.push(relativePath);
    }
  });

  return fileNames;
};
