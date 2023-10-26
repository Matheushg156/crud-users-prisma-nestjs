import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  // UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { ParamId } from 'src/decorators/paramId.decoretor';
// import { LogInterceptor } from '../interceptors/log.interceptor';

// @UseInterceptors(LogInterceptor) possivel usar somente em controller ou global ou por metodo.
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userData: CreateUserDTO) {
    return await this.userService.create(userData);
  }

  @Get()
  async read() {
    return this.userService.read();
  }

  @Get(':id')
  async readOne(@ParamId() id: number) {
    return this.userService.readOne(id);
  }

  @Put(':id')
  async update(@ParamId() id: number, @Body() data: UpdatePutUserDTO) {
    return await this.userService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(@ParamId() id: number, @Body() data: UpdatePatchUserDTO) {
    return await this.userService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    return await this.userService.delete(id);
  }
}
