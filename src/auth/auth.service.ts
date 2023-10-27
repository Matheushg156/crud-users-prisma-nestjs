import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
    ) {}

    async createToken() {
      // return await this.jwtService.sign();
    }

    async checkToken() {
      // return await this.jwtService.verify();
    }

    async login(email: string, password: string) {
      const user = await this.prisma.user.findFirst({
        where: { email, password }
      })

      if (!user) {
        throw new UnauthorizedException('Email or password incorrect');
      }

      return user
    }

    async forgotPassword(email: string) {
      const user = await this.prisma.user.findFirst({
        where: { email }
      })

      if (!user) {
        throw new UnauthorizedException('Email incorrect');
      }

      // to do send email...
      return true
    }

    async resetPassword(password: string, token: string) {
      // to do check token...

      const id = 1

      await this.prisma.user.update({
        where: { id },
        data: { password }
      })

      return true
    }
}