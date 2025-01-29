import { File, FileStatusEnum } from '../db/models/file.model';
import path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';
import { queue } from '../bull/queue';

class FileService {
  static async findFilePath(fileId: number): Promise<string> {
    // write your code here
    const file = await File.findOne({ where: { id: fileId } });
    if (!file) {
      throw new Error('File not found');
    }
    return path.resolve(__dirname, '../../uploads', file.fileName);
  }

  static async isFileExist(userId: number, fileName: string): Promise<boolean> {
    const file = await File.findOne({ where: { userId, fileName } });
    return !!file;
  }

  static async createFile(userId: number, fileName: string): Promise<File> {
    return File.create({
      userId,
      fileName,
      status: FileStatusEnum.PENDING,
    });
  }

  static async changeFileStatus(
    fileId: number,
    status: FileStatusEnum
  ): Promise<void> {
    const file = await File.findByPk(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    file.status = status;
    await file.save();
  }

  static async getUserFiles(
    userId: number,
    statuses?: FileStatusEnum[]
  ): Promise<File[]> {
    const queryOptions = {
      where: { userId: userId },
      order: [['createdAt', 'DESC']],
    };

    if (statuses) {
      // @ts-ignore
      queryOptions.where.status = statuses;
    }

    // @ts-ignore
    const files = await File.findAll(queryOptions);

    return files;
  }

  static async getFileById(
    fileId: number,
    userId: number
  ): Promise<File | null> {
    const file = await File.findOne({ where: { id: fileId, userId } });
    return file;
  }

  static async validateFile(fileId: number): Promise<void> {
    // update file status to processing
    try {
      await this.changeFileStatus(fileId, FileStatusEnum.PROCESSING);

      // get file path
      const file = await File.findByPk(fileId);

      if (!fs.existsSync(file.path)) {
        await this.changeFileStatus(fileId, FileStatusEnum.FAILED);
        return;
      }
      const bannedWords = ['BANNED'];

      let isBannedWordFound = false;

      const fileStream = fs.createReadStream(file.path, { encoding: 'utf-8' });
      const rl = readline.createInterface({ input: fileStream });

      for await (const line of rl) {
        for (const word of bannedWords) {
          if (line.includes(word)) {
            isBannedWordFound = true;
            rl.close(); // Закрываем поток как только слово найдено
            break;
          }
        }
        if (isBannedWordFound) break;
      }

      const validationStatus = isBannedWordFound
        ? FileStatusEnum.FAILED
        : FileStatusEnum.SUCCESS;

      await this.changeFileStatus(fileId, validationStatus);

      return;
    } catch (err) {
      console.error(`Validation failed for fileId ${fileId}:`, err.message);

      await this.changeFileStatus(fileId, FileStatusEnum.PENDING);

      await queue.add('myJob', fileId, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      });
    }
  }
}

export { FileService };
