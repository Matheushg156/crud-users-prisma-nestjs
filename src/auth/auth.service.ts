import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService
    ) {}

    async createToken(user: User) {
      return {
        accessToken: this.jwtService.sign({
          id: user.id,
          name: user.name,
          email: user.email
        }, {
          expiresIn: '7d',
          subject: user.id.toString(),
          issuer: 'login',
          audience: 'users'
        })
      }
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

      return this.createToken(user);
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

      const user = await this.prisma.user.update({
        where: { id },
        data: { password }
      })

      return this.createToken(user);
    }

    async register (body: AuthRegisterDTO) {
      const user = await this.userService.create(body);
      return this.createToken(user);
    }
}