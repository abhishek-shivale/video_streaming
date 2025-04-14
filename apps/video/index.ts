import Docker from "dockerode";
import { config } from "dotenv";
import { prisma } from "@repo/database";
import { Worker } from "bullmq";
import IORedis from "ioredis";

config();
const docker = new Docker();
const containerName = "video-transcode";
const imageName = "abhishekshivale21/ffmpeg:latest";

const queueName = "Videos";

async function processVideo(url: string, videoID: string) {
  try {
    const AWS_REGION = process.env.AWS_REGION as string;
    const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
    const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;
    const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;

    if (
      !AWS_REGION ||
      !AWS_ACCESS_KEY_ID ||
      !AWS_SECRET_ACCESS_KEY ||
      !AWS_BUCKET_NAME
    ) {
      throw new Error("ENV is not found!!");
    }

    const images = await docker.listImages();
    const imageExists = images.some((image) =>
      image.RepoTags?.includes(imageName)
    );

    if (!imageExists) {
      throw new Error(`Image ${imageName} not found locally.`);
    }

    const containers = await docker.listContainers({ all: true });
    const existingContainer = containers.find((container) =>
      container.Names.includes("/" + containerName)
    );

    if (existingContainer) {
      console.log(
        `Container "${containerName}" already exists. ID: ${existingContainer.Id}`
      );
      return;
    }

    const container = await docker.createContainer({
      name: containerName,
      Image: imageName,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      Env: [
        `VIDEO_URL=${url}`,
        `AWS_REGION=${AWS_REGION}`,
        `AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}`,
        `AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}`,
        `AWS_BUCKET_NAME=${AWS_BUCKET_NAME}`,
      ],
    });

    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
    });
    container.modem.demuxStream(stream, process.stdout, process.stderr);

    let playlistUrl = "";

    stream.on("data", async (chunk: Buffer) => {
      const log = chunk.toString();
      console.log("📥 Log:", log);

      const match = log.match(/Master playlist URL:\s*(https?:\/\/[^\s]+)/);
      if (match && !playlistUrl) {
        playlistUrl = match[1];
        console.log("🎯 Master Playlist URL Found:", playlistUrl);

        await prisma.video.update({
          where: { id: videoID },
          data: { shareableLink: playlistUrl, status: "COMPLETED" },
        });
      }
    });

    console.log(`🚀 Starting container "${containerName}"...`);
    await container.start();

    await container.wait();

    await container.remove();
    console.log("✅ Container removed after completion.");
  } catch (err) {
    console.error("❌ Error in processVideo:", err);
  }
}

const connection = new IORedis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  queueName,
  async (job) => {
    console.log(`Processing video job ${job.id}`);
    const data = job.data;
    await processVideo(data.rawVideoUrl, data.id)
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
