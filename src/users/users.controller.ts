import { Controller,ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import {Get,Post,Patch, Delete, Param, Body} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUser } from './dto/create-users.dto';
import { UpdateUser } from './dto/update-users.dto';
import { UserRole } from './user-role.enum';
import { AuthRequest, JwtAuthGuard  } from 'src/auth/guards/jwt-auth.guards';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {

    constructor(
        private usersService: UsersService
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
    updateUser(@Param() id: string, @Body() body: UpdateUser) {
        return this.usersService.updateUser(body, +id);
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
}
