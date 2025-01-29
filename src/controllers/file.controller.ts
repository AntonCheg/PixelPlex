import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { addJobToQueue } from '../bull/job';
import { FileStatusEnum } from '../db/models/file.model';
import { FileService } from '../services/file.service';

export const uploadFile = async (req: Request, res: Response): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  //check file extension only .txt
  const fileExtension = path.extname(req.file.originalname);

  if (fileExtension !== '.txt') {
    return res.status(400).json({ message: 'Only .txt files are allowed' });
  }

  // check if file already exists in database for user
  const isFileExist = await FileService.isFileExist(
    req.session.userId,
    req.file.originalname
  );

  if (isFileExist) {
    return res.status(400).json({ message: 'File with this name exist!' });
  }

  const createdFile = await FileService.createFile(
    req.session.userId,
    req.file.originalname
  );

  await addJobToQueue(createdFile.id);

  res.status(200).json({
    message: 'File uploaded successfully',
    file: req.file.originalname,
  });
};

export const getUserFiles = async (req: Request, res) => {
  const { statuses } = req.query;

  // Получаем все файлы пользователя из базы данных по userId сортируем по дате создания сначала новые
  const files = await FileService.getUserFiles(
    req.session.userId,
    statuses as FileStatusEnum[]
  );

  return res.status(200).json({ files });
};

export const downloadFile = async (
  req: Request,
  res: Response
): Promise<any> => {
  //pull fileId from request params and check if fileId is a integer
  const fileId = Number(req.params.fileId);

  if (!Number.isInteger(fileId)) {
    return res.status(400).json({ message: 'Invalid fileId' });
  }

  try {
    // Получаем данные о файле из базы данных
    const fileRecord = await FileService.getFileById(
      fileId,
      req.session.userId
    );

    if (!fileRecord) {
      return res
        .status(404)
        .json({ message: 'File not found or access denied' });
    }

    // Проверяем, существует ли файл
    if (!fs.existsSync(fileRecord.path)) {
      return res
        .status(404)
        .json({ message: 'File does not exist on the server' });
    }

    // Отправляем файл пользователю
    return res.download(fileRecord.path, fileRecord.fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return res.status(500).json({ message: 'Error sending file' });
      }
    });
  } catch (err) {
    console.error('Error fetching file:', err);
    return res
      .status(500)
      .json({ message: 'An error occurred while fetching the file' });
  }
};
