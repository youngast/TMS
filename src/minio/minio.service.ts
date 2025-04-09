import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'your-access-key',
      secretKey: 'your-secret-key',
    });
  }

  // Загрузка файла
  async uploadFile(bucketName: string, file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}_${file.originalname}`;
    
    // Загружаем файл в MinIO
    await this.minioClient.putObject(bucketName, fileName, file.buffer, file.size);

    // Возвращаем URL файла
    return `http://localhost:9000/${bucketName}/${fileName}`;
  }
}
