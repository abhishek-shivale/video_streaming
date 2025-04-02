/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rawVideoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "shareableLink" TEXT NOT NULL,
    "duration" INTEGER,
    "status" "ProcessStatus" NOT NULL DEFAULT 'UPLOADED',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quality" (
    "id" TEXT NOT NULL,
    "q_144p" TEXT,
    "q_240p" TEXT,
    "q_360p" TEXT,
    "q_480p" TEXT,
    "q_720p" TEXT,
    "q_1080p" TEXT,
    "q_1440p" TEXT,
    "q_2160p" TEXT,
    "processStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processCompletedAt" TIMESTAMP(3),
    "sourceFormat" TEXT,
    "codec" TEXT,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "Quality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoView" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "VideoView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_id_key" ON "Video"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Video_shareableLink_key" ON "Video"("shareableLink");

-- CreateIndex
CREATE UNIQUE INDEX "Quality_id_key" ON "Quality"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Quality_videoId_key" ON "Quality"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoView_id_key" ON "VideoView"("id");

-- CreateIndex
CREATE INDEX "VideoView_videoId_timestamp_idx" ON "VideoView"("videoId", "timestamp");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quality" ADD CONSTRAINT "Quality_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
