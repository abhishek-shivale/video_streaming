import { Body, Controller, Get, Logger, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import type { loginAuthDto, registerAuthDto } from '@repo/types';
import {
  generateRefreshToken,
  generateAccessToken,
  decryptPassword,
} from '@repo/utils';
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get('user')
  async getUser(@Res() res: Response, @Body() body: { email: string }) {
    try {
      if (!body.email) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Invalid Credentials!',
        });
      }
      const user = await this.authService.getUser(body.email);
      if (!user) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'User Not Found!',
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
        message: 'User Found Successfully!',
      });
    } catch (error) {
      this.logger.error('Error in getUser endpoint:', error);
      return res.status(500).json({
        success: false,
        data: null,
        message: 'Internal Server Error',
      });
    }
  }

  @Post('login')
  async login(@Res() res: Response, @Body() body: loginAuthDto) {
    try {
      if (!body.email || !body.password) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Invalid Credentials!',
        });
      }
      const password = decryptPassword(body.password);
      // const password = body.password;
      const user = await this.authService.login({
        email: body.email,
        password,
      });
      if (!user) {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'Invalid Credentials!',
        });
      }

      const accessToken = generateAccessToken({
        email: user.email,
        id: user.id,
        name: user.name,
      });
      const refreshToken = generateRefreshToken({
        email: user.email,
        id: user.id,
        name: user.name,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: 'Login',
      });
    } catch (error) {
      this.logger.error('Error in login endpoint:', error);
      return res.status(500).json({
        success: false,
        data: null,
        message: 'Internal Server Error',
      });
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(200).json({
        success: true,
        message: 'Logout',
      });
    } catch (error) {
      this.logger.error('Error in logout endpoint:', error);
      return res.status(500).json({
        success: false,
        data: null,
        message: 'Internal Server Error',
      });
    }
  }

  @Post('register')
  async register(@Body() body: registerAuthDto, @Res() res: Response) {
    try {
      if (!body.email || !body.password || !body.name) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Invalid Credentials!',
        });
      }
      const password = decryptPassword(body.password);
      // const password = body.password;

      const user = await this.authService.register({
        email: body.email,
        password: password,
        name: body.name,
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'User Already Exists!',
        });
      }

      const accessToken = generateAccessToken({
        email: user.email,
        id: user.id,
        name: user.name,
      });
      const refreshToken = generateRefreshToken({
        email: user.email,
        id: user.id,
        name: user.name,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        success: true,
        data: user,
        message: 'User Created Successfully!',
      });
    } catch (error) {
      this.logger.error('Error in register endpoint:', error);

      return res.status(500).json({
        success: false,
        data: null,
        message: 'Internal Server Error',
      });
    }
  }
}
