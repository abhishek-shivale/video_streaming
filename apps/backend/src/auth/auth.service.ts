import { Injectable, Logger } from '@nestjs/common';
import { prisma } from '@repo/database';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async getUser(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with email ${email}:`, error);
      throw error;
    }
  }

  login() {
    try {
      return '';
    } catch (error) {
      this.logger.error('Error during login:', error);
      throw error;
    }
  }

  logout() {
    try {
      return '';
    } catch (error) {
      this.logger.error('Error during logout:', error);
      throw error;
    }
  }

  async register(email: string, password: string) {
    try {
      const already = await this.getUser(email);
      if (already) {
        return null;
      }

      const hashPassword = await hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashPassword,
        },
      });

      return user;
    } catch (error) {
      this.logger.error(`Error registering user with email ${email}:`, error);
      throw error;
    }
  }
}
