import { queue } from './queue';

export const addJobToQueue = async (fileId: number) => {
  await queue.add('myJob', fileId);
};
