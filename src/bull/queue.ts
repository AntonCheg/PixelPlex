import { Job, Queue } from 'bullmq';
import { Worker } from 'bullmq';
import { FileService } from '../services/file.service';

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

const queue = new Queue('queue', { connection: redisConfig });

const worker = new Worker(
  'queue',
  async (job: Job<number>) => {
    await FileService.validateFile(job.data);
    return;
  },
  { connection: redisConfig, concurrency: 5 }
);

export { queue };
