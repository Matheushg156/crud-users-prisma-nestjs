import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Injectable()
export class AuthService {
  private issuer = 'login'
  private audience = 'users'


  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService
    ) {}

    createToken(user: User) {
      return {
        accessToken: this.jwtService.sign({
          id: user.id,
          name: user.name,
          email: user.email
        }, {
          expiresIn: '7d',
          subject: user.id.toString(),
          issuer: this.issuer,
          audience: this.audience
        })
      }
    }

    checkToken(token: string) {
      try {
        const data = this.jwtService.verify(token, {
          issuer: this.issuer,
          audience: this.audience
        });

        return data;
      } catch (error) {
        throw new UnauthorizedException('Token invalid');
      }
    }

    isValideToken(token: string) {
      try {
        this.checkToken(token);

        return true;
      } catch (error) {
        return false;
      }
    }

    async login(email: string, password: string) {
      const user = await this.prisma.user.findFirst({
        where: { email }
      })

      if (!user) {
        throw new UnauthorizedException('Email or password incorrect');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
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

      const token = this.jwtService.sign({
        id: user.id,
      }, {
        expiresIn: '30 minutes',
        subject: user.id.toString(),
        issuer: 'forgot-password',
        audience: this.audience
      });

      await this.mailerService.sendMail({
        subject: 'Forgot password',
        to: email,
        template: 'forgot',
        context: {
          name: user.name,
          token,
        }
      })
      
      return true
    }

    async resetPassword(password: string, token: string) {
      try {
        const data = this.jwtService.verify(token, {
          issuer: 'forgot-password',
          audience: this.audience
        });

        if (isNaN(Number(data.id))) {
          throw new UnauthorizedException('Token invalid');
        }

        const id = Number(data.id);

        const salt = await bcrypt.genSalt();

        password = await bcrypt.hash(password, salt);

        const user = await this.prisma.user.update({
          where: { id },
          data: { password }
        })

        return this.createToken(user);
      } catch (error) {
        throw new UnauthorizedException('Token invalid');
      }
    }

    async register (body: AuthRegisterDTO) {
      const user = await this.userService.create(body);
      return this.createToken(user);
    }
}