import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioService } from 'src/minio/minio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UsersController],
  providers: [UsersService, MinioService],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
