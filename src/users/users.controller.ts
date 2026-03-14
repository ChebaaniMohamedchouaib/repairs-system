import { Controller, Post, Body, Get, Delete, Patch,Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/reset-password')
  resetPassword(@Param('id') id: string, @Body('password') pass: string) {
    return this.usersService.resetPassword(id, pass);
  }
}