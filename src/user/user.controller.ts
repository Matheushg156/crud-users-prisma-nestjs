import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() { name, email, password }: CreateUserDTO) {
    return { name, email, password }
  }
  @Get()
  async read() {
    return { users: [] }
  }
  @Get(':id')
  async readOne(@Param('id', ParseIntPipe) id: number) {
    return { user: {}, id }
  }
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() { name, email, password }: UpdatePutUserDTO) {
    return {
      method: 'PUT',
      name, email, password,
      id
    }
  }
  @Patch(':id')
  async updatePartial(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePatchUserDTO) {
    return {
      method: 'PATCH',
      body,
      id
    }
  }
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return { id }
  }
}