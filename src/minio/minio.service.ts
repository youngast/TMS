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
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    });
  }

  // Загрузка файла
  async uploadFile(bucketName: string, file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}_${file.originalname}`;
    
    await this.minioClient.putObject(bucketName, fileName, file.buffer, file.size);

    return `http://localhost:9000/${bucketName}/${fileName}`;
  }
}
