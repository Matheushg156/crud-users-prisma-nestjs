import { BadRequestException, Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgotPasswordDTO } from './dto/auth-forgot-password.dto';
import { AuthResetPasswordDTO } from './dto/auth-resete-password.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decoretor';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) {}

  @Post('login')
  async login(@Body() body: AuthLoginDTO) {
    return await this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return await this.authService.register(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: AuthForgotPasswordDTO) {
    return await this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: AuthResetPasswordDTO) {
    return await this.authService.resetPassword(body.password, body.token);
  }

  @UseGuards(AuthGuard)
  @Post('check-token')
  async checkToken(@User() user) {
    return { user };
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('send-photo')
  async uploadFile(@User() user, @UploadedFile() file: Express.Multer.File) {

    const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.jpeg`)

    try {
      await this.fileService.uploadFile(file, path);

      return { 'sucess': 'Photo uploaded with sucess!' }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}