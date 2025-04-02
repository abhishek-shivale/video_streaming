export interface uploadVideoDto {
  file: Buffer;
  bucket: string;
  name: string;
  mimetype: string;
}
