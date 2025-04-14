import { Queue } from "bullmq";

const myQueue = new Queue("Videos")

export const enqueueVideo = async ({ key, message }: any) => {
  await myQueue.add(key, message);
  console.log(`Job added: ${key}`);
};