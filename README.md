# 🎬 Video Transcoding Service

A **production-grade video transcoding pipeline** built using **TurboRepo**, **NestJS**, **React**, **Docker**, and **FFmpeg**.  
The system is fully decoupled, supports cloud-native deployments, and converts uploaded videos to **HLS with adaptive bitrate**. Ideal for building your own YouTube-style infrastructure.

---

## 🧱 Monorepo Structure (TurboRepo)

```
video_streaming/
├── apps/
│   ├── backend/        # NestJS REST APIs (Auth, Upload, Jobs)
│   ├── frontend/       # React app for uploading & viewing progress
│   └── video/          # Worker service that handles video processing
│
├── packages/
│   ├── queue/          # BullMQ job setup
│   ├── database/       # Prisma + PostgreSQL config
│   ├── types/          # Shared TypeScript types
│   ├── utils/          # Common utilities (e.g., S3 handlers)
│   ├── eslint-config/  # Shared ESLint config
│   └── typescript-config/  # Shared tsconfig
```

---

## 🛠️ Tech Stack

| Layer         | Tech                             |
|--------------|----------------------------------|
| **Monorepo** | TurboRepo                        |
| **Backend**  | NestJS, BullMQ, Redis, Prisma     |
| **Frontend** | React + Tailwind (upload UI)     |
| **Database** | PostgreSQL                       |
| **Storage**  | AWS S3 (input + output)          |
| **Worker**   | Node.js + Docker + FFmpeg        |

---

## 🧪 How It Works

> From upload to `.m3u8` — fully automated.

1. **Frontend** allows video uploads.
2. **Backend API** receives video → stores it on **S3** → enqueues a job in **BullMQ**.
3. **Worker Service** picks the job and:
   - Launches a **Docker container**.
   - Downloads the raw video from S3.
   - Runs **FFmpeg** to transcode it into `.m3u8` HLS format with adaptive bitrate.
   - Uploads the HLS folder back to S3.
   - Logs the `master.m3u8` URL to stdout.
4. **Worker** listens to logs → extracts `HLS_READY:<URL>` → updates DB with playback URL.

---

## 📦 Dockerized FFmpeg Worker

> Custom-built lightweight FFmpeg Docker image.

```bash
docker run --rm \
  -e INPUT_URL=s3://... \
  -e OUTPUT_BUCKET=... \
  -e AWS_ACCESS_KEY_ID=... \
  -e AWS_SECRET_ACCESS_KEY=... \
  abhishekshivale21/ffmpeg
```

- Handles downloading, transcoding, and re-uploading.
- Logs HLS URL for job tracking.

---

## 📁 Repos & Links

- 🔗 **Main Repo:** [video_streaming](https://github.com/abhishek-shivale/video_streaming)
- 🐳 **Docker Image:** [Docker Hub – abhishekshivale21/ffmpeg](https://hub.docker.com/r/abhishekshivale21/ffmpeg)
- 📓 **Blog Post:** [Read the Blog](https://medium.com/@abhishekshivale/video-transcoding-service-architecture)

---

## 💻 Local Dev Setup

```bash
pnpm install
pnpm dev
```

Make sure Redis, PostgreSQL, and Docker are running locally.  
AWS credentials should be configured via environment variables or `.env`.

---

## 📜 License

MIT © Abhishek Shivale

---

Would you like me to turn this into a markdown file for direct use in your repo?
