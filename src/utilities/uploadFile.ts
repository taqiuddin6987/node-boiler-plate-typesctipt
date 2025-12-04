import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import dotenv from 'dotenv';
import HTTP_STATUS from './http-status-codes';

dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env`,
  ),
});

// const file_extension = (type) => {
//   const allowed = ["png", "jpg", "jpeg", "gif"];
//   const ext = type.split("/").pop()?.toLowerCase() || "";
//   return allowed.includes(ext) ? ext : "";
// };

function file_extension(type: string) {
  const allowed = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/mp4',
    'video/quicktime',
  ];

  return allowed.includes(type) ? type : '';
}

async function upload(buffer: any, filename: string, directory = '') {
  let result = null;
  const saveDirectory = `public/uploads/${directory}`;
  const fullSavePath = path.resolve(saveDirectory);
  await fs.mkdir(fullSavePath, { recursive: true });
  const filePath = path.join(fullSavePath, filename);
  await fs.writeFile(filePath, buffer);

  const DOMAIN = process.env.WEB_SERVER_BASE_URL;
  // const PORT = process.env.PORT;
  // const PROTOCOL = process.env.PROTOCOL || "http";

  // const domain = DOMAIN
  //   ? `${PROTOCOL}://${DOMAIN}${PORT ? `:${PORT}` : ""}`
  //   : "http://localhost:3200";

  const domain = DOMAIN;

  result = `${domain}/${saveDirectory}/${filename}`;
  return result;
}

async function uploadFile(file: any, directory = '') {
  // Return the URL on success

  const fileData = {
    Body: file.buffer,
    Folder: directory,
    Original: file.filename,
    Type: file.mimetype,
    UniqueName: `${crypto.randomUUID()}.${file.filename.split('.').pop()}`,
  };

  const extension = file_extension(file.mimetype);

  if (!extension) {
    const invalid
      = fileData.Type || file.filename.split('.').pop() || 'unknown';
    const error = new Error(`File not uploaded: unsupported type "${invalid}"`);
    (error as any).code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw error;
  }

  const bannerUrl = await upload(
    fileData.Body,
    fileData.UniqueName,
    fileData.Folder,
  ).catch(() => {
    const error = new Error('File not upload');
    (error as any).code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw error;
  });

  return bannerUrl;
}

export default uploadFile;
