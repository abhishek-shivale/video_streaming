import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get()
  fetchUser() {
    return 'hello';
  }

  @Post()
  fetchUsers() {
    return 'hello';
  }
}
