import { BadRequestException, Controller,ParseIntPipe, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import {Get,Post,Patch, Delete, Param, Body} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUser } from './dto/create-users.dto';
import { UpdateUser } from './dto/update-users.dto';
import { UserRole } from './user-role.enum';
import { AuthRequest, JwtAuthGuard  } from 'src/auth/guards/jwt-auth.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/minio/minio.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {

    constructor(
        private usersService: UsersService,
        private minioService: MinioService
    ){}


    
    @Get()
    getAllUsers(@Query('email') email: string) {
        return this.usersService.findAll(email);
    }

    @Get(':id')
    getUsersById(@Param('id') id:string) {
        return this.usersService.getUserById(+id); 
    }

    @Post()
    createUser(@Body() body: CreateUser) {
        return this.usersService.create(body);
    }

    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUser) {
      const numericId = +id;
    
      if (isNaN(numericId)) {
        throw new BadRequestException('Неверный формат ID');
      }
    
      return this.usersService.updateUser(body, numericId);
    }
    

    @Delete(':id')
    removeUser(@Param() id:string) {
        return this.usersService.deleteUser(+id);
    }

    @Patch(':id/role')
    changeUserRole(@Param('id', ParseIntPipe) id: number, @Body('role') role: UserRole){
        return this.usersService.changeUserRole(id, role);
    }

    @Get('me')
    async getCurrentUser(@Req() req: AuthRequest) {
      return this.usersService.getUserById(req.user.id);
    }

    // @Post('upload-avatar')
    // @UseInterceptors(FileInterceptor('avatar'))
    // async uploadAvatar(@UploadedFile() file: Express.Multer.File){
    //     const bucketName = 'avatars';
    //     const avatarurl = await this.minioService.uploadFile(bucketName, file);

    //     return {url:avatarurl};
    // }

    // @Get(':id/avatar')
    // async getAvatar(@Param('id') id: string) {
    //     const user = await this.usersService.getUserById(+id);
    //     if (user && user.avatartUrl) {
    //       return { url: user.avatartUrl };
    //     }
    //     throw new BadRequestException('Аватарка не найдена');
    //   }
    
}
