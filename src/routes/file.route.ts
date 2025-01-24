import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import {
  downloadFile,
  getUserFiles,
  uploadFile,
} from '../controllers/file.controller';
import { isAuthenticated } from '../middleware/auth.middleware';
import { validateParams } from '../middleware/validate.middleware';
import { GetFilesQueryDto } from '../dto/get-files.dto';
import { DownloadFileDto } from '../dto/download-file.dto';
const router = Router();

// Конфигурация multer для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = req.session.userId;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
      }
    });
  }
  next(err);
});

router.post('/upload', isAuthenticated, upload.single('file'), uploadFile);

// Получение списка всех файлов
router.get(
  '/',
  isAuthenticated,
  //@ts-ignore
  validateParams(GetFilesQueryDto),
  getUserFiles
);

router.get(
  '/:fileId',
  isAuthenticated,
  //@ts-ignore
  validateParams(DownloadFileDto),
  downloadFile
);

export { router as fileRouter };
