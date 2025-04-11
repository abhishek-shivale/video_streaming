export interface uploadVideoDto {
  file: Express.Multer.File;
  userId: string;
  name: string;
  description?: string;
}

export interface CreateVideoDto {
  name: string;
  description?: string;
  file: any;
  userId: string;
}

export enum ProcessStatus {
  UPLOADED,
  PROCESSING,
  COMPLETED,
  FAILED,
}
