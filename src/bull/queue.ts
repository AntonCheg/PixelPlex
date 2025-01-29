import { Job, Queue } from 'bullmq';
import { Worker } from 'bullmq';
import { FileService } from '../services/file.service';

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  },
};

const queue = new Queue('queue', { connection: redisConfig });

const worker = new Worker(
  'queue',
  async (job: Job<number>) => {
    try {
      await FileService.validateFile(job.data);
    } catch (error) {
      console.error(`Ошибка при обработке файла ${job.data}:`, error);
      throw error;
    }
  },
  { connection: redisConfig, concurrency: 5 }
);

export { queue };
