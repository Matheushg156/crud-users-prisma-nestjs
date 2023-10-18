import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    return await this.prisma.user.create({
      data,
    });
  }

  async read() {
    return await this.prisma.user.findMany();
  }

  async readOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdatePutUserDTO) {
    console.log('PUT', data);
    return await this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async updatePartial(id: number, data: UpdatePatchUserDTO) {
    console.log('PATCH', data);
    return await this.prisma.user.update({
      data,
      where: { id },
    });
  }
}
