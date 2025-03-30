import { Body, Controller, Get, Logger, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get('user')
  async getUser(@Res() res: Response) {
    try {
      const email = 'abhisheksh21@gmail.com';
      const user = await this.authService.getUser(email);

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
  async login(@Res() res: Response) {
    try {
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
  async register(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.register(body.email, body.password);

      if (!user) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'User Already Exists!',
        });
      }

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
